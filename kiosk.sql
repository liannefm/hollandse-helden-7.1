-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 04, 2026 at 10:00 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kiosk`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`) VALUES
(1),
(2),
(3),
(4),
(5),
(6);

-- --------------------------------------------------------

--
-- Table structure for table `categorie_translations`
--

CREATE TABLE `categorie_translations` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `language` varchar(3) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categorie_translations`
--

INSERT INTO `categorie_translations` (`id`, `category_id`, `language`, `name`) VALUES
(1, 1, 'en', 'Breakfast'),
(2, 1, 'nl', 'Ontbijt'),
(3, 1, 'de', 'Frühstück'),
(4, 2, 'en', 'Lunch & Dinner'),
(5, 2, 'nl', 'Lunch & Diner'),
(6, 2, 'de', 'Mittag- & Abendessen'),
(7, 3, 'en', 'Handhelds (Wraps & Sandwiches)'),
(8, 3, 'nl', 'Handhelds (Wraps & Broodjes)'),
(9, 3, 'de', 'Handhelds (Wraps & Sandwiches)'),
(10, 4, 'en', 'Sides & Small Plates'),
(11, 4, 'nl', 'Bijgerechten & Kleine Borden'),
(12, 4, 'de', 'Beilagen & Kleine Teller'),
(13, 5, 'en', 'Signature Dips'),
(14, 5, 'nl', 'Kenmerkende Dips'),
(15, 5, 'de', 'Signature Dips'),
(16, 6, 'en', 'Drinks'),
(17, 6, 'nl', 'Dranken'),
(18, 6, 'de', 'Getränke');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `order_status_id` int(11) NOT NULL,
  `pickup_number` tinyint(4) NOT NULL,
  `price_total` float NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `order_status_id`, `pickup_number`, `price_total`, `datetime`) VALUES
(1, 1, 1, 13, '2026-02-25 15:20:22'),
(2, 1, 2, 0, '2026-02-25 20:39:02'),
(3, 1, 3, 5.5, '2026-02-25 20:39:52'),
(4, 1, 4, 6.5, '2026-02-25 20:42:47'),
(5, 1, 5, 14, '2026-02-27 08:55:50'),
(6, 1, 6, 13, '2026-02-27 08:59:06'),
(7, 1, 7, 13, '2026-03-02 13:01:36');

-- --------------------------------------------------------

--
-- Table structure for table `order_product`
--

CREATE TABLE `order_product` (
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_product`
--

INSERT INTO `order_product` (`order_id`, `product_id`) VALUES
(1, 9),
(1, 12),
(3, 12),
(4, 11),
(4, 31),
(5, 9),
(5, 10),
(6, 10),
(6, 12),
(6, 24),
(7, 10),
(7, 10);

-- --------------------------------------------------------

--
-- Table structure for table `order_status`
--

CREATE TABLE `order_status` (
  `order_status_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_status`
--

INSERT INTO `order_status` (`order_status_id`, `description`) VALUES
(1, 'Started'),
(2, 'Placed and paid'),
(3, 'Preparing'),
(4, 'Ready for pickup'),
(5, 'Picked up');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `price` float NOT NULL,
  `kcal` int(11) NOT NULL,
  `diet_type` enum('V','VG') NOT NULL,
  `available` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `image`, `price`, `kcal`, `diet_type`, `available`) VALUES
(9, 1, '9.png', 7.5, 320, 'VG', 1),
(10, 1, '10.png', 6.5, 280, 'V', 1),
(11, 1, '11.png', 5, 240, 'VG', 1),
(12, 1, '12.png', 5.5, 290, 'VG', 1),
(13, 2, '13.png', 10.5, 480, 'VG', 1),
(14, 2, '14.png', 9.5, 310, 'VG', 1),
(15, 2, '15.png', 10, 440, 'VG', 1),
(16, 2, '16.png', 11, 500, 'VG', 1),
(17, 3, '17.png', 8.5, 410, 'VG', 1),
(18, 3, '18.png', 9, 460, 'V', 1),
(19, 3, '19.png', 7.5, 350, 'VG', 1),
(20, 4, '20.png', 4.5, 260, 'VG', 1),
(21, 4, '21.png', 4.5, 190, 'VG', 1),
(22, 4, '22.png', 5, 230, 'VG', 1),
(23, 4, '23.png', 4, 160, 'VG', 1),
(24, 5, '24.png', 1, 120, 'VG', 1),
(25, 5, '25.png', 1, 110, 'VG', 1),
(26, 5, '26.png', 1, 90, 'V', 1),
(27, 5, '27.png', 1, 180, 'VG', 1),
(28, 5, '28.png', 1, 200, 'VG', 1),
(29, 6, '29.png', 3.5, 120, 'VG', 1),
(30, 6, '30.png', 3, 90, 'VG', 1),
(31, 6, '31.png', 1.5, 0, 'VG', 1),
(32, 6, '32.png', 3.8, 140, 'VG', 1),
(34, 6, '34.png', 3, 90, 'VG', 1);

