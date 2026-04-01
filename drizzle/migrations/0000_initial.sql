-- Initial migration: Create tables and seed with initial dishes

-- Create dishes table with all columns
CREATE TABLE IF NOT EXISTS dishes (
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	description TEXT,
	image_path TEXT,
	image_attribution TEXT,
	elo REAL NOT NULL DEFAULT 1200,
	created_at INTEGER NOT NULL
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
	id TEXT PRIMARY KEY,
	dish_id TEXT NOT NULL REFERENCES dishes(id),
	value INTEGER NOT NULL,
	fingerprint TEXT NOT NULL,
	created_at INTEGER NOT NULL
);

-- Create rate_limits table
CREATE TABLE IF NOT EXISTS rate_limits (
	id TEXT PRIMARY KEY,
	fingerprint TEXT NOT NULL,
	action TEXT NOT NULL,
	window_start INTEGER NOT NULL,
	count INTEGER NOT NULL DEFAULT 1
);

-- Seed: Initial 10 potato dishes
INSERT INTO dishes (id, name, description, image_path, elo, created_at) VALUES
	('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Mashed Potatoes', 'Creamy whipped potatoes with butter and cream', 'mashed-potatoes.jpg', 1200, unixepoch()),
	('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'French Fries', 'Crispy golden-fried potato strips', 'french-fries.jpg', 1200, unixepoch()),
	('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Baked Potato', 'Fluffy whole potato baked until tender with crispy skin', 'baked-potato.jpg', 1200, unixepoch()),
	('d4e5f6a7-b8c9-0123-def1-234567890123', 'Potato Soup', 'Hearty creamy soup loaded with chunks of potato', 'potato-soup.jpg', 1200, unixepoch()),
	('e5f6a7b8-c9d0-1234-ef12-345678901234', 'Potato Salad', 'Chilled diced potatoes in a tangy dressing with herbs', 'potato-salad.jpg', 1200, unixepoch()),
	('f6a7b8c9-d0e1-2345-f123-456789012345', 'Hash Browns', 'Shredded potato patties pan-fried until golden and crispy', 'hash-browns.jpg', 1200, unixepoch()),
	('a7b8c9d0-e1f2-3456-1234-567890123456', 'Potato Gratin', 'Thinly sliced potatoes layered with cream and melted cheese', 'potato-gratin.jpg', 1200, unixepoch()),
	('b8c9d0e1-f2a3-4567-2345-678901234567', 'Shepherd''s Pie', 'Savory meat filling topped with fluffy mashed potato crust', 'shepherds-pie.jpg', 1200, unixepoch()),
	('c9d0e1f2-a3b4-5678-3456-789012345678', 'Potato Gnocchi', 'Soft pillowy potato dumplings served with your favorite sauce', 'potato-gnocchi.jpg', 1200, unixepoch()),
	('d0e1f2a3-b4c5-6789-4567-890123456789', 'Potato Latkes', 'Crispy pan-fried potato pancakes traditionally served with sour cream', 'potato-latkes.jpg', 1200, unixepoch());

-- Seed: Additional 20 potato dishes
INSERT INTO dishes (id, name, description, image_path, elo, created_at) VALUES
	('a7c3e9f1-2b4d-5f8a-9c1e-3d7b5f2a8c6e', 'Potato Wedges', 'Thick-cut seasoned potato wedges baked until crispy', 'potato-wedges.jpg', 1200, unixepoch()),
	('b8d4f0a2-3c5e-6b9f-0d2f-4e8c6a3b9d7f', 'Scalloped Potatoes', 'Thinly sliced potatoes baked in a creamy sauce', 'scalloped-potatoes.jpg', 1200, unixepoch()),
	('c9e5a1b3-4d6f-7c0a-1e3a-5f9d7b4c0e8a', 'Potato Skins', 'Crispy roasted potato skins loaded with cheese and bacon', 'potato-skins.jpg', 1200, unixepoch()),
	('d0f6b2c4-5e7a-8d1b-2f4b-6a0e8c5d1f9b', 'Tater Tots', 'Golden bite-sized fried potato cylinders', 'tater-tots.jpg', 1200, unixepoch()),
	('e1a7c3d5-6f8b-9e2c-3c5c-7b1f9d6e2a0c', 'Potato Chips', 'Thin crispy fried potato slices', 'potato-chips.jpg', 1200, unixepoch()),
	('f2b8d4e6-7a9c-0f3d-4d6d-8c2a0e7f3b1d', 'Roasted Potatoes', 'Oven-roasted potatoes with herbs and seasoning', 'roasted-potatoes.jpg', 1200, unixepoch()),
	('a3c9e5f7-8b0d-1a4e-5e7e-9d3b1f8a4c2e', 'Potato Pancakes', 'Crispy fried potato patties', 'potato-pancakes.jpg', 1200, unixepoch()),
	('b4d0f6a8-9c1e-2b5f-6f8f-0e4c2a9b5d3f', 'Colcannon', 'Irish mashed potatoes with cabbage and onions', 'colcannon.jpg', 1200, unixepoch()),
	('c5e1a7b9-0d2f-3c6a-7a9a-1f5d3b0c6e4a', 'Boxty', 'Irish potato pancake made with mashed and raw potatoes', 'boxty.jpg', 1200, unixepoch()),
	('d6f2b8c0-1e3a-4d7b-8b0b-2a6e4c1d7f5b', 'Potato Croquettes', 'Fried mashed potato balls with crispy breadcrumb coating', 'potato-croquettes.jpg', 1200, unixepoch()),
	('e7a3c9d1-2f4b-5e8c-9c1c-3b7f5d2e8a6c', 'Patatas Bravas', 'Spanish fried potatoes with spicy tomato sauce', 'patatas-bravas.jpg', 1200, unixepoch()),
	('f8b4d0e2-3a5c-6f9d-0d2d-4c8a6e3f9b7d', 'Potato Curry', 'Spicy Indian curry with tender potato chunks', 'potato-curry.jpg', 1200, unixepoch()),
	('a9c5e1f3-4b6d-7a0e-1e3e-5d9b7f4a0c8e', 'Spanish Tortilla', 'Thick potato and onion omelette', 'spanish-tortilla.jpg', 1200, unixepoch()),
	('b0d6f2a4-5c7e-8b1f-2f4f-6e0c8a5b1d9f', 'Potato Rosti', 'Swiss shredded potato pancake', 'potato-rosti.jpg', 1200, unixepoch()),
	('c1e7a3b5-6d8f-9c2a-3a5a-7f1d9b6e2a0c', 'Funeral Potatoes', 'Cheesy potato casserole with cornflake topping', 'funeral-potatoes.jpg', 1200, unixepoch()),
	('d2f8b4c6-7e9a-0d3b-4b6b-8a2e0c7f3b1d', 'Potato Leek Soup', 'Creamy soup with potatoes and leeks', 'potato-leek-soup.jpg', 1200, unixepoch()),
	('e3a9c5d7-8f0b-1e4c-5c7c-9b3f1d8a4c2e', 'Pommes Anna', 'French layered potato cake baked in butter', 'pommes-anna.jpg', 1200, unixepoch()),
	('f4b0d6e8-9a1c-2f5d-6d8d-0c4a2e9b5d3f', 'Potato Pierogi', 'Polish dumplings stuffed with mashed potatoes', 'potato-pierogi.jpg', 1200, unixepoch()),
	('a5c1e7f9-0b2d-3a6e-7e9e-1d5b3f0c6e4a', 'Sweet Potato Fries', 'Crispy fried sweet potato strips', 'sweet-potato-fries.jpg', 1200, unixepoch()),
	('b6d2f8a0-1c3e-4b7f-8f0f-2e6c4a1d7f5b', 'Twice Baked Potatoes', 'Baked potatoes with filling mixed and piped back in', 'twice-baked-potatoes.jpg', 1200, unixepoch());
