import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { getCookie, setCookie } from "hono/cookie";
import {
  authMiddleware,
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import {
  AddToCartSchema,
  UpdateCartItemSchema,
  CreateOrderSchema,
  UpdateProfileSchema,
} from "@/shared/types";

interface WorkerEnv {
  DB: D1Database;
  MOCHA_USERS_SERVICE_API_URL: string;
  MOCHA_USERS_SERVICE_API_KEY: string;
}

const app = new Hono<{ Bindings: WorkerEnv }>();

// CORS middleware
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Auth routes
app.get('/api/oauth/google/redirect_url', async (c) => {
  const env = c.env as WorkerEnv;
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const env = c.env as WorkerEnv;
  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

app.get("/api/users/me", authMiddleware, async (c) => {
  return c.json(c.get("user"));
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    const env = c.env as WorkerEnv;
    await deleteSession(sessionToken, {
      apiUrl: env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Categories
app.get('/api/categories', async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM categories ORDER BY name"
  ).all();

  return c.json(results);
});

// Products
app.get('/api/products', async (c) => {
  const category = c.req.query('category');
  
  let query = "SELECT * FROM products WHERE is_active = 1";
  const params: any[] = [];

  if (category) {
    query += " AND category_id = (SELECT id FROM categories WHERE slug = ?)";
    params.push(category);
  }

  query += " ORDER BY created_at DESC";

  const { results } = await c.env.DB.prepare(query).bind(...params).all();

  return c.json(results);
});

app.get('/api/products/:slug', async (c) => {
  const slug = c.req.param('slug');

  const result = await c.env.DB.prepare(
    "SELECT * FROM products WHERE slug = ? AND is_active = 1"
  ).bind(slug).first();

  if (!result) {
    return c.json({ error: "Product not found" }, 404);
  }

  return c.json(result);
});

// User profile
app.get('/api/profile', authMiddleware, async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  
  let profile = await c.env.DB.prepare(
    "SELECT * FROM user_profiles WHERE user_id = ?"
  ).bind(user.id).first();

  if (!profile) {
    // Create default profile
    const result = await c.env.DB.prepare(
      "INSERT INTO user_profiles (user_id, created_at, updated_at) VALUES (?, datetime('now'), datetime('now'))"
    ).bind(user.id).run();

    profile = await c.env.DB.prepare(
      "SELECT * FROM user_profiles WHERE id = ?"
    ).bind(result.meta.last_row_id).first();
  }

  return c.json(profile);
});

app.put('/api/profile', authMiddleware, zValidator('json', UpdateProfileSchema), async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const data = c.req.valid('json');

  await c.env.DB.prepare(
    "UPDATE user_profiles SET first_name = ?, last_name = ?, phone = ?, shipping_address = ?, billing_address = ?, updated_at = datetime('now') WHERE user_id = ?"
  ).bind(
    data.first_name || null,
    data.last_name || null,
    data.phone || null,
    data.shipping_address || null,
    data.billing_address || null,
    user.id
  ).run();

  const profile = await c.env.DB.prepare(
    "SELECT * FROM user_profiles WHERE user_id = ?"
  ).bind(user.id).first();

  return c.json(profile);
});

// Cart
app.get('/api/cart', authMiddleware, async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  // Get or create cart
  let cart = await c.env.DB.prepare(
    "SELECT * FROM carts WHERE user_id = ?"
  ).bind(user.id).first();

  if (!cart) {
    const result = await c.env.DB.prepare(
      "INSERT INTO carts (user_id, created_at, updated_at) VALUES (?, datetime('now'), datetime('now'))"
    ).bind(user.id).run();

    cart = await c.env.DB.prepare(
      "SELECT * FROM carts WHERE id = ?"
    ).bind(result.meta.last_row_id).first();
  }

  // Get cart items with product details
  const { results: items } = await c.env.DB.prepare(`
    SELECT ci.*, p.name, p.price, p.image_url, p.stock_quantity
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = ?
    ORDER BY ci.created_at DESC
  `).bind(cart!.id).all();

  return c.json({ ...cart, items });
});

app.post('/api/cart/items', authMiddleware, zValidator('json', AddToCartSchema), async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const { product_id, quantity } = c.req.valid('json');

  // Get or create cart
  let cart = await c.env.DB.prepare(
    "SELECT * FROM carts WHERE user_id = ?"
  ).bind(user.id).first();

  if (!cart) {
    const result = await c.env.DB.prepare(
      "INSERT INTO carts (user_id, created_at, updated_at) VALUES (?, datetime('now'), datetime('now'))"
    ).bind(user.id).run();

    cart = await c.env.DB.prepare(
      "SELECT * FROM carts WHERE id = ?"
    ).bind(result.meta.last_row_id).first();
  }

  // Check if item already exists in cart
  const existingItem = await c.env.DB.prepare(
    "SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?"
  ).bind(cart!.id, product_id).first();

  if (existingItem) {
    // Update quantity
    await c.env.DB.prepare(
      "UPDATE cart_items SET quantity = quantity + ?, updated_at = datetime('now') WHERE id = ?"
    ).bind(quantity, existingItem.id).run();
  } else {
    // Add new item
    await c.env.DB.prepare(
      "INSERT INTO cart_items (cart_id, product_id, quantity, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))"
    ).bind(cart!.id, product_id, quantity).run();
  }

  return c.json({ success: true });
});

app.put('/api/cart/items/:id', authMiddleware, zValidator('json', UpdateCartItemSchema), async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const itemId = parseInt(c.req.param('id'));
  const { quantity } = c.req.valid('json');

  if (quantity === 0) {
    await c.env.DB.prepare(
      "DELETE FROM cart_items WHERE id = ? AND cart_id IN (SELECT id FROM carts WHERE user_id = ?)"
    ).bind(itemId, user.id).run();
  } else {
    await c.env.DB.prepare(
      "UPDATE cart_items SET quantity = ?, updated_at = datetime('now') WHERE id = ? AND cart_id IN (SELECT id FROM carts WHERE user_id = ?)"
    ).bind(quantity, itemId, user.id).run();
  }

  return c.json({ success: true });
});

