-- Migration: Add new potato dishes scraped from Wikipedia
-- Created: 2026-04-04
-- Images sourced from Wikimedia Commons
-- ELO is set to the median ELO of existing dishes at migration time

-- Ajiaco
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('785539f6-98be-4a22-8033-3f28d8396149', 'Ajiaco', 'A potato soup with regional variations.', 'ajiaco.jpg', 'Photo by Mauricio Giraldo from Bogotá, Colombia via Wikimedia Commons, CC BY-SA 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Aligot
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('be4f8c34-64f7-47be-822c-2f00a22977b3', 'Aligot', 'Made from melted cheese blended into mashed potatoes, often with garlic.', 'aligot.jpg', 'Public Domain',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Aloo gobi
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('436e323b-4898-4fd7-892c-9798d81f35ae', 'Aloo gobi', 'A dish of cauliflower, potato and turmeric. It is sometimes prepared with additional spices.', 'aloo-gobi.jpg', 'Photo by Unknown via Wikimedia Commons, CC BY-SA 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Aloo gosht
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('9d6cfd5e-2d85-40b5-b746-de51e8fd04e1', 'Aloo gosht', 'Potatoes with meat, usually lamb or mutton, in a stew-like gravy.', 'aloo-gosht.jpg', 'Photo by Miansari66 via Wikimedia Commons, CC0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Aloo pie
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('d7336300-3d6f-48bb-be6d-c68aa24d29f6', 'Aloo pie', 'A soft, calzone-shaped pie filled with boiled, spiced and mashed potatoes and other vegetables like green peas or chana dal, and fried.', 'aloo-pie.jpg', 'Photo by Jason Lam via Wikimedia Commons, CC BY 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Aloo posto
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('3f384d4d-bc42-4c46-a5b8-54b30477efee', 'Aloo posto', 'Poppy seed paste and potato pieces cooked together with mustard oil and dry black chillis.', 'aloo-posto.jpg', 'Photo by SDBeast via Wikimedia Commons, CC BY-SA 4.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Älplermagronen
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('fd9ba604-89ec-42cb-8811-e78252f80690', 'Älplermagronen', 'A dish made of both potatoes and pasta, refined with cream, cheese and onions.', 'lplermagronen.jpeg', 'Photo by Adrian Michael via Wikimedia Commons, CC BY-SA 4.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Bangers and mash
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('8b53de88-0b2e-43b3-956c-78ec3f15c73c', 'Bangers and mash', 'Mashed potatoes with sausages, topped with gravy.', 'bangers-and-mash.jpg', 'Photo by avlxyz via Wikimedia Commons, CC BY-SA 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Batatas a murro
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('989ff929-8368-4914-8645-e2007ca7106c', 'Batatas a murro', 'A dish of small new potatoes that are boiled or roasted and then lightly smashed (punched), seasoned with olive oil.', 'batatas-a-murro.jpg', 'Public Domain',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Batata harra
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('4d88aa81-4a81-496e-b1d2-234a732098b9', 'Batata harra', 'A spicy dish made of potatoes, red peppers, coriander, chili, and garlic, fried together in olive oil.', 'batata-harra.jpg', 'Photo by secretlondon123 from London, England via Wikimedia Commons, CC BY-SA 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Batata vada
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('0dd436f4-100e-4818-8744-e4e0ea31c4d8', 'Batata vada', 'A savory fritter. This snack food can also be made with lentil, dal, or gram flour.', 'batata-vada.jpg', 'Photo by Vivekpat30 via Wikimedia Commons, CC BY-SA 4.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Batates bechamel
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('327177e9-8641-40ef-89bd-1cbf1c2387d3', 'Batates bechamel', 'A dish of potatoes, béchamel sauce, and meat. The béchamel sauce is made with flour, butter, milk, and white pepper powder.', 'batates-bechamel.jpg', 'Photo by Midos hisham via Wikimedia Commons, CC BY-SA 4.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Bauernfrühstück
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('ae5c5502-480d-4aeb-8b7e-73380f10bd1f', 'Bauernfrühstück', 'A breakfast dish made from fried potatoes, eggs, onions, leeks or chives, and bacon or ham. It is similar to the somewhat simpler English bubble and squeak, described below.', 'bauernfr-hst-ck.jpg', 'Photo by Kobako via Wikimedia Commons, CC BY-SA 2.5',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Bombay potatoes
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('6d06d0e8-6907-4311-931b-13af3a7b81c7', 'Bombay potatoes', 'Cubes of potato fried with spices.', 'bombay-potatoes.jpg', 'Photo by Divya Kudua via Wikimedia Commons, CC BY 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Boulangère potatoes
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('3a9926a1-69b6-475f-83dc-99817faa9ad2', 'Boulangère potatoes', 'Layered thinly sliced potatoes with onion cooked in a casserole dish in stock.', 'boulang-re-potatoes.jpg', 'Photo by Joy via Wikimedia Commons, CC BY 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Bonda
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('a475c9b3-1419-42d9-82be-237d58a79a8d', 'Bonda', 'A typical South Indian snack prepared with potatoes or other vegetables. There are various sweet and spicy versions in different regions.', 'bonda.jpg', 'Photo by Thamizhpparithi Maari via Wikimedia Commons, CC BY-SA 4.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Bubble and squeak
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('0358bec7-de8b-4fc4-a222-294b01fa90f7', 'Bubble and squeak', 'A traditional dish made with leftovers, the main ingredients being potato and cabbage.', 'bubble-and-squeak.jpg', 'Photo by Tarquin Binary via Wikimedia Commons, CC BY-SA 2.5',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Cacasse à cul nu
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('40c52835-9537-453f-8093-71a324979dfe', 'Cacasse à cul nu', 'Potatoes, onions, and often meat (bacon or sausage) cooked in a Dutch oven.', 'cacasse-cul-nu.jpg', 'Photo by Dip_44 from France via Wikimedia Commons, CC BY 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Canarian wrinkly potatoes
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('b3515faf-60f3-4c74-8f26-aeb9933a08dd', 'Canarian wrinkly potatoes', 'A traditional salt-cooked potato dish usually served with a pepper sauce called mojo, or as an accompaniment to meat dishes.', 'canarian-wrinkly-potatoes.jpg', 'Photo by Fer.. via Wikimedia Commons, CC BY 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Carne asada fries
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('9f2bd161-4945-434b-ac8e-afb036295973', 'Carne asada fries', 'Typically consists of French fries, carne asada, guacamole, sour cream and cheese.', 'carne-asada-fries.jpg', 'Photo by permanently scatterbrained via Wikimedia Commons, CC BY 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Cepelinai
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('c8488053-7889-4d0b-aa4d-13ee5c7743d2', 'Cepelinai', 'A national dish that is also eaten in northeastern Poland; a dumpling made from riced potatoes and usually stuffed with minced meat.', 'cepelinai.jpg', 'Photo by Jpatokal via Wikimedia Commons, CC BY-SA 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Chapalele
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('7d0db129-ad99-4d33-8b21-de28c116b181', 'Chapalele', 'A dumpling prepared with boiled potatoes and wheat flour.', 'chapalele.jpg', 'Photo by Lin linao via Wikimedia Commons, CC BY-SA 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Cheese fries
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('3b25a411-326c-4a1d-bec4-d24232179a48', 'Cheese fries', 'A common fast food dish consisting of French fries covered in cheese.', 'cheese-fries.jpg', 'Photo by Krista via Wikimedia Commons, CC BY 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Chips and dip
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('6a861229-6712-4b8a-a154-8144a8bca88c', 'Chips and dip', 'A food combination consisting of various types of chips or crisps and various dips. Pictured is crab dip with potato chips.', 'chips-and-dip.jpg', 'Photo by Androgles1992 via Wikimedia Commons, CC BY-SA 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Chocolate-covered potato chips
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('c868b277-1c62-4b89-8343-90e35e2da9d4', 'Chocolate-covered potato chips', 'Deep-fried thin potato slices that have been dipped into and coated with melted chocolate or cocoa.', 'chocolate-covered-potato-chips.jpg', 'Photo by Shawn Zehnder Lea from Brandon, MS, US via Wikimedia Commons, CC BY 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Chorrillana
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('ee91cd60-3c05-43c1-9fa9-7a725f68b35a', 'Chorrillana', 'French fries topped with sliced beef and sausages, scrambled eggs and fried onions.', 'chorrillana.jpg', 'Photo by P R from Santiago, Chile via Wikimedia Commons, CC BY 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Clapshot
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('8edd9660-f8ba-4fd2-bcda-5b516ce592fc', 'Clapshot', 'A traditional Scottish dish that originated in Orkney, created by the combined mashing of swede turnips and potatoes ("neeps and tatties") with the addition of chives, butter or dripping, salt and pepper. Some versions include onions.', 'clapshot.jpg', 'Photo by Mutt Lunker via Wikimedia Commons, CC BY-SA 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Coddle
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('275d7111-b716-4c3c-9318-1eacdd9b726d', 'Coddle', 'Often made to use up leftovers, and therefore without a specific recipe, coddle most commonly consists of layers of roughly sliced pork sausages and rashers (thinly sliced, somewhat fatty back bacon) with sliced potatoes and onions.', 'coddle.jpg', 'Photo by Coddle head at English Wikipedia via Wikimedia Commons, CC BY-SA 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Cottage pie
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('822148f1-54d4-41f3-9407-8d1d37d6bc0f', 'Cottage pie', 'This dish consists of a bottom layer of minced beef, with a top layer of mashed potatoes. A variation using lamb mince is known as shepherd''s pie.', 'cottage-pie.jpg', 'Public Domain',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Crisp sandwich
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('60883922-05ae-466e-bdb9-91006244105c', 'Crisp sandwich', 'A sandwich that includes crisps (potato chips) as one of the fillings; any other common sandwich ingredient may be added.', 'crisp-sandwich.jpg', 'Photo by The original uploader was LinguistAtLarge at English Wikipedia. via Wikimedia Commons, CC BY-SA 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Crocchè
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('70e6a1ef-e59f-470b-9a8b-8f825b608b19', 'Crocchè', 'Made from mashed potato and egg, which is covered in bread crumbs and fried.', 'crocch.jpg', 'Photo by Camillo from Palermo, Sicilia via Wikimedia Commons, CC BY 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Dabeli
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('8b584a3e-37ca-4f3d-af8f-89014a53c581', 'Dabeli', 'A snack food of India, originating in the Kutch or Kachchh region of Gujarat. It is a spicy snack made by mixing boiled potatoes with a dabeli masala, and putting the mixture between pav (hamburger bun) and served with chutneys made from tamarind, date, garlic, red chilies, and other ingredients.', 'dabeli.jpg', 'Photo by Noopur28 via Wikimedia Commons, CC BY-SA 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Disco fries
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('cf2fc462-5619-43c0-9916-fa3cafb216f3', 'Disco fries', 'French fries topped with brown gravy and melted shredded cheese', 'disco-fries.jpg', 'Photo by BanjoZebra via Wikimedia Commons, CC BY 4.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Duchess potatoes
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('8dd02f58-92de-48de-b5ff-a513e1126fc5', 'Duchess potatoes', 'Consists of a purée of mashed potato and egg yolk, butter, salt, pepper, and nutmeg, forced from a piping bag or hand-moulded into various shapes that are then baked', 'duchess-potatoes.jpg', 'Photo by Frank C. Müller via Wikimedia Commons, CC BY-SA 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Dum aloo
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('8171ea87-7217-4d34-b9ce-338de7e25db4', 'Dum aloo', 'Potatoes, usually smaller ones, are first deep-fried, then cooked slowly at low flame in a gravy with spices.', 'dum-aloo.jpg', 'Photo by Miansari66 via Wikimedia Commons, CC0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Far far
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('848a2f87-41f6-46b1-9268-71cff8f31212', 'Far far', 'Snack food composed primarily of potato starch and tinted sago. May also contain tapioca and wheat flour.', 'far-far.jpg', 'Photo by Dharmadhyaksha via Wikimedia Commons, CC BY-SA 4.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Fondant potatoes
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('9b31b3c9-9237-472c-998a-b4e4c00e71be', 'Fondant potatoes', 'Cylinders of potato part-cooked by frying, then finished in a simmering mixture of butter and stock.', 'fondant-potatoes.jpg', 'Photo by Kamakou via Wikimedia Commons, CC0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Gamja ongsimi
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('8db5f070-0889-4a13-95ff-a72938efcae9', 'Gamja ongsimi', 'Dumplings made from ground potato and chopped vegetables in a clear broth.', 'gamja-ongsimi.jpg', 'Photo by by Junho Jung at Flickr from South Korea via Wikimedia Commons, CC BY-SA 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Halal snack pack
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('5a83e62d-0795-4944-9fa4-35996d36bdeb', 'Halal snack pack', 'Deep-fried potato chips topped with doner kebab meat and cheese. The dish is topped with a trio of garlic sauce, chilli sauce and barbecue sauce.', 'halal-snack-pack.jpg', 'Photo by Photo by Kenneth Miller via Wikimedia Commons, CC0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Hasselback Potatoes
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('a7450913-aba9-422c-84fa-64bc1f3a24b0', 'Hasselback Potatoes', 'A baked potato cut partway through into thin slices and topped with butter and other ingredients.', 'hasselback-potatoes.jpg', 'Photo by Aurus Sy via Wikimedia Commons, CC0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Home fries
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('15732175-feb8-4a06-afbe-62dc3c82185e', 'Home fries', 'A type of basic potato dish made by pan- or skillet-frying chunked, sliced, wedged or diced potatoes that are sometimes unpeeled and may have been par-cooked by boiling, baking, steaming, or microwaving.', 'home-fries.jpg', 'Photo by Marshall Astor from San Pedro, California, USA via Wikimedia Commons, CC BY-SA 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Knödel
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('864d1450-4f9a-4155-9c91-95d43f70b313', 'Knödel', 'Large round poached or boiled potato or bread dumplings, made without yeast.', 'kn-del.jpg', 'Photo by Benreis via Wikimedia Commons, CC BY 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Kopytka
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('96545002-0d3c-4739-9074-a5d630bf9e6a', 'Kopytka', 'Potato dumplings popular in several Central and Eastern European regions. The traditional Polish version is typically cooked in salted water, while other regional versions (such as Belarusian and Lithuanian) are baked first.', 'kopytka.jpg', 'Photo by Chris Olszewski via Wikimedia Commons, CC BY-SA 4.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Korokke
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('fe63cd3e-2051-4881-9a4b-81eb0546800c', 'Korokke', 'A Japanese deep-fried dish originally related to the French croquette. Korokke is made by mixing cooked chopped meat, seafood, or vegetables with mashed potato or white sauce; shaping the mixture into a patty; rolling it in wheat flour, eggs, and Japanese-style breadcrumbs; then deep-frying this until brown on the outside.', 'korokke.jpg', 'Public Domain',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Kroppkaka
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('ab08c0b6-083c-4653-a6d1-7b7debc48256', 'Kroppkaka', 'Potato dumplings with a filling of onions and pork or bacon.', 'kroppkaka.jpg', 'Photo by Sendelbach (talk) via Wikimedia Commons, CC BY-SA 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Kugel
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('8756548c-c91e-4548-89de-33842719228f', 'Kugel', 'A pudding or casserole made from egg noodles or potatoes.', 'kugel.jpg', 'Photo by Stuart Spivack via Wikimedia Commons, CC BY-SA 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Meat and potato pie
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('98f0a34c-ea71-4a65-b35e-67b3768e8c7e', 'Meat and potato pie', 'A meat and potato pie has a similar filling to a Cornish pasty and differs from a meat pie in that its content is often minced and usually less than 50% meat. They are typically eaten as take-aways.', 'meat-and-potato-pie.jpg', 'Photo by Paul Downey from Berkhamsted, UK via Wikimedia Commons, CC BY 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Nikujaga
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('b7894ef6-354b-4a37-a73a-a9a14c0efb50', 'Nikujaga', 'A stew of potatoes and onion with sweetened soy sauce.', 'nikujaga.jpg', 'Photo by Yumi Kimura from Yokohama, JAPAN via Wikimedia Commons, CC BY-SA 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Nilaga
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('78063773-32b5-4ed9-9273-bedec6114f6b', 'Nilaga', 'A soup made of meat (usually beef or pork), potatoes, carrots, and cabbage, occasionally also with string beans and plantains.', 'nilaga.jpg', 'Photo by Judgefloro via Wikimedia Commons, CC0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Okroshka
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('64700da3-9866-44da-8f95-738f5a8afb1d', 'Okroshka', 'A cold soup with raw vegetables (like cucumbers, radishes and spring onions), boiled potatoes, eggs, and a cooked meat such as beef, veal, sausages, or ham with kvass and a sour cream such as smetana.', 'okroshka.jpg', 'Photo by Leonid Dzhepko via Wikimedia Commons, CC BY-SA 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Olivier salad
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('06a7831b-bce7-40f0-921c-14774c00dbfb', 'Olivier salad', 'Also known as ''''Russian salad'''' or ''''Stolichny salad''''; it usually includes potatoes, diced boiled chicken (or sometimes ham or bologna sausage), eggs, brined dill pickles, carrots, green peas, and onions, mixed and dressed with mayonnaise. Variations of this salad are also popular in Eastern Europe, the Balkans, and Spain, as well as in some Asian and South American countries.', 'olivier-salad.jpg', 'Photo by Dr. Bernd Gross via Wikimedia Commons, CC BY-SA 4.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Papa rellena
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('ee44f68c-0446-45fa-9471-9e6041646e86', 'Papa rellena', 'Mashed potatoes formed into balls, stuffed with seasoned ground meat and spices, and deep-fried.', 'papa-rellena.jpg', 'Photo by Håkan Svensson (Xauxa). via Wikimedia Commons, CC BY-SA 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Pickert
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('bd3f208c-0432-4124-96b5-0c303e50009b', 'Pickert', 'A flat, fried or baked potato dish that can be considered a kind of flattened dumpling or pancake', 'pickert.jpg', 'Photo by Billyray32 via Wikimedia Commons, CC BY-SA 2.5',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Pommes dauphine
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('730fa480-f456-46d7-9203-4dc5a913dce2', 'Pommes dauphine', 'Sometimes referred to as dauphine potatoes, they are crisp potato puffs made by mixing mashed potatoes with savoury choux pastry, forming the mixture into dumpling shapes, and then deep-frying at 170° to 180°C.', 'pommes-dauphine.jpg', 'Photo by Jonco via Wikimedia Commons, CC BY-SA 4.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Pommes soufflées
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('db9533ba-36e5-4894-8c97-f91ac02a87c7', 'Pommes soufflées', 'Twice-fried slices of potato. First fried at 150°C (300°F), cooled, then fried again at 190°C (375°F), causing the slices to puff up.', 'pommes-souffl-es.jpg', 'Photo by Tamorlan via Wikimedia Commons, CC BY 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Potato bread
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('807433ce-98aa-416c-a6d0-a130caa1c0fd', 'Potato bread', 'A form of bread in which potato replaces a portion of the regular wheat flour.', 'potato-bread.jpg', 'Photo by Daniel J. Layton via Wikimedia Commons, CC BY-SA 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Potato candy
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('07e057e6-7d58-4010-bc4a-1a6150a93012', 'Potato candy', 'A rolled confection using a combination of mashed potatoes and powdered sugar to make a dough, usually filled with peanut butter.', 'potato-candy.jpg', 'Photo by thisisbossi via Wikimedia Commons, CC BY 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Potato doughnut
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('b2b4e72f-7060-4d2e-82bf-f9e4a5c2e46b', 'Potato doughnut', 'Sometimes called a Spudnut, it is a doughnut, typically sweet, made with either mashed potatoes or potato starch instead of flour.', 'potato-doughnut.jpg', 'Photo by cvilletomorrow via Wikimedia Commons, CC BY 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Potato filling
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('d5ede357-0627-464a-8ccc-158aed7a23d3', 'Potato filling', 'Prepared with mashed potatoes, bread and additional ingredients.', 'potato-filling.jpg', 'Photo by Zeel Patel via Wikimedia Commons, CC BY-SA 4.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Potato scone
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('e660f55e-1f42-4692-ae3b-7017622fa40f', 'Potato scone', 'A regional variant of the savoury griddle scone which is especially popular in Scotland. Many variations of the recipe exist, and they generally include liberal quantities of boiled potatoes, butter and salt.', 'potato-scone.jpg', 'Photo by User:Dave souza via Wikimedia Commons, CC BY-SA 2.5',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Potato waffle
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('d8abbffc-393e-4c06-b257-32ddccc7edee', 'Potato waffle', 'A potato-based savory food in a waffle-like lattice shape. They are common in the UK and Ireland and are also available in some other countries.', 'potato-waffle.jpg', 'Photo by Cooked_breakfast_with_potato_waffle.jpg: User:Waggers
derivative work: Ubcule via Wikimedia Commons, CC BY-SA 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Poutine
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('8fcb5b3a-0ae0-438b-85e6-2ceec36b070f', 'Poutine', 'A common Canadian dish, originating in Quebec, made with French fries, topped with a light brown gravy-like sauce and cheese curds.', 'poutine.jpg', 'Photo by Sjschen via Wikimedia Commons, CC BY 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Rumbledethumps
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('2e6b4457-6c93-4323-a91a-ff8266b30b69', 'Rumbledethumps', 'A traditional dish from the Scottish Borders. The main ingredients are potato, cabbage and onion.', 'rumbledethumps.jpg', 'Photo by Glane23 via Wikimedia Commons, CC BY-SA 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Salchipapa
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('faa61fbe-7bf1-495e-a4bc-d00c38bba754', 'Salchipapa', 'A fast food dish commonly consumed as street food throughout Latin America, it typically consists of thinly sliced pan-fried beef sausages and French fries, mixed together with a savory coleslaw on the side.', 'salchipapa.jpg', 'Public Domain',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Salt potatoes
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('bee560c0-5e89-4467-983e-4a82c143dbf7', 'Salt potatoes', 'As the potatoes cook, the salty water forms a crust on the skin and seals the potatoes so they never taste waterlogged. The potatoes have a unique texture closer to fluffy baked potatoes, only creamier.', 'salt-potatoes.jpg', 'Photo by NatalieMaynor via Wikimedia Commons, CC BY 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Samosa
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('176f86ec-6966-43a2-ba73-f872248d7a7c', 'Samosa', 'A fast food of the Indian subcontinent made with wheat flour dough and potatoes as a main ingredient, sometimes with other vegetables.', 'samosa.jpg', 'Photo by kspoddar via Wikimedia Commons, CC BY-SA 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Schupfnudel
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('8bdf10a9-5e61-4fc4-9d76-fabe8d9cfbfb', 'Schupfnudel', 'A dumpling or thick noodle in southern German and Austrian cuisine; often served as a savory dish with sauerkraut but also in sweet dishes in combination with apple sauce.', 'schupfnudel.jpg', 'Photo by MarkusHagenlocher via Wikimedia Commons, CC BY-SA 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Silesian dumplings
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('6b3159a2-eaf7-4582-8926-fc96ded4d716', 'Silesian dumplings', 'In Polish: ''''kluski śląskié''''. Made of boiled and then mashed potatoes (moderately cooled, but still warm), potato flour, an egg (optional) and a dash of salt.', 'silesian-dumplings.jpg', 'Photo by Ewkaa via Wikimedia Commons, CC BY-SA 4.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Spice bag
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('cc226069-c2f9-42d6-bfe2-8bcb9ccb54f7', 'Spice bag', 'French fries/chips, chicken strips, peppers and spices.', 'spice-bag.jpg', 'Photo by Sean Zissou via Wikimedia Commons, CC BY 4.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Steak frites
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('8fd9f188-564d-462d-8382-ca426986ae96', 'Steak frites', 'Pan-fried steak paired with deep-fried potatoes (French fries).', 'steak-frites.jpg', 'Public Domain',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Sweetened potato casserole
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('99de5a25-6e0f-4386-aecd-d184cc88ff7b', 'Sweetened potato casserole', 'A Christmas dish of puréed potatoes mixed with wheat flour.', 'sweetened-potato-casserole.jpg', 'Photo by Jani Laaksonen via Wikimedia Commons, CC BY 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Tombet
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('439bcad0-072b-49fb-9ccc-41ba20f91c85', 'Tombet', 'Sliced potatoes, eggplant, and red bell peppers previously fried in olive oil, served in a low-sided dish.', 'tombet.jpg', 'Photo by Paucabot via Wikimedia Commons, CC BY-SA 3.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

-- Tornado potato
INSERT INTO dishes (id, name, description, image_path, image_attribution, elo, submitted_by, created_at) VALUES
  ('d74cf91f-e373-48bc-a214-5b4bb31d76cf', 'Tornado potato', 'Spiral-cut potatoes, deep-fried until crisp.', 'tornado-potato.jpg', 'Photo by anna Hanks via Wikimedia Commons, CC BY 2.0',
   (SELECT AVG(elo) FROM (
    SELECT elo FROM dishes ORDER BY elo
    LIMIT (SELECT CASE WHEN COUNT(*) % 2 = 0 THEN 2 ELSE 1 END FROM dishes)
    OFFSET (SELECT (COUNT(*) - 1) / 2 FROM dishes)
  )),
   NULL, unixepoch());

