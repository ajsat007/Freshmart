
INSERT INTO categories (name, slug, description) VALUES 
('Electronics', 'electronics', 'Latest electronic gadgets and devices'),
('Clothing', 'clothing', 'Fashion and apparel for all occasions'),
('Home & Garden', 'home-garden', 'Everything for your home and garden'),
('Sports', 'sports', 'Sports equipment and outdoor gear'),
('Books', 'books', 'Books, e-books and educational materials');

INSERT INTO products (name, slug, description, price, image_url, category_id, stock_quantity) VALUES 
('Wireless Headphones', 'wireless-headphones', 'Premium noise-cancelling wireless headphones with 30h battery life', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 1, 50),
('Smart Watch', 'smart-watch', 'Advanced fitness tracking with heart rate monitor and GPS', 299.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 1, 30),
('Laptop Backpack', 'laptop-backpack', 'Durable laptop backpack with multiple compartments', 79.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 1, 100),
('Designer T-Shirt', 'designer-t-shirt', 'Premium cotton t-shirt with modern design', 29.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 2, 200),
('Running Shoes', 'running-shoes', 'Lightweight running shoes with advanced cushioning', 129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 2, 75),
('Coffee Maker', 'coffee-maker', 'Programmable coffee maker with thermal carafe', 89.99, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500', 3, 40),
('Yoga Mat', 'yoga-mat', 'Non-slip yoga mat with extra thickness for comfort', 39.99, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500', 4, 120),
('Basketball', 'basketball', 'Official size basketball for indoor and outdoor play', 24.99, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500', 4, 60);
