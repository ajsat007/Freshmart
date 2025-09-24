
-- Restore original data
DELETE FROM cart_items;
DELETE FROM order_items;
DELETE FROM products;
DELETE FROM categories;

-- Restore original categories
INSERT INTO categories (name, slug, description, created_at, updated_at) VALUES
('Electronics', 'electronics', 'Latest electronic gadgets and devices', datetime('now'), datetime('now')),
('Clothing', 'clothing', 'Fashion and apparel for all occasions', datetime('now'), datetime('now')),
('Home & Garden', 'home-garden', 'Everything for your home and garden', datetime('now'), datetime('now')),
('Sports', 'sports', 'Sports equipment and outdoor gear', datetime('now'), datetime('now')),
('Books', 'books', 'Books, e-books and educational materials', datetime('now'), datetime('now'));

-- Restore original products
INSERT INTO products (name, slug, description, price, image_url, category_id, stock_quantity, is_active, created_at, updated_at) VALUES
('Wireless Headphones', 'wireless-headphones', 'Premium noise-cancelling wireless headphones with 30h battery life', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 1, 50, 1, datetime('now'), datetime('now')),
('Smart Watch', 'smart-watch', 'Advanced fitness tracking with heart rate monitor and GPS', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 1, 30, 1, datetime('now'), datetime('now')),
('Laptop Backpack', 'laptop-backpack', 'Durable laptop backpack with multiple compartments', 79.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 1, 100, 1, datetime('now'), datetime('now')),
('Designer T-Shirt', 'designer-t-shirt', 'Premium cotton t-shirt with modern design', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 2, 200, 1, datetime('now'), datetime('now')),
('Running Shoes', 'running-shoes', 'Lightweight running shoes with advanced cushioning', 129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 2, 75, 1, datetime('now'), datetime('now'));
