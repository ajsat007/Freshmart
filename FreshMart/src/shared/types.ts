import z from "zod";

// Category schemas
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Category = z.infer<typeof CategorySchema>;

// Product schemas
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  image_url: z.string().nullable(),
  category_id: z.number().nullable(),
  stock_quantity: z.number(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;

// User profile schemas
export const UserProfileSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  phone: z.string().nullable(),
  shipping_address: z.string().nullable(),
  billing_address: z.string().nullable(),
  is_admin: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

// Cart schemas
export const CartItemSchema = z.object({
  id: z.number(),
  cart_id: z.number(),
  product_id: z.number(),
  quantity: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  product: ProductSchema.optional(),
});

export const CartSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  items: z.array(CartItemSchema).optional(),
});

export type Cart = z.infer<typeof CartSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;

// Order schemas
export const OrderItemSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  product_id: z.number(),
  quantity: z.number(),
  price: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  product: ProductSchema.optional(),
});

export const OrderSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  status: z.string(),
  total_amount: z.number(),
  shipping_address: z.string().nullable(),
  billing_address: z.string().nullable(),
  payment_status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  items: z.array(OrderItemSchema).optional(),
});

export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;

// API request schemas
export const AddToCartSchema = z.object({
  product_id: z.number(),
  quantity: z.number().min(1),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().min(0),
});

export const CreateOrderSchema = z.object({
  shipping_address: z.string(),
  billing_address: z.string(),
});

export const UpdateProfileSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  shipping_address: z.string().optional(),
  billing_address: z.string().optional(),
});

export type AddToCartRequest = z.infer<typeof AddToCartSchema>;
export type UpdateCartItemRequest = z.infer<typeof UpdateCartItemSchema>;
export type CreateOrderRequest = z.infer<typeof CreateOrderSchema>;
export type UpdateProfileRequest = z.infer<typeof UpdateProfileSchema>;