-- --------------------------------------------------------

--
-- Table structure for table `product_translations`
--

CREATE TABLE `product_translations` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `language` varchar(3) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_translations`
--

INSERT INTO `product_translations` (`id`, `product_id`, `language`, `name`, `description`) VALUES
(1, 9, 'en', 'Morning Boost Açaí Bowl', 'A chilled blend of açaí and banana topped with crunchy granola, chia seeds, and coconut.'),
(2, 9, 'nl', 'Ochtendboost Açaí Bowl', 'Een gekoelde mix van açaí en banaan met een topping van knapperige granola, chiazaden en kokos.'),
(3, 9, 'de', 'Morgen-Boost Açaí-Schale', 'Eine gekühlte Mischung aus Açaí und Banane, garniert mit knusprigem Müsli, Chiasamen und Kokosnuss.'),
(4, 10, 'en', 'The Garden Breakfast Wrap', 'Whole-grain wrap with fluffy scrambled eggs, baby spinach, and a light yogurt-herb sauce.'),
(5, 10, 'nl', 'De Tuin Ontbijtwrap', 'Volkoren wrap met luchtig roerei, babyspinazie en een lichte yoghurt-kruidensaus.'),
(6, 10, 'de', 'Der Garten-Frühstücks-Wrap', 'Vollkorn-Wrap mit lockerem Rührei, Babyspinat und einer leichten Joghurt-Kräuter-Sauce.'),
(7, 11, 'en', 'Peanut Butter & Cacao Toast', 'Sourdough toast with 100% natural peanut butter, banana, and a sprinkle of cacao nibs.'),
(8, 11, 'nl', 'Pindakaas & Cacao Toast', 'Zuurdesemtoast met 100% natuurlijke pindakaas, banaan en een snufje cacaonibs.'),
(9, 11, 'de', 'Erdnussbutter & Kakao-Toast', 'Sauerteigtoast mit 100% natürlicher Erdnussbutter, Banane und einer Prise Kakaonibs.'),
(10, 12, 'en', 'Overnight Oats: Apple Pie Style', 'Oats soaked in almond milk with grated apple, cinnamon, and crushed walnuts.'),
(11, 12, 'nl', 'Overnight Oats: Appeltaart Stijl', 'Havermout geweekt in amandelmelk met geraspte appel, kaneel en gehakte walnoten.'),
(12, 12, 'de', 'Overnight Oats: Apfelkuchen-Art', 'In Mandelmilch eingeweichte Haferflocken mit geriebenem Apfel, Zimt und zerstoßenen Walnüssen.'),
(13, 13, 'en', 'Tofu Power Tahini Bowl', 'Tri-color quinoa, maple-glazed tofu, roasted sweet potatoes, and kale with tahini dressing.'),
(14, 13, 'nl', 'Tofu Power Tahini Bowl', 'Driekleuren quinoa, met esdoorn geglazuurde tofu, geroosterde zoete aardappelen en boerenkool met tahinidressing.'),
(15, 13, 'de', 'Tofu-Power-Tahini-Schale', 'Dreifarbige Quinoa, mit Ahorn glasierter Tofu, geröstete Süßkartoffeln und Grünkohl mit Tahini-Dressing.'),
(16, 14, 'en', 'The Supergreen Harvest', 'Massaged kale, edamame, avocado, cucumber, and toasted pumpkin seeds with lemon-olive oil.'),
(17, 14, 'nl', 'De Supergroene Oogst', 'Gemasseerde boerenkool, edamame, avocado, komkommer en geroosterde pompoenpitten met citroen-olijfolie.'),
(18, 14, 'de', 'Die Supergrüne Ernte', 'Massierter Grünkohl, Edamame, Avocado, Gurke und geröstete Kürbiskerne mit Zitronen-Olivenöl.'),
(19, 15, 'en', 'Mediterranean Falafel Bowl', 'Baked falafel, hummus, pickled red onions, cherry tomatoes, and cucumber on a bed of greens.'),
(20, 15, 'nl', 'Mediterrane Falafel Bowl', 'Gebakken falafel, hummus, ingelegde rode uien, kerstomaten en komkommer op een bedje van groen.'),
(21, 15, 'de', 'Mediterrane Falafel-Schale', 'Gebackene Falafel, Hummus, eingelegte rote Zwiebeln, Kirschtomaten und Gurke auf einem Bett aus Grünzeug.'),
(22, 16, 'en', 'Warm Teriyaki Tempeh Bowl', 'Steamed brown rice, seared tempeh, broccoli, and shredded carrots with a ginger-soy glaze.'),
(23, 16, 'nl', 'Warme Teriyaki Tempeh Bowl', 'Gestoomde bruine rijst, aangebraden tempeh, broccoli en geraspte wortelen met een gember-soja glazuur.'),
(24, 16, 'de', 'Warme Teriyaki-Tempeh-Schale', 'Gedämpfter brauner Reis, angebratener Tempeh, Brokkoli und geraspelte Karotten mit einer Ingwer-Soja-Glasur.'),
(25, 17, 'en', 'Zesty Chickpea Hummus Wrap', 'Spiced chickpeas, shredded carrots, crisp lettuce, and signature hummus in a whole-wheat wrap.'),
(26, 17, 'nl', 'Pittige Kikkererwten Hummus Wrap', 'Gekruide kikkererwten, geraspte wortelen, knapperige sla en kenmerkende hummus in een volkoren wrap.'),
(27, 17, 'de', 'Würziger Kichererbsen-Hummus-Wrap', 'Gewürzte Kichererbsen, geraspelte Karotten, knackiger Salat und charakteristischer Hummus in einem Vollkorn-Wrap.'),
(28, 18, 'en', 'Avocado & Halloumi Toastie', 'Grilled halloumi cheese, smashed avocado, and chili flakes on thick-cut multi-grain bread.'),
(29, 18, 'nl', 'Avocado & Halloumi Tosti', 'Gegrilde halloumi, geprakte avocado en chilivlokken op dik gesneden meergranenbrood.'),
(30, 18, 'de', 'Avocado & Halloumi-Toastie', 'Gegrillter Halloumi-Käse, zerdrückte Avocado und Chiliflocken auf dick geschnittenem Mehrkornbrot.'),
(31, 19, 'en', 'Smoky BBQ Jackfruit Slider', 'Pulled jackfruit in BBQ sauce with a crunchy purple slaw on a vegan brioche bun.'),
(32, 19, 'nl', 'Rokerige BBQ Jackfruit Slider', 'Getrokken jackfruit in BBQ-saus met een knapperige paarse koolsalade op een veganistisch briochebroodje.'),
(33, 19, 'de', 'Rauchiger BBQ-Jackfrucht-Slider', 'Gezupfte Jackfrucht in BBQ-Sauce mit einem knusprigen lila Krautsalat auf einem veganen Brioche-Brötchen.'),
(34, 20, 'en', 'Oven-Baked Sweet Potato Wedges', 'Seasoned with smoked paprika. (Best with Avocado Lime Dip).'),
(35, 20, 'nl', 'Ovengebakken Zoete Aardappelpartjes', 'Gekruid met gerookte paprika. (Best met Avocado Limoen Dip).'),
(36, 20, 'de', 'Ofengebackene Süßkartoffel-Wedges', 'Gewürzt mit geräuchertem Paprika. (Am besten mit Avocado-Limetten-Dip).'),
(37, 21, 'en', 'Zucchini Fries', 'Crispy breaded zucchini sticks. (Best with Greek Yogurt Ranch).'),
(38, 21, 'nl', 'Courgette Frietjes', 'Krokante gepaneerde courgettesticks. (Best met Griekse Yoghurt Ranch).'),
(39, 21, 'de', 'Zucchini-Pommes', 'Knusprige panierte Zucchinistangen. (Am besten mit griechischem Joghurt-Ranch).'),
(40, 22, 'en', 'Baked Falafel Bites - 5pcs', ''),
(41, 22, 'nl', 'Gebakken Falafel Bites - 5st', ''),
(42, 22, 'de', 'Gebackene Falafel-Bällchen - 5 Stk.', ''),
(43, 23, 'en', 'Mini Veggie Platter & Hummus', 'Fresh crunch: Celery, carrots, and cucumber.'),
(44, 23, 'nl', 'Mini Groenteschotel & Hummus', 'Verse crunch: Selderij, wortelen en komkommer.'),
(45, 23, 'de', 'Mini-Gemüseplatte & Hummus', 'Frischer Crunch: Sellerie, Karotten und Gurke.'),
(46, 24, 'en', 'Classic Hummus', ''),
(47, 24, 'nl', 'Klassieke Hummus', ''),
(48, 24, 'de', 'Klassischer Hummus', ''),
(49, 25, 'en', 'Avocado Lime Crema', ''),
(50, 25, 'nl', 'Avocado Limoen Crema', ''),
(51, 25, 'de', 'Avocado-Limetten-Crema', ''),
(52, 26, 'en', 'Greek Yogurt Ranch', ''),
(53, 26, 'nl', 'Griekse Yoghurt Ranch', ''),
(54, 26, 'de', 'Griechischer Joghurt-Ranch', ''),
(55, 27, 'en', 'Spicy Sriracha Mayo', ''),
(56, 27, 'nl', 'Pittige Sriracha Mayo', ''),
(57, 27, 'de', 'Scharfe Sriracha-Mayo', ''),
(58, 28, 'en', 'Peanut Satay Sauce', ''),
(59, 28, 'nl', 'Pindasatésaus', ''),
(60, 28, 'de', 'Erdnuss-Satay-Sauce', ''),
(61, 29, 'en', 'Green Glow Smoothie', 'Spinach, pineapple, cucumber, and coconut water.'),
(62, 29, 'nl', 'Groene Gloed Smoothie', 'Spinazie, ananas, komkommer en kokoswater.'),
(63, 29, 'de', 'Grüner-Glow-Smoothie', 'Spinat, Ananas, Gurke und Kokoswasser.'),
(64, 30, 'en', 'Iced Matcha Latte', 'Lightly sweetened matcha green tea with almond milk.'),
(65, 30, 'nl', 'Iced Matcha Latte', 'Licht gezoete matcha groene thee met amandelmelk.'),
(66, 30, 'de', 'Eis-Matcha-Latte', 'Leicht gesüßter Matcha-Grüntee mit Mandelmilch.'),
(67, 31, 'en', 'Fruit-Infused Water', 'Freshly infused water with a choice of lemon-mint, strawberry-basil, or cucumber-lime.'),
(68, 31, 'nl', 'Fruit-geïnfuseerd water', 'Vers geïnfuseerd water met een keuze uit citroen-munt, aardbei-basilicum of komkommer-limoen.'),
(69, 31, 'de', 'Wasser mit Fruchtgeschmack', 'Frisch aufgegossenes Wasser mit einer Auswahl an Zitrone-Minze, Erdbeer-Basilikum oder Gurke-Limette.'),
(70, 32, 'en', 'Berry Blast Smoothie', 'A creamy blend of strawberries, blueberries, and raspberries with almond milk.'),
(71, 32, 'nl', 'Bessenexplosie Smoothie', 'Een romige mix van aardbeien, bosbessen en frambozen met amandelmelk.'),
(72, 32, 'de', 'Beeren-Explosion-Smoothie', 'Eine cremige Mischung aus Erdbeeren, Blaubeeren und Himbeeren mit Mandelmilch.'),
(73, 34, 'en', 'Citrus Cooler', 'A refreshing mix of orange juice, sparkling water, and a hint of lime.'),
(74, 34, 'nl', 'Citrus Koeler', 'Een verfrissende mix van sinaasappelsap, bruisend water en een vleugje limoen.'),
(75, 34, 'de', 'Zitrus-Kühler', 'Eine erfrischende Mischung aus Orangensaft, Mineralwasser und einem Hauch Limette.');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `categorie_translations`
--
ALTER TABLE `categorie_translations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `order_status_id` (`order_status_id`);

--
-- Indexes for table `order_product`
--
ALTER TABLE `order_product`
  ADD KEY `product_id` (`product_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `order_status`
--
ALTER TABLE `order_status`
  ADD PRIMARY KEY (`order_status_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `image_id` (`image`);

--
-- Indexes for table `product_translations`
--
ALTER TABLE `product_translations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `categorie_translations`
--
ALTER TABLE `categorie_translations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `order_status`
--
ALTER TABLE `order_status`
  MODIFY `order_status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `product_translations`
--
ALTER TABLE `product_translations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `categorie_translations`
--
ALTER TABLE `categorie_translations`
  ADD CONSTRAINT `categorie_translations_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`order_status_id`) REFERENCES `order_status` (`order_status_id`) ON DELETE CASCADE;

--
-- Constraints for table `order_product`
--
ALTER TABLE `order_product`
  ADD CONSTRAINT `order_product_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_product_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE;

--
-- Constraints for table `product_translations`
--
ALTER TABLE `product_translations`
  ADD CONSTRAINT `product_translations_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