app.delete('/api/cart/items/:id', authMiddleware, async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const itemId = parseInt(c.req.param('id'));

  await c.env.DB.prepare(
    "DELETE FROM cart_items WHERE id = ? AND cart_id IN (SELECT id FROM carts WHERE user_id = ?)"
  ).bind(itemId, user.id).run();

  return c.json({ success: true });
});

// Orders
app.get('/api/orders', authMiddleware, async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC"
  ).bind(user.id).all();

  return c.json(results);
});

app.post('/api/orders', authMiddleware, zValidator('json', CreateOrderSchema), async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const { shipping_address, billing_address } = c.req.valid('json');

  // Get cart
  const cart = await c.env.DB.prepare(
    "SELECT * FROM carts WHERE user_id = ?"
  ).bind(user.id).first();

  if (!cart) {
    return c.json({ error: "Cart not found" }, 404);
  }

  // Get cart items
  const { results: cartItems } = await c.env.DB.prepare(`
    SELECT ci.*, p.price
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    WHERE ci.cart_id = ?
  `).bind(cart.id).all();

  if (!cartItems.length) {
    return c.json({ error: "Cart is empty" }, 400);
  }

  // Calculate total
  const totalAmount = cartItems.reduce((total: number, item: any) => 
    total + (item.price * item.quantity), 0
  );

  // Create order
  const orderResult = await c.env.DB.prepare(
    "INSERT INTO orders (user_id, status, total_amount, shipping_address, billing_address, payment_status, created_at, updated_at) VALUES (?, 'pending', ?, ?, ?, 'pending', datetime('now'), datetime('now'))"
  ).bind(user.id, totalAmount, shipping_address, billing_address).run();

  const orderId = orderResult.meta.last_row_id;

  // Create order items
  for (const item of cartItems) {
    await c.env.DB.prepare(
      "INSERT INTO order_items (order_id, product_id, quantity, price, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))"
    ).bind(orderId, item.product_id, item.quantity, item.price).run();
  }

  // Clear cart
  await c.env.DB.prepare("DELETE FROM cart_items WHERE cart_id = ?").bind(cart!.id).run();

  // Get created order
  const order = await c.env.DB.prepare(
    "SELECT * FROM orders WHERE id = ?"
  ).bind(orderId).first();

  return c.json(order);
});

// Admin routes
app.get('/api/admin/products', authMiddleware, async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  
  // Check if user is admin
  const profile = await c.env.DB.prepare(
    "SELECT * FROM user_profiles WHERE user_id = ? AND is_admin = 1"
  ).bind(user.id).first();

  if (!profile) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM products ORDER BY created_at DESC"
  ).all();

  return c.json(results);
});

app.get('/api/admin/orders', authMiddleware, async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  
  // Check if user is admin
  const profile = await c.env.DB.prepare(
    "SELECT * FROM user_profiles WHERE user_id = ? AND is_admin = 1"
  ).bind(user.id).first();

  if (!profile) {
    return c.json({ error: "Unauthorized" }, 403);
  }

  const { results } = await c.env.DB.prepare(`
    SELECT o.*, up.first_name, up.last_name
    FROM orders o
    LEFT JOIN user_profiles up ON o.user_id = up.user_id
    ORDER BY o.created_at DESC
  `).all();

  return c.json(results);
});

export default app;
