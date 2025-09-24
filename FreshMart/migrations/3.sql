
-- Clear existing data
DELETE FROM cart_items;
DELETE FROM order_items;
DELETE FROM products;
DELETE FROM categories;

-- Insert grocery categories
INSERT INTO categories (name, slug, description, created_at, updated_at) VALUES
('Fruits & Vegetables', 'fruits-vegetables', 'Fresh fruits and vegetables daily', datetime('now'), datetime('now')),
('Dairy & Eggs', 'dairy-eggs', 'Fresh milk, yogurt, cheese and eggs', datetime('now'), datetime('now')),
('Rice & Grains', 'rice-grains', 'Basmati rice, wheat, pulses and cereals', datetime('now'), datetime('now')),
('Spices & Seasonings', 'spices-seasonings', 'Traditional Indian spices and masalas', datetime('now'), datetime('now')),
('Oils & Ghee', 'oils-ghee', 'Cooking oils, ghee and other fats', datetime('now'), datetime('now')),
('Snacks & Beverages', 'snacks-beverages', 'Tea, coffee, biscuits and snacks', datetime('now'), datetime('now')),
('Personal Care', 'personal-care', 'Soaps, shampoos and hygiene products', datetime('now'), datetime('now')),
('Household Items', 'household-items', 'Cleaning supplies and kitchen essentials', datetime('now'), datetime('now'));

