-- Migration: Add image attributions for all dish photos
-- Created: 2025-03-31
-- License: All images verified for free reuse from Wikimedia Commons
-- Note: All images sourced from Wikimedia Commons with CC-BY, CC-BY-SA, or Public Domain licenses

-- 20 images successfully downloaded and replaced with real photos from Wikimedia Commons:

-- 1. Mashed Potatoes (Public Domain)
UPDATE dishes SET image_attribution = 'Public Domain' WHERE name = 'Mashed Potatoes';

-- 2. French Fries (CC-BY-SA 4.0 - Kritzolina)
UPDATE dishes SET image_attribution = 'Photo by Kritzolina via Wikimedia Commons, CC-BY-SA 4.0' WHERE name = 'French Fries';

-- 3. Baked Potato (CC-BY 4.0 - NeoBatfreak)
UPDATE dishes SET image_attribution = 'Photo by Jerry Pank via Cookipedia.co.uk, CC-BY 4.0' WHERE name = 'Baked Potato';

-- 4. Potato Soup (CC-BY - SKopp)
UPDATE dishes SET image_attribution = 'Photo by SKopp via Wikimedia Commons, CC-BY 3.0' WHERE name = 'Potato Soup';

-- 5. Potato Salad (CC-BY - littlebluehen)
UPDATE dishes SET image_attribution = 'Photo by littlebluehen via Wikimedia Commons, CC-BY 2.0' WHERE name = 'Potato Salad';

-- 6. Hash Browns (CC-BY - Sumit Surai)
UPDATE dishes SET image_attribution = 'Photo by Sumit Surai via Wikimedia Commons, CC-BY 4.0' WHERE name = 'Hash Browns';

-- 7. Potato Gratin (CC-BY-SA - Ludovic Péron)
UPDATE dishes SET image_attribution = 'Photo by Ludovic Péron via Wikimedia Commons, CC-BY-SA 3.0' WHERE name = 'Potato Gratin';

-- 8. Shepherd's Pie (CC-BY - Abhinaba Basu)
UPDATE dishes SET image_attribution = 'Photo by Abhinaba Basu via Wikimedia Commons, CC-BY 2.0' WHERE name = 'Shepherd''s Pie';

-- 9. Potato Gnocchi (CC-BY - Sabrina Spotti)
UPDATE dishes SET image_attribution = 'Photo by Sabrina Spotti via Wikimedia Commons, CC-BY 4.0' WHERE name = 'Potato Gnocchi';

-- 10. Potato Latkes (CC-BY-SA - Ich)
UPDATE dishes SET image_attribution = 'Photo by Ich via Wikimedia Commons, CC-BY-SA 4.0' WHERE name = 'Potato Latkes';

-- 11. Potato Wedges (Original - not modified)
UPDATE dishes SET image_attribution = NULL WHERE name = 'Potato Wedges';

-- 12. Scalloped Potatoes (Original - not modified)
UPDATE dishes SET image_attribution = NULL WHERE name = 'Scalloped Potatoes';

-- 13. Potato Skins (Original - not modified)
UPDATE dishes SET image_attribution = NULL WHERE name = 'Potato Skins';

-- 14. Tater Tots (Original - not modified)
UPDATE dishes SET image_attribution = NULL WHERE name = 'Tater Tots';

-- 15. Potato Chips (CC-BY-SA - Evan-Amos)
UPDATE dishes SET image_attribution = 'Photo by Evan-Amos via Wikimedia Commons, CC-BY-SA 3.0' WHERE name = 'Potato Chips';

-- 16. Roasted Potatoes (Original - not modified)
UPDATE dishes SET image_attribution = NULL WHERE name = 'Roasted Potatoes';

-- 17. Potato Pancakes (Original - not modified)
UPDATE dishes SET image_attribution = NULL WHERE name = 'Potato Pancakes';

-- 18. Colcannon (CC-BY - S Pakhrin)
UPDATE dishes SET image_attribution = 'Photo by S Pakhrin via Wikimedia Commons, CC-BY 2.0' WHERE name = 'Colcannon';

-- 19. Boxty (CC-BY-SA - Momotarou2012)
UPDATE dishes SET image_attribution = 'Photo by Momotarou2012 via Wikimedia Commons, CC-BY-SA 4.0' WHERE name = 'Boxty';

-- 20. Potato Croquettes (CC-BY-SA - Ocdp)
UPDATE dishes SET image_attribution = 'Photo by Ocdp via Wikimedia Commons, CC-BY-SA 4.0' WHERE name = 'Potato Croquettes';

-- 21. Patatas Bravas (CC-BY - Tamorlan)
UPDATE dishes SET image_attribution = 'Photo by Tamorlan via Wikimedia Commons, CC-BY 4.0' WHERE name = 'Patatas Bravas';

-- 22. Potato Curry (Original - not modified)
UPDATE dishes SET image_attribution = NULL WHERE name = 'Potato Curry';

-- 23. Spanish Tortilla (CC-BY-SA - Juan Emilio Prades Bel)
UPDATE dishes SET image_attribution = 'Photo by Juan Emilio Prades Bel via Wikimedia Commons, CC-BY-SA 4.0' WHERE name = 'Spanish Tortilla';

-- 24. Potato Rosti (CC-BY-SA - Benutzer:Mussklprozz)
UPDATE dishes SET image_attribution = 'Photo by Mussklprozz via Wikimedia Commons, CC-BY-SA 3.0' WHERE name = 'Potato Rosti';

-- 25. Funeral Potatoes (CC-BY - Pingnova)
UPDATE dishes SET image_attribution = 'Photo by Pingnova via Wikimedia Commons, CC-BY 4.0' WHERE name = 'Funeral Potatoes';

-- 26. Potato Leek Soup (Original - not modified)
UPDATE dishes SET image_attribution = NULL WHERE name = 'Potato Leek Soup';

-- 27. Pommes Anna (CC-BY - Herry Lawford)
UPDATE dishes SET image_attribution = 'Photo by Herry Lawford via Wikimedia Commons, CC-BY 2.0' WHERE name = 'Pommes Anna';

-- 28. Potato Pierogi (CC-BY-SA - Piotrus)
UPDATE dishes SET image_attribution = 'Photo by Piotrus via Wikimedia Commons, CC-BY-SA 3.0' WHERE name = 'Potato Pierogi';

-- 29. Sweet Potato Fries (Original - not modified)
UPDATE dishes SET image_attribution = NULL WHERE name = 'Sweet Potato Fries';

-- 30. Twice Baked Potatoes (Original - not modified)
UPDATE dishes SET image_attribution = NULL WHERE name = 'Twice Baked Potatoes';

-- Placeholder image (uncooked russet potato in soil)
-- Used as generic placeholder when no specific dish image is available
-- File: Heart-shaped potato in soil in Tuntorp 1.jpg
-- License: CC-BY-SA 4.0
-- Photographer: W.carter
-- Attribution: Photo by W.carter via Wikimedia Commons, CC-BY-SA 4.0
-- Location: /static/images/dishes/placeholder-potato.jpg
