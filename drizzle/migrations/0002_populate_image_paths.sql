-- Migration: Populate image_path for existing dishes

UPDATE dishes SET image_path = 'mashed-potatoes.jpg' WHERE name = 'Mashed Potatoes';
UPDATE dishes SET image_path = 'french-fries.jpg' WHERE name = 'French Fries';
UPDATE dishes SET image_path = 'baked-potato.jpg' WHERE name = 'Baked Potato';
UPDATE dishes SET image_path = 'potato-soup.jpg' WHERE name = 'Potato Soup';
UPDATE dishes SET image_path = 'potato-salad.jpg' WHERE name = 'Potato Salad';
UPDATE dishes SET image_path = 'hash-browns.jpg' WHERE name = 'Hash Browns';
UPDATE dishes SET image_path = 'potato-gratin.jpg' WHERE name = 'Potato Gratin';
UPDATE dishes SET image_path = 'shepherds-pie.jpg' WHERE name = 'Shepherd''s Pie';
UPDATE dishes SET image_path = 'potato-gnocchi.jpg' WHERE name = 'Potato Gnocchi';
UPDATE dishes SET image_path = 'potato-latkes.jpg' WHERE name = 'Potato Latkes';