-- Insert grocery products
INSERT INTO products (name, slug, description, price, image_url, category_id, stock_quantity, is_active, created_at, updated_at) VALUES
-- Fruits & Vegetables
('Fresh Bananas (1 Dozen)', 'fresh-bananas-dozen', 'Fresh yellow bananas, perfect for daily consumption', 60.00, 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500', 1, 100, 1, datetime('now'), datetime('now')),
('Tomatoes (1 Kg)', 'tomatoes-1kg', 'Fresh red tomatoes, locally sourced', 40.00, 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=500', 1, 150, 1, datetime('now'), datetime('now')),
('Onions (1 Kg)', 'onions-1kg', 'Quality onions for your daily cooking needs', 35.00, 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500', 1, 200, 1, datetime('now'), datetime('now')),
('Green Leafy Vegetables Bundle', 'green-leafy-vegetables', 'Fresh spinach, coriander, and mint leaves', 25.00, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500', 1, 80, 1, datetime('now'), datetime('now')),

-- Dairy & Eggs
('Fresh Milk (1 Liter)', 'fresh-milk-1liter', 'Pure cow milk, delivered fresh daily', 55.00, 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500', 2, 50, 1, datetime('now'), datetime('now')),
('Farm Fresh Eggs (30 pcs)', 'farm-fresh-eggs-30', 'Free-range chicken eggs, protein rich', 180.00, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500', 2, 40, 1, datetime('now'), datetime('now')),
('Paneer (500g)', 'paneer-500g', 'Fresh homemade paneer, soft and creamy', 220.00, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500', 2, 30, 1, datetime('now'), datetime('now')),
('Yogurt (500g)', 'yogurt-500g', 'Thick and creamy homemade yogurt', 45.00, 'https://images.unsplash.com/photo-1571212515416-888b9b379c2d?w=500', 2, 60, 1, datetime('now'), datetime('now')),

-- Rice & Grains
('Basmati Rice (5 Kg)', 'basmati-rice-5kg', 'Premium aged basmati rice, long grain', 450.00, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500', 3, 100, 1, datetime('now'), datetime('now')),
('Whole Wheat Flour (5 Kg)', 'wheat-flour-5kg', 'Fresh ground wheat flour for rotis', 200.00, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500', 3, 80, 1, datetime('now'), datetime('now')),
('Toor Dal (1 Kg)', 'toor-dal-1kg', 'Premium quality toor dal (pigeon peas)', 120.00, 'https://images.unsplash.com/photo-1599909533730-fa4834dcf2bb?w=500', 3, 150, 1, datetime('now'), datetime('now')),
('Chana Dal (1 Kg)', 'chana-dal-1kg', 'Split chickpeas, protein rich pulse', 110.00, 'https://images.unsplash.com/photo-1599909533730-fa4834dcf2bb?w=500', 3, 120, 1, datetime('now'), datetime('now')),

-- Spices & Seasonings
('Garam Masala (100g)', 'garam-masala-100g', 'Authentic Indian garam masala blend', 85.00, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500', 4, 200, 1, datetime('now'), datetime('now')),
('Turmeric Powder (250g)', 'turmeric-powder-250g', 'Pure turmeric powder, anti-inflammatory', 60.00, 'https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=500', 4, 180, 1, datetime('now'), datetime('now')),
('Red Chili Powder (250g)', 'red-chili-powder-250g', 'Hot and spicy red chili powder', 75.00, 'https://images.unsplash.com/photo-1583623025817-d180a2221e0a?w=500', 4, 160, 1, datetime('now'), datetime('now')),
('Cumin Seeds (250g)', 'cumin-seeds-250g', 'Aromatic cumin seeds for tempering', 180.00, 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500', 4, 140, 1, datetime('now'), datetime('now')),

-- Oils & Ghee
('Pure Cow Ghee (500ml)', 'pure-cow-ghee-500ml', 'Traditional clarified butter, pure and aromatic', 380.00, 'https://images.unsplash.com/photo-1628776760434-4d19e0e88c0e?w=500', 5, 50, 1, datetime('now'), datetime('now')),
('Sunflower Oil (1 Liter)', 'sunflower-oil-1liter', 'Refined sunflower oil for cooking', 140.00, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500', 5, 80, 1, datetime('now'), datetime('now')),
('Mustard Oil (500ml)', 'mustard-oil-500ml', 'Pure mustard oil, ideal for Indian cooking', 120.00, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500', 5, 60, 1, datetime('now'), datetime('now')),

-- Snacks & Beverages
('Premium Tea (250g)', 'premium-tea-250g', 'Assam tea leaves, strong and aromatic', 180.00, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500', 6, 100, 1, datetime('now'), datetime('now')),
('Coffee Powder (250g)', 'coffee-powder-250g', 'South Indian filter coffee powder', 220.00, 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500', 6, 80, 1, datetime('now'), datetime('now')),
('Glucose Biscuits (200g)', 'glucose-biscuits-200g', 'Healthy glucose biscuits for snacking', 35.00, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500', 6, 200, 1, datetime('now'), datetime('now')),
('Namkeen Mix (250g)', 'namkeen-mix-250g', 'Crunchy Indian snack mix', 65.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500', 6, 150, 1, datetime('now'), datetime('now')),

-- Personal Care
('Neem Soap (125g)', 'neem-soap-125g', 'Natural neem soap for healthy skin', 45.00, 'https://images.unsplash.com/photo-1617897903246-719242758050?w=500', 7, 100, 1, datetime('now'), datetime('now')),
('Ayurvedic Shampoo (200ml)', 'ayurvedic-shampoo-200ml', 'Herbal shampoo for strong hair', 180.00, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500', 7, 70, 1, datetime('now'), datetime('now')),
('Toothpaste (150g)', 'toothpaste-150g', 'Herbal toothpaste for complete oral care', 85.00, 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500', 7, 120, 1, datetime('now'), datetime('now')),

-- Household Items
('Dish Wash Liquid (500ml)', 'dish-wash-liquid-500ml', 'Effective grease cutting dish wash liquid', 95.00, 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500', 8, 80, 1, datetime('now'), datetime('now')),
('Floor Cleaner (1 Liter)', 'floor-cleaner-1liter', 'Disinfectant floor cleaner with fresh fragrance', 120.00, 'https://images.unsplash.com/photo-1585999865915-84c609cf6da9?w=500', 8, 60, 1, datetime('now'), datetime('now')),
('Laundry Detergent (1 Kg)', 'laundry-detergent-1kg', 'Powerful stain removal detergent powder', 160.00, 'https://images.unsplash.com/photo-1558618644-fbd4c41d5842?w=500', 8, 90, 1, datetime('now'), datetime('now'));
