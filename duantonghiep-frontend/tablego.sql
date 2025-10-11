-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 10, 2025 at 02:13 PM
-- Server version: 8.0.30
-- PHP Version: 8.3.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tablego`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `table_id` bigint UNSIGNED NOT NULL,
  `branch_id` bigint UNSIGNED NOT NULL,
  `booking_time` datetime NOT NULL,
  `duration_minutes` int NOT NULL DEFAULT '120',
  `people_count` int NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed','no_show') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `special_request` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `address`, `phone`, `email`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'TableGo - Chi nhánh Cầu Giấy', '123 Cầu Giấy, Hà Nội', NULL, NULL, '2025-10-10 05:42:34', '2025-10-10 05:42:34', NULL),
(2, 'TableGo - Chi nhánh Ba Đình', '456 Ba Đình, Hà Nội', NULL, NULL, '2025-10-10 05:42:34', '2025-10-10 05:42:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `combos`
--

CREATE TABLE `combos` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(12,2) NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `combos`
--

INSERT INTO `combos` (`id`, `name`, `description`, `price`, `image`, `is_available`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Combo magni soluta', 'Fuga amet tenetur commodi voluptas quam vel ducimus.', '878912.00', NULL, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(2, 'Combo qui aut', 'Doloribus sunt ut eos nihil rerum.', '589165.00', NULL, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(3, 'Combo non et', 'Rerum et quo dolor minima.', '662636.00', NULL, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(4, 'Combo in temporibus', 'At optio aliquid commodi facere debitis et neque.', '806996.00', NULL, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(5, 'Combo placeat et', 'Saepe et voluptatibus itaque dolores quidem dolor et.', '258617.00', NULL, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(6, 'Combo voluptate non', 'Soluta est sint qui itaque id.', '716669.00', NULL, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(7, 'Combo accusamus quam', 'Iure praesentium praesentium commodi repellendus vero corrupti beatae corrupti.', '799337.00', NULL, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(8, 'Combo alias quasi', 'Libero consectetur aut adipisci.', '568231.00', NULL, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(9, 'Combo rerum explicabo', 'Aperiam fugiat et saepe laboriosam qui eos blanditiis.', '455459.00', NULL, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(10, 'Combo velit provident', 'Ea assumenda maiores non quia.', '233532.00', NULL, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `combo_menu_item`
--

CREATE TABLE `combo_menu_item` (
  `id` bigint UNSIGNED NOT NULL,
  `combo_id` bigint UNSIGNED NOT NULL,
  `menu_item_id` bigint UNSIGNED NOT NULL,
  `quantity` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `combo_menu_item`
--

INSERT INTO `combo_menu_item` (`id`, `combo_id`, `menu_item_id`, `quantity`) VALUES
(1, 1, 13, 1),
(2, 1, 26, 1),
(3, 1, 35, 1),
(4, 1, 50, 1),
(5, 2, 4, 1),
(6, 2, 13, 1),
(7, 2, 14, 1),
(8, 2, 43, 1),
(9, 3, 8, 1),
(10, 3, 13, 1),
(11, 3, 21, 1),
(12, 3, 47, 1),
(13, 3, 48, 1),
(14, 4, 5, 1),
(15, 4, 11, 1),
(16, 4, 12, 1),
(17, 4, 50, 1),
(18, 5, 17, 1),
(19, 5, 19, 1),
(20, 5, 26, 1),
(21, 5, 37, 1),
(22, 5, 39, 1),
(23, 6, 8, 1),
(24, 6, 15, 1),
(25, 6, 45, 1),
(26, 6, 46, 1),
(27, 7, 23, 1),
(28, 7, 29, 1),
(29, 7, 30, 1),
(30, 7, 32, 1),
(31, 7, 35, 1),
(32, 8, 16, 1),
(33, 8, 28, 1),
(34, 8, 29, 1),
(35, 9, 6, 1),
(36, 9, 15, 1),
(37, 9, 35, 1),
(38, 9, 39, 1),
(39, 10, 17, 1),
(40, 10, 36, 1),
(41, 10, 39, 1),
(42, 10, 41, 1);

-- --------------------------------------------------------

--
-- Table structure for table `employee_profiles`
--

CREATE TABLE `employee_profiles` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `branch_id` bigint UNSIGNED NOT NULL,
  `employee_code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` enum('Receptionist','Waiter','Kitchen','Cashier','Manager') COLLATE utf8mb4_unicode_ci NOT NULL,
  `hire_date` date NOT NULL,
  `salary` decimal(12,2) DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_profiles`
--

INSERT INTO `employee_profiles` (`id`, `user_id`, `branch_id`, `employee_code`, `position`, `hire_date`, `salary`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 'MNG001', 'Manager', '2025-04-10', NULL, 'active', '2025-10-10 05:42:38', '2025-10-10 05:42:38'),
(2, 3, 2, 'EMP001', 'Kitchen', '2025-07-10', NULL, 'active', '2025-10-10 05:42:38', '2025-10-10 05:42:38'),
(3, 4, 2, 'EMP002', 'Waiter', '2025-09-10', NULL, 'active', '2025-10-10 05:42:38', '2025-10-10 05:42:38'),
(4, 5, 1, 'EMP003', 'Waiter', '2025-07-10', NULL, 'active', '2025-10-10 05:42:39', '2025-10-10 05:42:39'),
(5, 6, 1, 'EMP004', 'Waiter', '2025-06-10', NULL, 'active', '2025-10-10 05:42:39', '2025-10-10 05:42:39'),
(6, 7, 1, 'EMP005', 'Waiter', '2025-08-10', NULL, 'active', '2025-10-10 05:42:39', '2025-10-10 05:42:39'),
(7, 8, 2, 'EMP006', 'Waiter', '2025-05-10', NULL, 'active', '2025-10-10 05:42:40', '2025-10-10 05:42:40'),
(8, 9, 1, 'EMP007', 'Kitchen', '2025-05-10', NULL, 'active', '2025-10-10 05:42:40', '2025-10-10 05:42:40'),
(9, 10, 2, 'EMP008', 'Waiter', '2025-05-10', NULL, 'active', '2025-10-10 05:42:41', '2025-10-10 05:42:41'),
(10, 11, 1, 'EMP009', 'Kitchen', '2025-08-10', NULL, 'active', '2025-10-10 05:42:41', '2025-10-10 05:42:41'),
(11, 12, 2, 'EMP0010', 'Receptionist', '2025-07-10', NULL, 'active', '2025-10-10 05:42:41', '2025-10-10 05:42:41');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED NOT NULL,
  `rating` tinyint UNSIGNED NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'kg, g, lit, ml, cai, hop',
  `stock_quantity` double NOT NULL DEFAULT '0',
  `alert_quantity` double NOT NULL DEFAULT '0' COMMENT 'Số lượng cảnh báo sắp hết',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `menu_categories`
--

CREATE TABLE `menu_categories` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menu_categories`
--

INSERT INTO `menu_categories` (`id`, `name`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'Khai vị', '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(2, 'Món chính', '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(3, 'Tráng miệng', '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(4, 'Đồ uống', '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(5, 'Lẩu', '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `menu_items`
--

CREATE TABLE `menu_items` (
  `id` bigint UNSIGNED NOT NULL,
  `category_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(12,2) NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `calories` int DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menu_items`
--

INSERT INTO `menu_items` (`id`, `category_id`, `name`, `description`, `price`, `image`, `calories`, `is_available`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 4, 'Món ăn necessitatibus ipsum ullam', 'Et quia nostrum expedita nostrum excepturi perspiciatis quo.', '463313.00', NULL, 670, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(2, 4, 'Món ăn eum excepturi quo', 'Accusantium aut velit dicta.', '273629.00', NULL, 479, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(3, 1, 'Món ăn et blanditiis optio', 'Dolor mollitia ea sunt blanditiis deserunt nisi.', '495192.00', NULL, 533, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(4, 5, 'Món ăn corporis vitae beatae', 'Quisquam laudantium est molestiae autem dolor perferendis aspernatur.', '345817.00', NULL, 134, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(5, 2, 'Món ăn consequatur distinctio unde', 'Amet nesciunt modi debitis laboriosam voluptas.', '80940.00', NULL, 534, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(6, 3, 'Món ăn eaque id cumque', 'Tenetur consectetur et consequatur necessitatibus temporibus iusto.', '153976.00', NULL, 552, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(7, 2, 'Món ăn molestias molestiae itaque', 'Molestiae velit velit cumque voluptas assumenda ratione eligendi.', '206127.00', NULL, 509, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(8, 4, 'Món ăn labore omnis sunt', 'Assumenda velit iste est at vel.', '147583.00', NULL, 694, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(9, 3, 'Món ăn quis est sequi', 'Sit molestiae inventore vitae rerum assumenda unde sit.', '292141.00', NULL, 264, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(10, 4, 'Món ăn ut similique earum', 'Doloremque ut velit doloremque repellat non.', '348798.00', NULL, 488, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(11, 4, 'Món ăn nobis dolorem commodi', 'Est vel quia qui et dolores nobis eius.', '69169.00', NULL, 648, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(12, 3, 'Món ăn consequuntur et modi', 'Explicabo aut voluptatem enim sed vel perspiciatis.', '191326.00', NULL, 317, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(13, 1, 'Món ăn ut omnis alias', 'Quia dolore fugiat quaerat incidunt adipisci et repellendus.', '422062.00', NULL, 460, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(14, 1, 'Món ăn quae ipsum praesentium', 'Aliquam consequatur sint omnis qui.', '338966.00', NULL, 519, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(15, 5, 'Món ăn voluptatem consequatur eaque', 'Quam itaque voluptas suscipit culpa nam consequatur facere officiis.', '63680.00', NULL, 377, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(16, 5, 'Món ăn ab non ipsum', 'Laboriosam doloribus et vel aliquid voluptatem tempore.', '283975.00', NULL, 125, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(17, 5, 'Món ăn et cumque molestiae', 'Reprehenderit expedita sit quisquam molestiae.', '107797.00', NULL, 445, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(18, 3, 'Món ăn impedit voluptatem enim', 'Quis non sequi architecto veniam necessitatibus suscipit qui.', '208533.00', NULL, 382, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(19, 4, 'Món ăn et quod eos', 'Vel magnam voluptatem quasi consequatur quia ut doloremque.', '165863.00', NULL, 727, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(20, 4, 'Món ăn et accusantium deleniti', 'Necessitatibus omnis molestias dolorem consequuntur dolorem dolores.', '352481.00', NULL, 231, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(21, 4, 'Món ăn eos eos excepturi', 'Laborum ex qui maxime mollitia temporibus ipsam.', '105196.00', NULL, 667, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(22, 1, 'Món ăn sed distinctio qui', 'Cumque et tenetur corrupti est occaecati voluptas sint.', '106378.00', NULL, 535, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(23, 4, 'Món ăn consectetur est inventore', 'Reiciendis pariatur qui omnis consequatur nobis pariatur eum.', '259821.00', NULL, 508, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(24, 1, 'Món ăn laborum et dolores', 'Ut suscipit pariatur magnam voluptates.', '140343.00', NULL, 591, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(25, 5, 'Món ăn nesciunt non molestiae', 'Quibusdam blanditiis hic quidem inventore id.', '427578.00', NULL, 369, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(26, 5, 'Món ăn fugiat beatae non', 'Vitae natus animi facilis ullam fugiat et ducimus.', '351853.00', NULL, 729, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(27, 3, 'Món ăn aut est qui', 'Dolorem ducimus omnis architecto saepe facilis eaque illo alias.', '434035.00', NULL, 406, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(28, 1, 'Món ăn veniam voluptas at', 'Natus et voluptates et assumenda consequuntur et voluptas quisquam.', '152657.00', NULL, 407, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(29, 3, 'Món ăn deleniti accusantium voluptatum', 'Cumque odio eos ipsa iste id.', '137405.00', NULL, 775, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(30, 4, 'Món ăn exercitationem architecto quia', 'Quibusdam in consequatur molestiae facilis assumenda mollitia et autem.', '56402.00', NULL, 477, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(31, 2, 'Món ăn voluptas saepe eligendi', 'Eligendi saepe aliquam consequuntur aut.', '325125.00', NULL, 792, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(32, 4, 'Món ăn et facilis nihil', 'Aliquid enim sequi quidem nobis nostrum hic praesentium.', '114290.00', NULL, 157, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(33, 3, 'Món ăn aut cupiditate illum', 'Delectus maxime cupiditate omnis.', '361306.00', NULL, 472, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(34, 4, 'Món ăn deleniti voluptas saepe', 'Eveniet itaque esse aut qui culpa possimus est.', '261476.00', NULL, 714, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(35, 2, 'Món ăn saepe et officiis', 'Voluptatum dolorem modi rerum qui at.', '155640.00', NULL, 629, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(36, 3, 'Món ăn non molestiae a', 'In quo nihil voluptatum.', '281682.00', NULL, 705, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(37, 4, 'Món ăn porro est aliquam', 'Cumque sunt et eius commodi rerum.', '393258.00', NULL, 459, 1, '2025-10-10 05:42:43', '2025-10-10 05:42:43', NULL),
(38, 5, 'Món ăn autem dolore magni', 'Quia doloremque pariatur omnis veritatis sit ducimus unde.', '90602.00', NULL, 169, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(39, 2, 'Món ăn qui quia voluptas', 'Sequi aut maiores ut laudantium ipsa consequatur.', '474795.00', NULL, 327, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(40, 3, 'Món ăn et aliquid quidem', 'Voluptas nam non fuga molestias eos nihil a.', '153713.00', NULL, 105, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(41, 4, 'Món ăn nemo perspiciatis expedita', 'Sint quod maiores nulla omnis.', '83400.00', NULL, 759, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(42, 3, 'Món ăn aut debitis dolorem', 'Tempore facere assumenda perspiciatis amet.', '193748.00', NULL, 534, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(43, 4, 'Món ăn reiciendis non adipisci', 'Non mollitia perferendis at et placeat.', '253950.00', NULL, 347, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(44, 3, 'Món ăn tempora cumque est', 'Aliquid illum ab est.', '367290.00', NULL, 504, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(45, 3, 'Món ăn ducimus quisquam voluptatem', 'Sed praesentium in quos velit nihil est.', '74216.00', NULL, 598, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(46, 5, 'Món ăn incidunt sapiente reprehenderit', 'Assumenda voluptas voluptate sequi perferendis atque aut voluptate.', '228559.00', NULL, 753, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(47, 3, 'Món ăn reprehenderit sequi aut', 'Et dolorem dolor et cumque perspiciatis libero sunt.', '131239.00', NULL, 500, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(48, 1, 'Món ăn accusamus quia et', 'Sint earum autem repudiandae aspernatur.', '96854.00', NULL, 234, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(49, 4, 'Món ăn aliquam suscipit iste', 'Eum corrupti enim odio reiciendis ab excepturi asperiores.', '489654.00', NULL, 582, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL),
(50, 4, 'Món ăn sequi nostrum non', 'Ab commodi iste ut voluptates fugit.', '497395.00', NULL, 365, 1, '2025-10-10 05:42:44', '2025-10-10 05:42:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `menu_item_ingredient`
--

CREATE TABLE `menu_item_ingredient` (
  `id` bigint UNSIGNED NOT NULL,
  `menu_item_id` bigint UNSIGNED NOT NULL,
  `ingredient_id` bigint UNSIGNED NOT NULL,
  `quantity` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000001_create_cache_table', 1),
(2, '0001_01_01_000002_create_jobs_table', 1),
(3, '2025_10_10_112343_create_foundation_tables', 1),
(4, '2025_10_10_112943_create_personal_access_tokens_table', 1),
(5, '2025_10_10_115941_create_otp_codes_table', 1),
(6, '2025_10_10_124728_create_sessions_table', 2);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notifiable_id` bigint UNSIGNED NOT NULL,
  `data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `branch_id` bigint UNSIGNED NOT NULL,
  `table_id` bigint UNSIGNED DEFAULT NULL,
  `booking_id` bigint UNSIGNED DEFAULT NULL,
  `employee_id` bigint UNSIGNED DEFAULT NULL,
  `total_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `discount_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `final_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `status` enum('pending','processing','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `type` enum('dine-in','takeaway') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'dine-in',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `branch_id`, `table_id`, `booking_id`, `employee_id`, `total_amount`, `discount_amount`, `final_amount`, `status`, `type`, `notes`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 20, 2, 49, NULL, NULL, '794626.00', '0.00', '794626.00', 'completed', 'dine-in', NULL, '2025-09-11 05:42:44', '2025-10-10 05:42:44', NULL),
(2, 20, 1, 47, NULL, NULL, '1143641.00', '0.00', '1143641.00', 'completed', 'dine-in', NULL, '2025-09-17 05:42:44', '2025-10-10 05:42:44', NULL),
(3, 25, 1, 54, NULL, NULL, '368660.00', '0.00', '368660.00', 'completed', 'dine-in', NULL, '2025-10-09 05:42:45', '2025-10-10 05:42:45', NULL),
(4, 18, 2, 19, NULL, NULL, '1442448.00', '0.00', '1442448.00', 'completed', 'dine-in', NULL, '2025-10-03 05:42:45', '2025-10-10 05:42:45', NULL),
(5, 25, 2, 12, NULL, NULL, '3548594.00', '0.00', '3548594.00', 'completed', 'dine-in', NULL, '2025-10-08 05:42:45', '2025-10-10 05:42:45', NULL),
(6, 23, 2, 52, NULL, NULL, '953906.00', '0.00', '953906.00', 'completed', 'dine-in', NULL, '2025-10-04 05:42:45', '2025-10-10 05:42:45', NULL),
(7, 20, 1, 48, NULL, NULL, '3176820.00', '0.00', '3176820.00', 'completed', 'dine-in', NULL, '2025-09-18 05:42:45', '2025-10-10 05:42:45', NULL),
(8, 15, 1, 24, NULL, NULL, '1922073.00', '0.00', '1922073.00', 'completed', 'dine-in', NULL, '2025-09-25 05:42:45', '2025-10-10 05:42:46', NULL),
(9, 19, 2, 39, NULL, NULL, '1711486.00', '0.00', '1711486.00', 'completed', 'dine-in', NULL, '2025-10-10 05:42:46', '2025-10-10 05:42:46', NULL),
(10, 22, 1, 60, NULL, NULL, '778200.00', '0.00', '778200.00', 'completed', 'dine-in', NULL, '2025-09-20 05:42:46', '2025-10-10 05:42:46', NULL),
(11, 18, 2, 18, NULL, NULL, '1346321.00', '0.00', '1346321.00', 'completed', 'dine-in', NULL, '2025-10-09 05:42:46', '2025-10-10 05:42:46', NULL),
(12, 30, 1, 58, NULL, NULL, '4212198.00', '0.00', '4212198.00', 'completed', 'dine-in', NULL, '2025-09-15 05:42:46', '2025-10-10 05:42:46', NULL),
(13, 29, 2, 33, NULL, NULL, '2852162.00', '0.00', '2852162.00', 'completed', 'dine-in', NULL, '2025-09-11 05:42:46', '2025-10-10 05:42:46', NULL),
(14, 31, 1, 51, NULL, NULL, '1843695.00', '0.00', '1843695.00', 'completed', 'dine-in', NULL, '2025-10-10 05:42:46', '2025-10-10 05:42:46', NULL),
(15, 16, 1, 37, NULL, NULL, '1623687.00', '0.00', '1623687.00', 'completed', 'dine-in', NULL, '2025-09-10 05:42:46', '2025-10-10 05:42:47', NULL),
(16, 17, 2, 44, NULL, NULL, '576848.00', '0.00', '576848.00', 'completed', 'dine-in', NULL, '2025-09-27 05:42:47', '2025-10-10 05:42:47', NULL),
(17, 24, 1, 1, NULL, NULL, '1400544.00', '0.00', '1400544.00', 'completed', 'dine-in', NULL, '2025-10-02 05:42:47', '2025-10-10 05:42:47', NULL),
(18, 25, 2, 10, NULL, NULL, '3660722.00', '0.00', '3660722.00', 'completed', 'dine-in', NULL, '2025-09-30 05:42:47', '2025-10-10 05:42:47', NULL),
(19, 17, 2, 47, NULL, NULL, '1937200.00', '0.00', '1937200.00', 'completed', 'dine-in', NULL, '2025-09-24 05:42:47', '2025-10-10 05:42:47', NULL),
(20, 27, 1, 9, NULL, NULL, '698940.00', '0.00', '698940.00', 'completed', 'dine-in', NULL, '2025-09-12 05:42:47', '2025-10-10 05:42:47', NULL),
(21, 20, 2, 5, NULL, NULL, '1945343.00', '0.00', '1945343.00', 'completed', 'dine-in', NULL, '2025-09-27 05:42:47', '2025-10-10 05:42:47', NULL),
(22, 14, 2, 1, NULL, NULL, '1121181.00', '0.00', '1121181.00', 'completed', 'dine-in', NULL, '2025-09-21 05:42:47', '2025-10-10 05:42:48', NULL),
(23, 26, 1, 15, NULL, NULL, '1696923.00', '0.00', '1696923.00', 'completed', 'dine-in', NULL, '2025-09-21 05:42:48', '2025-10-10 05:42:48', NULL),
(24, 29, 2, 19, NULL, NULL, '1572715.00', '0.00', '1572715.00', 'completed', 'dine-in', NULL, '2025-09-24 05:42:48', '2025-10-10 05:42:48', NULL),
(25, 31, 1, 56, NULL, NULL, '2323337.00', '0.00', '2323337.00', 'completed', 'dine-in', NULL, '2025-10-03 05:42:48', '2025-10-10 05:42:48', NULL),
(26, 22, 1, 12, NULL, NULL, '915784.00', '0.00', '915784.00', 'completed', 'dine-in', NULL, '2025-09-11 05:42:48', '2025-10-10 05:42:48', NULL),
(27, 24, 1, 35, NULL, NULL, '2661759.00', '0.00', '2661759.00', 'completed', 'dine-in', NULL, '2025-09-18 05:42:48', '2025-10-10 05:42:48', NULL),
(28, 14, 2, 43, NULL, NULL, '1059441.00', '0.00', '1059441.00', 'completed', 'dine-in', NULL, '2025-10-02 05:42:48', '2025-10-10 05:42:48', NULL),
(29, 15, 1, 3, NULL, NULL, '1511959.00', '0.00', '1511959.00', 'completed', 'dine-in', NULL, '2025-09-19 05:42:48', '2025-10-10 05:42:48', NULL),
(30, 14, 1, 58, NULL, NULL, '2960310.00', '0.00', '2960310.00', 'completed', 'dine-in', NULL, '2025-09-26 05:42:49', '2025-10-10 05:42:49', NULL),
(31, 25, 2, 42, NULL, NULL, '1185513.00', '0.00', '1185513.00', 'completed', 'dine-in', NULL, '2025-09-23 05:42:49', '2025-10-10 05:42:49', NULL),
(32, 18, 1, 49, NULL, NULL, '1188201.00', '0.00', '1188201.00', 'completed', 'dine-in', NULL, '2025-09-15 05:42:49', '2025-10-10 05:42:49', NULL),
(33, 15, 1, 7, NULL, NULL, '430798.00', '0.00', '430798.00', 'completed', 'dine-in', NULL, '2025-09-17 05:42:49', '2025-10-10 05:42:49', NULL),
(34, 28, 1, 47, NULL, NULL, '1971156.00', '0.00', '1971156.00', 'completed', 'dine-in', NULL, '2025-09-22 05:42:49', '2025-10-10 05:42:49', NULL),
(35, 19, 1, 32, NULL, NULL, '2476114.00', '0.00', '2476114.00', 'completed', 'dine-in', NULL, '2025-10-02 05:42:49', '2025-10-10 05:42:49', NULL),
(36, 32, 1, 30, NULL, NULL, '2359087.00', '0.00', '2359087.00', 'completed', 'dine-in', NULL, '2025-10-03 05:42:49', '2025-10-10 05:42:49', NULL),
(37, 21, 2, 3, NULL, NULL, '575429.00', '0.00', '575429.00', 'completed', 'dine-in', NULL, '2025-09-27 05:42:50', '2025-10-10 05:42:50', NULL),
(38, 19, 2, 25, NULL, NULL, '1341763.00', '0.00', '1341763.00', 'completed', 'dine-in', NULL, '2025-09-10 05:42:50', '2025-10-10 05:42:50', NULL),
(39, 27, 2, 46, NULL, NULL, '1273696.00', '0.00', '1273696.00', 'completed', 'dine-in', NULL, '2025-09-25 05:42:50', '2025-10-10 05:42:50', NULL),
(40, 32, 1, 27, NULL, NULL, '2222671.00', '0.00', '2222671.00', 'completed', 'dine-in', NULL, '2025-10-02 05:42:50', '2025-10-10 05:42:50', NULL),
(41, 13, 1, 27, NULL, NULL, '2500131.00', '0.00', '2500131.00', 'completed', 'dine-in', NULL, '2025-09-18 05:42:50', '2025-10-10 05:42:50', NULL),
(42, 18, 2, 11, NULL, NULL, '2514623.00', '0.00', '2514623.00', 'completed', 'dine-in', NULL, '2025-09-21 05:42:50', '2025-10-10 05:42:50', NULL),
(43, 29, 2, 38, NULL, NULL, '1319831.00', '0.00', '1319831.00', 'completed', 'dine-in', NULL, '2025-10-04 05:42:50', '2025-10-10 05:42:50', NULL),
(44, 29, 1, 8, NULL, NULL, '1147210.00', '0.00', '1147210.00', 'completed', 'dine-in', NULL, '2025-09-16 05:42:51', '2025-10-10 05:42:51', NULL),
(45, 29, 2, 49, NULL, NULL, '1654704.00', '0.00', '1654704.00', 'completed', 'dine-in', NULL, '2025-09-25 05:42:51', '2025-10-10 05:42:51', NULL),
(46, 31, 2, 38, NULL, NULL, '1126893.00', '0.00', '1126893.00', 'completed', 'dine-in', NULL, '2025-10-01 05:42:51', '2025-10-10 05:42:51', NULL),
(47, 31, 1, 42, NULL, NULL, '493400.00', '0.00', '493400.00', 'completed', 'dine-in', NULL, '2025-09-23 05:42:51', '2025-10-10 05:42:51', NULL),
(48, 17, 2, 31, NULL, NULL, '1147967.00', '0.00', '1147967.00', 'completed', 'dine-in', NULL, '2025-10-01 05:42:51', '2025-10-10 05:42:51', NULL),
(49, 28, 1, 8, NULL, NULL, '1004188.00', '0.00', '1004188.00', 'completed', 'dine-in', NULL, '2025-10-09 05:42:51', '2025-10-10 05:42:51', NULL),
(50, 32, 2, 24, NULL, NULL, '476598.00', '0.00', '476598.00', 'completed', 'dine-in', NULL, '2025-10-01 05:42:51', '2025-10-10 05:42:51', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED NOT NULL,
  `orderable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderable_id` bigint UNSIGNED NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(12,2) NOT NULL COMMENT 'Giá tại thời điểm đặt hàng',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `orderable_type`, `orderable_id`, `quantity`, `price`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 'App\\Models\\MenuItem', 41, 1, '83400.00', NULL, NULL, NULL),
(2, 1, 'App\\Models\\MenuItem', 18, 2, '208533.00', NULL, NULL, NULL),
(3, 1, 'App\\Models\\MenuItem', 41, 2, '83400.00', NULL, NULL, NULL),
(4, 1, 'App\\Models\\MenuItem', 15, 2, '63680.00', NULL, NULL, NULL),
(5, 2, 'App\\Models\\MenuItem', 14, 1, '338966.00', NULL, NULL, NULL),
(6, 2, 'App\\Models\\MenuItem', 9, 1, '292141.00', NULL, NULL, NULL),
(7, 2, 'App\\Models\\MenuItem', 46, 1, '228559.00', NULL, NULL, NULL),
(8, 2, 'App\\Models\\MenuItem', 16, 1, '283975.00', NULL, NULL, NULL),
(9, 3, 'App\\Models\\MenuItem', 48, 1, '96854.00', NULL, NULL, NULL),
(10, 3, 'App\\Models\\MenuItem', 38, 3, '90602.00', NULL, NULL, NULL),
(11, 4, 'App\\Models\\MenuItem', 27, 3, '434035.00', NULL, NULL, NULL),
(12, 4, 'App\\Models\\MenuItem', 24, 1, '140343.00', NULL, NULL, NULL),
(13, 5, 'App\\Models\\MenuItem', 3, 1, '495192.00', NULL, NULL, NULL),
(14, 5, 'App\\Models\\MenuItem', 46, 2, '228559.00', NULL, NULL, NULL),
(15, 5, 'App\\Models\\MenuItem', 39, 2, '474795.00', NULL, NULL, NULL),
(16, 5, 'App\\Models\\MenuItem', 37, 3, '393258.00', NULL, NULL, NULL),
(17, 5, 'App\\Models\\MenuItem', 35, 3, '155640.00', NULL, NULL, NULL),
(18, 6, 'App\\Models\\MenuItem', 26, 2, '351853.00', NULL, NULL, NULL),
(19, 6, 'App\\Models\\MenuItem', 41, 3, '83400.00', NULL, NULL, NULL),
(20, 7, 'App\\Models\\MenuItem', 29, 2, '137405.00', NULL, NULL, NULL),
(21, 7, 'App\\Models\\MenuItem', 25, 2, '427578.00', NULL, NULL, NULL),
(22, 7, 'App\\Models\\MenuItem', 44, 2, '367290.00', NULL, NULL, NULL),
(23, 7, 'App\\Models\\MenuItem', 46, 2, '228559.00', NULL, NULL, NULL),
(24, 7, 'App\\Models\\MenuItem', 25, 2, '427578.00', NULL, NULL, NULL),
(25, 8, 'App\\Models\\MenuItem', 12, 3, '191326.00', NULL, NULL, NULL),
(26, 8, 'App\\Models\\MenuItem', 41, 1, '83400.00', NULL, NULL, NULL),
(27, 8, 'App\\Models\\MenuItem', 44, 1, '367290.00', NULL, NULL, NULL),
(28, 8, 'App\\Models\\MenuItem', 18, 3, '208533.00', NULL, NULL, NULL),
(29, 8, 'App\\Models\\MenuItem', 38, 3, '90602.00', NULL, NULL, NULL),
(30, 9, 'App\\Models\\MenuItem', 23, 1, '259821.00', NULL, NULL, NULL),
(31, 9, 'App\\Models\\MenuItem', 15, 3, '63680.00', NULL, NULL, NULL),
(32, 9, 'App\\Models\\MenuItem', 32, 3, '114290.00', NULL, NULL, NULL),
(33, 9, 'App\\Models\\MenuItem', 47, 1, '131239.00', NULL, NULL, NULL),
(34, 9, 'App\\Models\\MenuItem', 37, 2, '393258.00', NULL, NULL, NULL),
(35, 10, 'App\\Models\\MenuItem', 35, 2, '155640.00', NULL, NULL, NULL),
(36, 10, 'App\\Models\\MenuItem', 35, 3, '155640.00', NULL, NULL, NULL),
(37, 11, 'App\\Models\\MenuItem', 3, 2, '495192.00', NULL, NULL, NULL),
(38, 11, 'App\\Models\\MenuItem', 24, 1, '140343.00', NULL, NULL, NULL),
(39, 11, 'App\\Models\\MenuItem', 17, 2, '107797.00', NULL, NULL, NULL),
(40, 12, 'App\\Models\\MenuItem', 49, 2, '489654.00', NULL, NULL, NULL),
(41, 12, 'App\\Models\\MenuItem', 26, 3, '351853.00', NULL, NULL, NULL),
(42, 12, 'App\\Models\\MenuItem', 49, 2, '489654.00', NULL, NULL, NULL),
(43, 12, 'App\\Models\\MenuItem', 45, 3, '74216.00', NULL, NULL, NULL),
(44, 12, 'App\\Models\\MenuItem', 31, 3, '325125.00', NULL, NULL, NULL),
(45, 13, 'App\\Models\\MenuItem', 25, 3, '427578.00', NULL, NULL, NULL),
(46, 13, 'App\\Models\\MenuItem', 14, 3, '338966.00', NULL, NULL, NULL),
(47, 13, 'App\\Models\\MenuItem', 38, 1, '90602.00', NULL, NULL, NULL),
(48, 13, 'App\\Models\\MenuItem', 6, 3, '153976.00', NULL, NULL, NULL),
(49, 14, 'App\\Models\\MenuItem', 44, 3, '367290.00', NULL, NULL, NULL),
(50, 14, 'App\\Models\\MenuItem', 40, 1, '153713.00', NULL, NULL, NULL),
(51, 14, 'App\\Models\\MenuItem', 24, 2, '140343.00', NULL, NULL, NULL),
(52, 14, 'App\\Models\\MenuItem', 40, 2, '153713.00', NULL, NULL, NULL),
(53, 15, 'App\\Models\\MenuItem', 26, 2, '351853.00', NULL, NULL, NULL),
(54, 15, 'App\\Models\\MenuItem', 40, 1, '153713.00', NULL, NULL, NULL),
(55, 15, 'App\\Models\\MenuItem', 28, 1, '152657.00', NULL, NULL, NULL),
(56, 15, 'App\\Models\\MenuItem', 35, 1, '155640.00', NULL, NULL, NULL),
(57, 15, 'App\\Models\\MenuItem', 28, 3, '152657.00', NULL, NULL, NULL),
(58, 16, 'App\\Models\\MenuItem', 8, 2, '147583.00', NULL, NULL, NULL),
(59, 16, 'App\\Models\\MenuItem', 36, 1, '281682.00', NULL, NULL, NULL),
(60, 17, 'App\\Models\\MenuItem', 14, 2, '338966.00', NULL, NULL, NULL),
(61, 17, 'App\\Models\\MenuItem', 33, 2, '361306.00', NULL, NULL, NULL),
(62, 18, 'App\\Models\\MenuItem', 9, 2, '292141.00', NULL, NULL, NULL),
(63, 18, 'App\\Models\\MenuItem', 34, 2, '261476.00', NULL, NULL, NULL),
(64, 18, 'App\\Models\\MenuItem', 22, 2, '106378.00', NULL, NULL, NULL),
(65, 18, 'App\\Models\\MenuItem', 3, 3, '495192.00', NULL, NULL, NULL),
(66, 18, 'App\\Models\\MenuItem', 25, 2, '427578.00', NULL, NULL, NULL),
(67, 19, 'App\\Models\\MenuItem', 10, 3, '348798.00', NULL, NULL, NULL),
(68, 19, 'App\\Models\\MenuItem', 34, 1, '261476.00', NULL, NULL, NULL),
(69, 19, 'App\\Models\\MenuItem', 31, 1, '325125.00', NULL, NULL, NULL),
(70, 19, 'App\\Models\\MenuItem', 41, 2, '83400.00', NULL, NULL, NULL),
(71, 19, 'App\\Models\\MenuItem', 29, 1, '137405.00', NULL, NULL, NULL),
(72, 20, 'App\\Models\\MenuItem', 43, 2, '253950.00', NULL, NULL, NULL),
(73, 20, 'App\\Models\\MenuItem', 15, 3, '63680.00', NULL, NULL, NULL),
(74, 21, 'App\\Models\\MenuItem', 33, 2, '361306.00', NULL, NULL, NULL),
(75, 21, 'App\\Models\\MenuItem', 11, 1, '69169.00', NULL, NULL, NULL),
(76, 21, 'App\\Models\\MenuItem', 6, 3, '153976.00', NULL, NULL, NULL),
(77, 21, 'App\\Models\\MenuItem', 4, 2, '345817.00', NULL, NULL, NULL),
(78, 22, 'App\\Models\\MenuItem', 18, 1, '208533.00', NULL, NULL, NULL),
(79, 22, 'App\\Models\\MenuItem', 48, 1, '96854.00', NULL, NULL, NULL),
(80, 22, 'App\\Models\\MenuItem', 20, 1, '352481.00', NULL, NULL, NULL),
(81, 22, 'App\\Models\\MenuItem', 1, 1, '463313.00', NULL, NULL, NULL),
(82, 23, 'App\\Models\\MenuItem', 49, 2, '489654.00', NULL, NULL, NULL),
(83, 23, 'App\\Models\\MenuItem', 39, 1, '474795.00', NULL, NULL, NULL),
(84, 23, 'App\\Models\\MenuItem', 5, 3, '80940.00', NULL, NULL, NULL),
(85, 24, 'App\\Models\\MenuItem', 49, 1, '489654.00', NULL, NULL, NULL),
(86, 24, 'App\\Models\\MenuItem', 25, 1, '427578.00', NULL, NULL, NULL),
(87, 24, 'App\\Models\\MenuItem', 43, 2, '253950.00', NULL, NULL, NULL),
(88, 24, 'App\\Models\\MenuItem', 8, 1, '147583.00', NULL, NULL, NULL),
(89, 25, 'App\\Models\\MenuItem', 12, 3, '191326.00', NULL, NULL, NULL),
(90, 25, 'App\\Models\\MenuItem', 9, 2, '292141.00', NULL, NULL, NULL),
(91, 25, 'App\\Models\\MenuItem', 9, 2, '292141.00', NULL, NULL, NULL),
(92, 25, 'App\\Models\\MenuItem', 41, 1, '83400.00', NULL, NULL, NULL),
(93, 25, 'App\\Models\\MenuItem', 50, 1, '497395.00', NULL, NULL, NULL),
(94, 26, 'App\\Models\\MenuItem', 38, 2, '90602.00', NULL, NULL, NULL),
(95, 26, 'App\\Models\\MenuItem', 44, 2, '367290.00', NULL, NULL, NULL),
(96, 27, 'App\\Models\\MenuItem', 26, 3, '351853.00', NULL, NULL, NULL),
(97, 27, 'App\\Models\\MenuItem', 28, 3, '152657.00', NULL, NULL, NULL),
(98, 27, 'App\\Models\\MenuItem', 38, 3, '90602.00', NULL, NULL, NULL),
(99, 27, 'App\\Models\\MenuItem', 9, 3, '292141.00', NULL, NULL, NULL),
(100, 28, 'App\\Models\\MenuItem', 11, 3, '69169.00', NULL, NULL, NULL),
(101, 28, 'App\\Models\\MenuItem', 23, 1, '259821.00', NULL, NULL, NULL),
(102, 28, 'App\\Models\\MenuItem', 8, 1, '147583.00', NULL, NULL, NULL),
(103, 28, 'App\\Models\\MenuItem', 19, 2, '165863.00', NULL, NULL, NULL),
(104, 28, 'App\\Models\\MenuItem', 30, 2, '56402.00', NULL, NULL, NULL),
(105, 29, 'App\\Models\\MenuItem', 19, 2, '165863.00', NULL, NULL, NULL),
(106, 29, 'App\\Models\\MenuItem', 37, 2, '393258.00', NULL, NULL, NULL),
(107, 29, 'App\\Models\\MenuItem', 47, 3, '131239.00', NULL, NULL, NULL),
(108, 30, 'App\\Models\\MenuItem', 3, 2, '495192.00', NULL, NULL, NULL),
(109, 30, 'App\\Models\\MenuItem', 42, 2, '193748.00', NULL, NULL, NULL),
(110, 30, 'App\\Models\\MenuItem', 3, 3, '495192.00', NULL, NULL, NULL),
(111, 30, 'App\\Models\\MenuItem', 48, 1, '96854.00', NULL, NULL, NULL),
(112, 31, 'App\\Models\\MenuItem', 47, 2, '131239.00', NULL, NULL, NULL),
(113, 31, 'App\\Models\\MenuItem', 28, 1, '152657.00', NULL, NULL, NULL),
(114, 31, 'App\\Models\\MenuItem', 43, 2, '253950.00', NULL, NULL, NULL),
(115, 31, 'App\\Models\\MenuItem', 47, 2, '131239.00', NULL, NULL, NULL),
(116, 32, 'App\\Models\\MenuItem', 29, 2, '137405.00', NULL, NULL, NULL),
(117, 32, 'App\\Models\\MenuItem', 34, 2, '261476.00', NULL, NULL, NULL),
(118, 32, 'App\\Models\\MenuItem', 5, 2, '80940.00', NULL, NULL, NULL),
(119, 32, 'App\\Models\\MenuItem', 46, 1, '228559.00', NULL, NULL, NULL),
(120, 33, 'App\\Models\\MenuItem', 30, 1, '56402.00', NULL, NULL, NULL),
(121, 33, 'App\\Models\\MenuItem', 18, 1, '208533.00', NULL, NULL, NULL),
(122, 33, 'App\\Models\\MenuItem', 19, 1, '165863.00', NULL, NULL, NULL),
(123, 34, 'App\\Models\\MenuItem', 32, 1, '114290.00', NULL, NULL, NULL),
(124, 34, 'App\\Models\\MenuItem', 36, 1, '281682.00', NULL, NULL, NULL),
(125, 34, 'App\\Models\\MenuItem', 48, 3, '96854.00', NULL, NULL, NULL),
(126, 34, 'App\\Models\\MenuItem', 49, 2, '489654.00', NULL, NULL, NULL),
(127, 34, 'App\\Models\\MenuItem', 28, 2, '152657.00', NULL, NULL, NULL),
(128, 35, 'App\\Models\\MenuItem', 36, 3, '281682.00', NULL, NULL, NULL),
(129, 35, 'App\\Models\\MenuItem', 30, 1, '56402.00', NULL, NULL, NULL),
(130, 35, 'App\\Models\\MenuItem', 9, 2, '292141.00', NULL, NULL, NULL),
(131, 35, 'App\\Models\\MenuItem', 3, 2, '495192.00', NULL, NULL, NULL),
(132, 36, 'App\\Models\\MenuItem', 43, 3, '253950.00', NULL, NULL, NULL),
(133, 36, 'App\\Models\\MenuItem', 20, 1, '352481.00', NULL, NULL, NULL),
(134, 36, 'App\\Models\\MenuItem', 8, 2, '147583.00', NULL, NULL, NULL),
(135, 36, 'App\\Models\\MenuItem', 39, 2, '474795.00', NULL, NULL, NULL),
(136, 37, 'App\\Models\\MenuItem', 32, 1, '114290.00', NULL, NULL, NULL),
(137, 37, 'App\\Models\\MenuItem', 40, 3, '153713.00', NULL, NULL, NULL),
(138, 38, 'App\\Models\\MenuItem', 11, 2, '69169.00', NULL, NULL, NULL),
(139, 38, 'App\\Models\\MenuItem', 42, 1, '193748.00', NULL, NULL, NULL),
(140, 38, 'App\\Models\\MenuItem', 34, 1, '261476.00', NULL, NULL, NULL),
(141, 38, 'App\\Models\\MenuItem', 23, 2, '259821.00', NULL, NULL, NULL),
(142, 38, 'App\\Models\\MenuItem', 46, 1, '228559.00', NULL, NULL, NULL),
(143, 39, 'App\\Models\\MenuItem', 20, 1, '352481.00', NULL, NULL, NULL),
(144, 39, 'App\\Models\\MenuItem', 11, 2, '69169.00', NULL, NULL, NULL),
(145, 39, 'App\\Models\\MenuItem', 19, 1, '165863.00', NULL, NULL, NULL),
(146, 39, 'App\\Models\\MenuItem', 49, 1, '489654.00', NULL, NULL, NULL),
(147, 39, 'App\\Models\\MenuItem', 15, 2, '63680.00', NULL, NULL, NULL),
(148, 40, 'App\\Models\\MenuItem', 35, 1, '155640.00', NULL, NULL, NULL),
(149, 40, 'App\\Models\\MenuItem', 32, 1, '114290.00', NULL, NULL, NULL),
(150, 40, 'App\\Models\\MenuItem', 16, 3, '283975.00', NULL, NULL, NULL),
(151, 40, 'App\\Models\\MenuItem', 43, 3, '253950.00', NULL, NULL, NULL),
(152, 40, 'App\\Models\\MenuItem', 14, 1, '338966.00', NULL, NULL, NULL),
(153, 41, 'App\\Models\\MenuItem', 27, 3, '434035.00', NULL, NULL, NULL),
(154, 41, 'App\\Models\\MenuItem', 32, 3, '114290.00', NULL, NULL, NULL),
(155, 41, 'App\\Models\\MenuItem', 25, 2, '427578.00', NULL, NULL, NULL),
(156, 42, 'App\\Models\\MenuItem', 50, 1, '497395.00', NULL, NULL, NULL),
(157, 42, 'App\\Models\\MenuItem', 20, 1, '352481.00', NULL, NULL, NULL),
(158, 42, 'App\\Models\\MenuItem', 14, 3, '338966.00', NULL, NULL, NULL),
(159, 42, 'App\\Models\\MenuItem', 28, 1, '152657.00', NULL, NULL, NULL),
(160, 42, 'App\\Models\\MenuItem', 3, 1, '495192.00', NULL, NULL, NULL),
(161, 43, 'App\\Models\\MenuItem', 22, 3, '106378.00', NULL, NULL, NULL),
(162, 43, 'App\\Models\\MenuItem', 16, 2, '283975.00', NULL, NULL, NULL),
(163, 43, 'App\\Models\\MenuItem', 48, 1, '96854.00', NULL, NULL, NULL),
(164, 43, 'App\\Models\\MenuItem', 15, 2, '63680.00', NULL, NULL, NULL),
(165, 43, 'App\\Models\\MenuItem', 18, 1, '208533.00', NULL, NULL, NULL),
(166, 44, 'App\\Models\\MenuItem', 4, 2, '345817.00', NULL, NULL, NULL),
(167, 44, 'App\\Models\\MenuItem', 5, 3, '80940.00', NULL, NULL, NULL),
(168, 44, 'App\\Models\\MenuItem', 22, 2, '106378.00', NULL, NULL, NULL),
(169, 45, 'App\\Models\\MenuItem', 1, 3, '463313.00', NULL, NULL, NULL),
(170, 45, 'App\\Models\\MenuItem', 29, 1, '137405.00', NULL, NULL, NULL),
(171, 45, 'App\\Models\\MenuItem', 15, 2, '63680.00', NULL, NULL, NULL),
(172, 46, 'App\\Models\\MenuItem', 16, 1, '283975.00', NULL, NULL, NULL),
(173, 46, 'App\\Models\\MenuItem', 30, 1, '56402.00', NULL, NULL, NULL),
(174, 46, 'App\\Models\\MenuItem', 37, 2, '393258.00', NULL, NULL, NULL),
(175, 47, 'App\\Models\\MenuItem', 4, 1, '345817.00', NULL, NULL, NULL),
(176, 47, 'App\\Models\\MenuItem', 8, 1, '147583.00', NULL, NULL, NULL),
(177, 48, 'App\\Models\\MenuItem', 12, 1, '191326.00', NULL, NULL, NULL),
(178, 48, 'App\\Models\\MenuItem', 15, 2, '63680.00', NULL, NULL, NULL),
(179, 48, 'App\\Models\\MenuItem', 18, 2, '208533.00', NULL, NULL, NULL),
(180, 48, 'App\\Models\\MenuItem', 29, 3, '137405.00', NULL, NULL, NULL),
(181, 49, 'App\\Models\\MenuItem', 32, 2, '114290.00', NULL, NULL, NULL),
(182, 49, 'App\\Models\\MenuItem', 12, 1, '191326.00', NULL, NULL, NULL),
(183, 49, 'App\\Models\\MenuItem', 9, 2, '292141.00', NULL, NULL, NULL),
(184, 50, 'App\\Models\\MenuItem', 45, 3, '74216.00', NULL, NULL, NULL),
(185, 50, 'App\\Models\\MenuItem', 43, 1, '253950.00', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `otp_codes`
--

CREATE TABLE `otp_codes` (
  `id` bigint UNSIGNED NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint UNSIGNED NOT NULL,
  `order_id` bigint UNSIGNED NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` enum('VNPAY','MoMo','BankTransfer','Cash') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','paid','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `transaction_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `amount`, `method`, `status`, `paid_at`, `transaction_code`, `created_at`, `updated_at`) VALUES
(1, 1, '794626.00', 'Cash', 'paid', '2025-09-11 05:42:44', NULL, '2025-10-10 05:42:44', '2025-10-10 05:42:44'),
(2, 2, '1143641.00', 'Cash', 'paid', '2025-09-17 05:42:44', NULL, '2025-10-10 05:42:45', '2025-10-10 05:42:45'),
(3, 3, '368660.00', 'Cash', 'paid', '2025-10-09 05:42:45', NULL, '2025-10-10 05:42:45', '2025-10-10 05:42:45'),
(4, 4, '1442448.00', 'Cash', 'paid', '2025-10-03 05:42:45', NULL, '2025-10-10 05:42:45', '2025-10-10 05:42:45'),
(5, 5, '3548594.00', 'Cash', 'paid', '2025-10-08 05:42:45', NULL, '2025-10-10 05:42:45', '2025-10-10 05:42:45'),
(6, 6, '953906.00', 'Cash', 'paid', '2025-10-04 05:42:45', NULL, '2025-10-10 05:42:45', '2025-10-10 05:42:45'),
(7, 7, '3176820.00', 'Cash', 'paid', '2025-09-18 05:42:45', NULL, '2025-10-10 05:42:45', '2025-10-10 05:42:45'),
(8, 8, '1922073.00', 'Cash', 'paid', '2025-09-25 05:42:45', NULL, '2025-10-10 05:42:46', '2025-10-10 05:42:46'),
(9, 9, '1711486.00', 'Cash', 'paid', '2025-10-10 05:42:46', NULL, '2025-10-10 05:42:46', '2025-10-10 05:42:46'),
(10, 10, '778200.00', 'Cash', 'paid', '2025-09-20 05:42:46', NULL, '2025-10-10 05:42:46', '2025-10-10 05:42:46'),
(11, 11, '1346321.00', 'Cash', 'paid', '2025-10-09 05:42:46', NULL, '2025-10-10 05:42:46', '2025-10-10 05:42:46'),
(12, 12, '4212198.00', 'Cash', 'paid', '2025-09-15 05:42:46', NULL, '2025-10-10 05:42:46', '2025-10-10 05:42:46'),
(13, 13, '2852162.00', 'Cash', 'paid', '2025-09-11 05:42:46', NULL, '2025-10-10 05:42:46', '2025-10-10 05:42:46'),
(14, 14, '1843695.00', 'Cash', 'paid', '2025-10-10 05:42:46', NULL, '2025-10-10 05:42:46', '2025-10-10 05:42:46'),
(15, 15, '1623687.00', 'Cash', 'paid', '2025-09-10 05:42:46', NULL, '2025-10-10 05:42:47', '2025-10-10 05:42:47'),
(16, 16, '576848.00', 'Cash', 'paid', '2025-09-27 05:42:47', NULL, '2025-10-10 05:42:47', '2025-10-10 05:42:47'),
(17, 17, '1400544.00', 'Cash', 'paid', '2025-10-02 05:42:47', NULL, '2025-10-10 05:42:47', '2025-10-10 05:42:47'),
(18, 18, '3660722.00', 'Cash', 'paid', '2025-09-30 05:42:47', NULL, '2025-10-10 05:42:47', '2025-10-10 05:42:47'),
(19, 19, '1937200.00', 'Cash', 'paid', '2025-09-24 05:42:47', NULL, '2025-10-10 05:42:47', '2025-10-10 05:42:47'),
(20, 20, '698940.00', 'Cash', 'paid', '2025-09-12 05:42:47', NULL, '2025-10-10 05:42:47', '2025-10-10 05:42:47'),
(21, 21, '1945343.00', 'Cash', 'paid', '2025-09-27 05:42:47', NULL, '2025-10-10 05:42:47', '2025-10-10 05:42:47'),
(22, 22, '1121181.00', 'Cash', 'paid', '2025-09-21 05:42:47', NULL, '2025-10-10 05:42:48', '2025-10-10 05:42:48'),
(23, 23, '1696923.00', 'Cash', 'paid', '2025-09-21 05:42:48', NULL, '2025-10-10 05:42:48', '2025-10-10 05:42:48'),
(24, 24, '1572715.00', 'Cash', 'paid', '2025-09-24 05:42:48', NULL, '2025-10-10 05:42:48', '2025-10-10 05:42:48'),
(25, 25, '2323337.00', 'Cash', 'paid', '2025-10-03 05:42:48', NULL, '2025-10-10 05:42:48', '2025-10-10 05:42:48'),
(26, 26, '915784.00', 'Cash', 'paid', '2025-09-11 05:42:48', NULL, '2025-10-10 05:42:48', '2025-10-10 05:42:48'),
(27, 27, '2661759.00', 'Cash', 'paid', '2025-09-18 05:42:48', NULL, '2025-10-10 05:42:48', '2025-10-10 05:42:48'),
(28, 28, '1059441.00', 'Cash', 'paid', '2025-10-02 05:42:48', NULL, '2025-10-10 05:42:48', '2025-10-10 05:42:48'),
(29, 29, '1511959.00', 'Cash', 'paid', '2025-09-19 05:42:48', NULL, '2025-10-10 05:42:48', '2025-10-10 05:42:48'),
(30, 30, '2960310.00', 'Cash', 'paid', '2025-09-26 05:42:49', NULL, '2025-10-10 05:42:49', '2025-10-10 05:42:49'),
(31, 31, '1185513.00', 'Cash', 'paid', '2025-09-23 05:42:49', NULL, '2025-10-10 05:42:49', '2025-10-10 05:42:49'),
(32, 32, '1188201.00', 'Cash', 'paid', '2025-09-15 05:42:49', NULL, '2025-10-10 05:42:49', '2025-10-10 05:42:49'),
(33, 33, '430798.00', 'Cash', 'paid', '2025-09-17 05:42:49', NULL, '2025-10-10 05:42:49', '2025-10-10 05:42:49'),
(34, 34, '1971156.00', 'Cash', 'paid', '2025-09-22 05:42:49', NULL, '2025-10-10 05:42:49', '2025-10-10 05:42:49'),
(35, 35, '2476114.00', 'Cash', 'paid', '2025-10-02 05:42:49', NULL, '2025-10-10 05:42:49', '2025-10-10 05:42:49'),
(36, 36, '2359087.00', 'Cash', 'paid', '2025-10-03 05:42:49', NULL, '2025-10-10 05:42:49', '2025-10-10 05:42:49'),
(37, 37, '575429.00', 'Cash', 'paid', '2025-09-27 05:42:50', NULL, '2025-10-10 05:42:50', '2025-10-10 05:42:50'),
(38, 38, '1341763.00', 'Cash', 'paid', '2025-09-10 05:42:50', NULL, '2025-10-10 05:42:50', '2025-10-10 05:42:50'),
(39, 39, '1273696.00', 'Cash', 'paid', '2025-09-25 05:42:50', NULL, '2025-10-10 05:42:50', '2025-10-10 05:42:50'),
(40, 40, '2222671.00', 'Cash', 'paid', '2025-10-02 05:42:50', NULL, '2025-10-10 05:42:50', '2025-10-10 05:42:50'),
(41, 41, '2500131.00', 'Cash', 'paid', '2025-09-18 05:42:50', NULL, '2025-10-10 05:42:50', '2025-10-10 05:42:50'),
(42, 42, '2514623.00', 'Cash', 'paid', '2025-09-21 05:42:50', NULL, '2025-10-10 05:42:50', '2025-10-10 05:42:50'),
(43, 43, '1319831.00', 'Cash', 'paid', '2025-10-04 05:42:50', NULL, '2025-10-10 05:42:50', '2025-10-10 05:42:50'),
(44, 44, '1147210.00', 'Cash', 'paid', '2025-09-16 05:42:51', NULL, '2025-10-10 05:42:51', '2025-10-10 05:42:51'),
(45, 45, '1654704.00', 'Cash', 'paid', '2025-09-25 05:42:51', NULL, '2025-10-10 05:42:51', '2025-10-10 05:42:51'),
(46, 46, '1126893.00', 'Cash', 'paid', '2025-10-01 05:42:51', NULL, '2025-10-10 05:42:51', '2025-10-10 05:42:51'),
(47, 47, '493400.00', 'Cash', 'paid', '2025-09-23 05:42:51', NULL, '2025-10-10 05:42:51', '2025-10-10 05:42:51'),
(48, 48, '1147967.00', 'Cash', 'paid', '2025-10-01 05:42:51', NULL, '2025-10-10 05:42:51', '2025-10-10 05:42:51'),
(49, 49, '1004188.00', 'Cash', 'paid', '2025-10-09 05:42:51', NULL, '2025-10-10 05:42:51', '2025-10-10 05:42:51'),
(50, 50, '476598.00', 'Cash', 'paid', '2025-10-01 05:42:51', NULL, '2025-10-10 05:42:51', '2025-10-10 05:42:51');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(2, 'App\\Models\\User', 33, 'auth-token', '1d2550e1ca89a35da5093444981027545e36c40a1ede3e73a750ebf20e562e56', '[\"*\"]', '2025-10-10 06:36:11', NULL, '2025-10-10 06:35:28', '2025-10-10 06:36:11'),
(3, 'App\\Models\\User', 34, 'auth-token', 'f60cc473c06998f06046309841e49bd491bcb8c88cc20fb925c83be6c1967e57', '[\"*\"]', NULL, NULL, '2025-10-10 06:40:34', '2025-10-10 06:40:34'),
(4, 'App\\Models\\User', 35, 'auth-token', 'ec49a522b0fb14b90cd21229722f212e2575cb25bc5cfe1dca8b82a5a11782f3', '[\"*\"]', '2025-10-10 07:05:50', NULL, '2025-10-10 07:05:35', '2025-10-10 07:05:50');

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `id` bigint UNSIGNED NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `type` enum('percentage','fixed_amount') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'percentage',
  `value` decimal(12,2) NOT NULL,
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'owner', 'Chủ nhà hàng, có toàn quyền.', '2025-10-10 05:42:33', '2025-10-10 05:42:33'),
(2, 'manager', 'Quản lý chi nhánh.', '2025-10-10 05:42:33', '2025-10-10 05:42:33'),
(3, 'employee', 'Nhân viên (lễ tân, phục vụ...).', '2025-10-10 05:42:34', '2025-10-10 05:42:34'),
(4, 'customer', 'Khách hàng.', '2025-10-10 05:42:34', '2025-10-10 05:42:34');

-- --------------------------------------------------------

--
-- Table structure for table `role_user`
--

CREATE TABLE `role_user` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_user`
--

INSERT INTO `role_user` (`id`, `user_id`, `role_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, NULL),
(2, 2, 2, NULL, NULL),
(3, 3, 3, NULL, NULL),
(4, 4, 3, NULL, NULL),
(5, 5, 3, NULL, NULL),
(6, 6, 3, NULL, NULL),
(7, 7, 3, NULL, NULL),
(8, 8, 3, NULL, NULL),
(9, 9, 3, NULL, NULL),
(10, 10, 3, NULL, NULL),
(11, 11, 3, NULL, NULL),
(12, 12, 3, NULL, NULL),
(13, 13, 4, NULL, NULL),
(14, 14, 4, NULL, NULL),
(15, 15, 4, NULL, NULL),
(16, 16, 4, NULL, NULL),
(17, 17, 4, NULL, NULL),
(18, 18, 4, NULL, NULL),
(19, 19, 4, NULL, NULL),
(20, 20, 4, NULL, NULL),
(21, 21, 4, NULL, NULL),
(22, 22, 4, NULL, NULL),
(23, 23, 4, NULL, NULL),
(24, 24, 4, NULL, NULL),
(25, 25, 4, NULL, NULL),
(26, 26, 4, NULL, NULL),
(27, 27, 4, NULL, NULL),
(28, 28, 4, NULL, NULL),
(29, 29, 4, NULL, NULL),
(30, 30, 4, NULL, NULL),
(31, 31, 4, NULL, NULL),
(32, 32, 4, NULL, NULL),
(33, 33, 4, NULL, NULL),
(34, 34, 4, NULL, NULL),
(35, 35, 4, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('Xul83JiV88gWmC4odEmI03kN7JDP3LVtAcpxgzOC', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiTUxOS1VFdUZBS0NqWWxlc3haN1gxb2RhUVRKdTBBaENVeVMxNmhXUiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1760103339);

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_person` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `id` bigint UNSIGNED NOT NULL,
  `table_area_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seats` int NOT NULL,
  `status` enum('available','occupied','reserved','cleaning') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `position_x` int NOT NULL DEFAULT '0',
  `position_y` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tables`
--

INSERT INTO `tables` (`id`, `table_area_id`, `name`, `seats`, `status`, `position_x`, `position_y`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'Bàn 1-1', 7, 'available', 336, 240, '2025-10-10 05:42:34', '2025-10-10 05:42:34', NULL),
(2, 1, 'Bàn 1-2', 3, 'available', 353, 21, '2025-10-10 05:42:34', '2025-10-10 05:42:34', NULL),
(3, 1, 'Bàn 1-3', 7, 'available', 161, 190, '2025-10-10 05:42:34', '2025-10-10 05:42:34', NULL),
(4, 1, 'Bàn 1-4', 3, 'available', 339, 245, '2025-10-10 05:42:34', '2025-10-10 05:42:34', NULL),
(5, 1, 'Bàn 1-5', 8, 'available', 191, 119, '2025-10-10 05:42:34', '2025-10-10 05:42:34', NULL),
(6, 1, 'Bàn 1-6', 7, 'available', 223, 60, '2025-10-10 05:42:34', '2025-10-10 05:42:34', NULL),
(7, 1, 'Bàn 1-7', 6, 'available', 459, 31, '2025-10-10 05:42:34', '2025-10-10 05:42:34', NULL),
(8, 1, 'Bàn 1-8', 3, 'available', 464, 136, '2025-10-10 05:42:35', '2025-10-10 05:42:35', NULL),
(9, 1, 'Bàn 1-9', 4, 'available', 157, 171, '2025-10-10 05:42:35', '2025-10-10 05:42:35', NULL),
(10, 1, 'Bàn 1-10', 6, 'available', 178, 232, '2025-10-10 05:42:35', '2025-10-10 05:42:35', NULL),
(11, 2, 'Bàn 2-1', 8, 'available', 19, 278, '2025-10-10 05:42:35', '2025-10-10 05:42:35', NULL),
(12, 2, 'Bàn 2-2', 2, 'available', 171, 144, '2025-10-10 05:42:35', '2025-10-10 05:42:35', NULL),
(13, 2, 'Bàn 2-3', 3, 'available', 213, 300, '2025-10-10 05:42:35', '2025-10-10 05:42:35', NULL),
(14, 2, 'Bàn 2-4', 5, 'available', 449, 137, '2025-10-10 05:42:35', '2025-10-10 05:42:35', NULL),
(15, 2, 'Bàn 2-5', 3, 'available', 212, 219, '2025-10-10 05:42:35', '2025-10-10 05:42:35', NULL),
(16, 2, 'Bàn 2-6', 3, 'available', 325, 266, '2025-10-10 05:42:35', '2025-10-10 05:42:35', NULL),
(17, 2, 'Bàn 2-7', 8, 'available', 312, 42, '2025-10-10 05:42:35', '2025-10-10 05:42:35', NULL),
(18, 2, 'Bàn 2-8', 6, 'available', 455, 136, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(19, 2, 'Bàn 2-9', 6, 'available', 439, 128, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(20, 2, 'Bàn 2-10', 2, 'available', 76, 155, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(21, 3, 'Bàn 3-1', 3, 'available', 207, 67, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(22, 3, 'Bàn 3-2', 5, 'available', 448, 98, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(23, 3, 'Bàn 3-3', 6, 'available', 51, 238, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(24, 3, 'Bàn 3-4', 4, 'available', 64, 131, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(25, 3, 'Bàn 3-5', 4, 'available', 184, 25, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(26, 3, 'Bàn 3-6', 4, 'available', 140, 204, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(27, 3, 'Bàn 3-7', 8, 'available', 414, 254, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(28, 3, 'Bàn 3-8', 4, 'available', 52, 251, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(29, 3, 'Bàn 3-9', 8, 'available', 87, 200, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(30, 3, 'Bàn 3-10', 6, 'available', 51, 28, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(31, 4, 'Bàn 4-1', 6, 'available', 210, 78, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(32, 4, 'Bàn 4-2', 7, 'available', 257, 31, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(33, 4, 'Bàn 4-3', 5, 'available', 315, 268, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(34, 4, 'Bàn 4-4', 8, 'available', 476, 76, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(35, 4, 'Bàn 4-5', 7, 'available', 322, 46, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(36, 4, 'Bàn 4-6', 6, 'available', 476, 291, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(37, 4, 'Bàn 4-7', 3, 'available', 275, 14, '2025-10-10 05:42:36', '2025-10-10 05:42:36', NULL),
(38, 4, 'Bàn 4-8', 8, 'available', 194, 170, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(39, 4, 'Bàn 4-9', 7, 'available', 282, 243, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(40, 4, 'Bàn 4-10', 7, 'available', 403, 43, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(41, 5, 'Bàn 5-1', 6, 'available', 161, 77, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(42, 5, 'Bàn 5-2', 4, 'available', 18, 254, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(43, 5, 'Bàn 5-3', 5, 'available', 369, 186, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(44, 5, 'Bàn 5-4', 2, 'available', 275, 176, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(45, 5, 'Bàn 5-5', 4, 'available', 205, 112, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(46, 5, 'Bàn 5-6', 7, 'available', 398, 46, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(47, 5, 'Bàn 5-7', 8, 'available', 238, 86, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(48, 5, 'Bàn 5-8', 6, 'available', 409, 200, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(49, 5, 'Bàn 5-9', 3, 'available', 73, 208, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(50, 5, 'Bàn 5-10', 3, 'available', 450, 203, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(51, 6, 'Bàn 6-1', 4, 'available', 188, 250, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(52, 6, 'Bàn 6-2', 6, 'available', 492, 263, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(53, 6, 'Bàn 6-3', 3, 'available', 375, 55, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(54, 6, 'Bàn 6-4', 2, 'available', 282, 50, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(55, 6, 'Bàn 6-5', 3, 'available', 111, 68, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(56, 6, 'Bàn 6-6', 7, 'available', 137, 121, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(57, 6, 'Bàn 6-7', 2, 'available', 488, 233, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(58, 6, 'Bàn 6-8', 8, 'available', 265, 205, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(59, 6, 'Bàn 6-9', 2, 'available', 163, 180, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(60, 6, 'Bàn 6-10', 7, 'available', 142, 148, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `table_areas`
--

CREATE TABLE `table_areas` (
  `id` bigint UNSIGNED NOT NULL,
  `branch_id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `table_areas`
--

INSERT INTO `table_areas` (`id`, `branch_id`, `name`, `created_at`, `updated_at`) VALUES
(1, 1, 'Tầng 1', '2025-10-10 05:42:34', '2025-10-10 05:42:34'),
(2, 1, 'Tầng 2', '2025-10-10 05:42:35', '2025-10-10 05:42:35'),
(3, 1, 'Sân vườn', '2025-10-10 05:42:36', '2025-10-10 05:42:36'),
(4, 2, 'Tầng 1', '2025-10-10 05:42:36', '2025-10-10 05:42:36'),
(5, 2, 'Tầng 2', '2025-10-10 05:42:37', '2025-10-10 05:42:37'),
(6, 2, 'Sân vườn', '2025-10-10 05:42:37', '2025-10-10 05:42:37');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'google, facebook',
  `provider_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `email_verified_at`, `password`, `avatar`, `provider_name`, `provider_id`, `remember_token`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 'TableGo Owner', 'owner@tablego.com', NULL, NULL, '$2y$12$MDBfgEk5Y.QzYylEQx3BOe7LaREh6dv2oUtEdpufgGmby5bxMckde', NULL, NULL, NULL, NULL, '2025-10-10 05:42:37', '2025-10-10 05:42:37', NULL),
(2, 'Manager Branch 1', 'manager1@tablego.com', NULL, NULL, '$2y$12$d9jfeYcBlWbrFwRs2/nw8.1nvUt4HBx.TPjLdAWCMSsj5/3gwxV/G', NULL, NULL, NULL, NULL, '2025-10-10 05:42:38', '2025-10-10 05:42:38', NULL),
(3, 'Employee 1', 'employee1@tablego.com', NULL, NULL, '$2y$12$4BnjrRW1uIDB8zVThIW1B.Yr5qN9pjXRCS0xTDvQJJSMUjAx/lwLq', NULL, NULL, NULL, NULL, '2025-10-10 05:42:38', '2025-10-10 05:42:38', NULL),
(4, 'Employee 2', 'employee2@tablego.com', NULL, NULL, '$2y$12$SH5PUMikNvnSGnmLh4QmsuYPXpkM0bAKrnR8NXwQEjWYyrZYW5dUG', NULL, NULL, NULL, NULL, '2025-10-10 05:42:38', '2025-10-10 05:42:38', NULL),
(5, 'Employee 3', 'employee3@tablego.com', NULL, NULL, '$2y$12$6oYgKtkB4jKOJk2zNI4w9O.1C2ysMSIydtprtYoaqJG3gM10NVeN.', NULL, NULL, NULL, NULL, '2025-10-10 05:42:39', '2025-10-10 05:42:39', NULL),
(6, 'Employee 4', 'employee4@tablego.com', NULL, NULL, '$2y$12$c/BmElZ269xp5p3iaNNase3bcEkgZ2qGuOQ.UdntwDQ9eT9FP4WmG', NULL, NULL, NULL, NULL, '2025-10-10 05:42:39', '2025-10-10 05:42:39', NULL),
(7, 'Employee 5', 'employee5@tablego.com', NULL, NULL, '$2y$12$uh7bobXDANb31Buxb9AFHOBXlHXJOfC2d4tQzlvxxXeppVZOodOAm', NULL, NULL, NULL, NULL, '2025-10-10 05:42:39', '2025-10-10 05:42:39', NULL),
(8, 'Employee 6', 'employee6@tablego.com', NULL, NULL, '$2y$12$GA1PzeyXbhJYnP7Y3.iqRuyzryB0hqEpHyNsXwmnFSe3Fg5rcVK.e', NULL, NULL, NULL, NULL, '2025-10-10 05:42:40', '2025-10-10 05:42:40', NULL),
(9, 'Employee 7', 'employee7@tablego.com', NULL, NULL, '$2y$12$QMylhcf1cU8tXEUjre91RO2tS2DPHldqCQflr6dNJcUyrPXUjPpvS', NULL, NULL, NULL, NULL, '2025-10-10 05:42:40', '2025-10-10 05:42:40', NULL),
(10, 'Employee 8', 'employee8@tablego.com', NULL, NULL, '$2y$12$NJCQzFrfI3j3edvl1Sg8WefIvthwHrQ942scX9Vh/UQB73cVe06we', NULL, NULL, NULL, NULL, '2025-10-10 05:42:40', '2025-10-10 05:42:40', NULL),
(11, 'Employee 9', 'employee9@tablego.com', NULL, NULL, '$2y$12$mKYxCK5JfK7muxJuADCwcuKsazOYkValnyMgxAMa.VGg3SsRBl4Ta', NULL, NULL, NULL, NULL, '2025-10-10 05:42:41', '2025-10-10 05:42:41', NULL),
(12, 'Employee 10', 'employee10@tablego.com', NULL, NULL, '$2y$12$QqD93U4jfwlxOd6H8vEa0O3rO6UIhcTgW628QAu9n5CwzNhjvZCAe', NULL, NULL, NULL, NULL, '2025-10-10 05:42:41', '2025-10-10 05:42:41', NULL),
(13, 'Kathryn Crooks', 'francesca.reilly@example.net', '442.289.5650', '2025-10-10 05:42:41', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'CZigTTuuE7', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(14, 'Wanda Moen', 'crona.edmond@example.org', '1-970-339-1051', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'g2tfTeloPT', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(15, 'Dr. River Sipes I', 'cstehr@example.com', '(931) 630-4789', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'ACMYmskjiY', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(16, 'Ivy Gleason', 'josh89@example.org', '(520) 565-5477', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'WeG6yvh8J0', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(17, 'Adella Bernier Sr.', 'eleazar.cremin@example.com', '858.686.2261', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'qrLFyMowY6', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(18, 'Eleanore Nitzsche', 'vidal.schaefer@example.org', '+1-989-397-7983', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'aP6pVvMxDa', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(19, 'Dr. Georgianna Dooley', 'rafaela24@example.net', '+1-567-870-1555', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'WQNF7zlGRr', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(20, 'Baylee Willms', 'yemard@example.org', '575.408.8205', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'iLnnWq2Igr', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(21, 'Giovanny Franecki', 'qroberts@example.com', '+1 (808) 413-6559', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'ky2AIzKCtU', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(22, 'Adell Mertz', 'tiara.wolff@example.net', '352.558.3701', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'i7SMXcZjd4', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(23, 'Iliana Reichert IV', 'dooley.drake@example.com', '223.375.2899', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'XjGIYg0BQA', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(24, 'Sister Turcotte', 'rhessel@example.com', '+1.205.852.8859', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'mydCUVsdpP', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(25, 'Prof. Meggie Treutel MD', 'von.christine@example.org', '651.953.2598', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'FoseTTDZJS', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(26, 'Samson Rodriguez', 'rosalinda.lemke@example.net', '+1.223.346.7645', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'oBN2nH1eoQ', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(27, 'Mr. Seth Spencer', 'oschimmel@example.net', '669-284-3778', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'bGKUxcI1Jq', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(28, 'Leonel Langworth', 'abbey.hermann@example.com', '+1 (646) 813-0045', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, '1wawT4NujF', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(29, 'Bridget Hills', 'alysa11@example.com', '(872) 419-5116', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'O6SHq2BFEQ', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(30, 'Pink Runte', 'sabina78@example.net', '818-203-8430', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'bQqJWKkAOz', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(31, 'Miss Leatha Nicolas Jr.', 'jaunita61@example.net', '(726) 761-4175', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, '7KPGSH4VNh', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(32, 'Shyanne Schowalter', 'zhessel@example.com', '(479) 476-9986', '2025-10-10 05:42:42', '$2y$12$j6apf14d.fpVSUasCAhdJuvhEmqw/I8b5QLZExXRehWnLYMzZ7H72', NULL, NULL, NULL, 'uLi7S0I2aD', '2025-10-10 05:42:42', '2025-10-10 05:42:42', NULL),
(33, 'Ông Chủ', 'owner@tablego1.com', '0912345678', NULL, '$2y$12$Rm8loh8/z/gl8JEUQZMD7.tuqQB5aXVK.th80wt2QEUa9Sc1kjEDa', NULL, NULL, NULL, NULL, '2025-10-10 06:31:25', '2025-10-10 06:31:25', NULL),
(34, 'Ông Chủ2', 'owner@tablego21.com', '0325374482', NULL, '$2y$12$urswS7eP0nAnBqKjv8gD/ODoLskR9wn7G1xnHr66qnvtVJXTMETc6', NULL, NULL, NULL, NULL, '2025-10-10 06:40:34', '2025-10-10 06:40:34', NULL),
(35, 'Ông Chủ3', 'owner@tablego212.com', '0976506203', NULL, '$2y$12$6XJNgUhBOYUZdyn5v3QE3.omji12itfJn0HiULKaAc5SwVUsSZhSW', NULL, NULL, NULL, NULL, '2025-10-10 07:05:34', '2025-10-10 07:05:34', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bookings_user_id_foreign` (`user_id`),
  ADD KEY `bookings_table_id_foreign` (`table_id`),
  ADD KEY `bookings_branch_id_foreign` (`branch_id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `combos`
--
ALTER TABLE `combos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `combo_menu_item`
--
ALTER TABLE `combo_menu_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `combo_menu_item_combo_id_foreign` (`combo_id`),
  ADD KEY `combo_menu_item_menu_item_id_foreign` (`menu_item_id`);

--
-- Indexes for table `employee_profiles`
--
ALTER TABLE `employee_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employee_profiles_user_id_unique` (`user_id`),
  ADD UNIQUE KEY `employee_profiles_employee_code_unique` (`employee_code`),
  ADD KEY `employee_profiles_branch_id_foreign` (`branch_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `feedbacks_user_id_foreign` (`user_id`),
  ADD KEY `feedbacks_order_id_foreign` (`order_id`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menu_categories`
--
ALTER TABLE `menu_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `menu_categories_name_unique` (`name`);

--
-- Indexes for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menu_items_category_id_foreign` (`category_id`);

--
-- Indexes for table `menu_item_ingredient`
--
ALTER TABLE `menu_item_ingredient`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menu_item_ingredient_menu_item_id_foreign` (`menu_item_id`),
  ADD KEY `menu_item_ingredient_ingredient_id_foreign` (`ingredient_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_user_id_foreign` (`user_id`),
  ADD KEY `orders_branch_id_foreign` (`branch_id`),
  ADD KEY `orders_table_id_foreign` (`table_id`),
  ADD KEY `orders_booking_id_foreign` (`booking_id`),
  ADD KEY `orders_employee_id_foreign` (`employee_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_orderable_type_orderable_id_index` (`orderable_type`,`orderable_id`);

--
-- Indexes for table `otp_codes`
--
ALTER TABLE `otp_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `otp_codes_phone_index` (`phone`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_order_id_foreign` (`order_id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `promotions_code_unique` (`code`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_unique` (`name`);

--
-- Indexes for table `role_user`
--
ALTER TABLE `role_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_user_user_id_foreign` (`user_id`),
  ADD KEY `role_user_role_id_foreign` (`role_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tables_table_area_id_foreign` (`table_area_id`);

--
-- Indexes for table `table_areas`
--
ALTER TABLE `table_areas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `table_areas_branch_id_foreign` (`branch_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_phone_unique` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `combos`
--
ALTER TABLE `combos`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `combo_menu_item`
--
ALTER TABLE `combo_menu_item`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `employee_profiles`
--
ALTER TABLE `employee_profiles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `menu_categories`
--
ALTER TABLE `menu_categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `menu_items`
--
ALTER TABLE `menu_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `menu_item_ingredient`
--
ALTER TABLE `menu_item_ingredient`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=186;

--
-- AUTO_INCREMENT for table `otp_codes`
--
ALTER TABLE `otp_codes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `role_user`
--
ALTER TABLE `role_user`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `table_areas`
--
ALTER TABLE `table_areas`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_table_id_foreign` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `combo_menu_item`
--
ALTER TABLE `combo_menu_item`
  ADD CONSTRAINT `combo_menu_item_combo_id_foreign` FOREIGN KEY (`combo_id`) REFERENCES `combos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `combo_menu_item_menu_item_id_foreign` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_profiles`
--
ALTER TABLE `employee_profiles`
  ADD CONSTRAINT `employee_profiles_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `feedbacks_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `menu_items`
--
ALTER TABLE `menu_items`
  ADD CONSTRAINT `menu_items_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `menu_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `menu_item_ingredient`
--
ALTER TABLE `menu_item_ingredient`
  ADD CONSTRAINT `menu_item_ingredient_ingredient_id_foreign` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `menu_item_ingredient_menu_item_id_foreign` FOREIGN KEY (`menu_item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  ADD CONSTRAINT `orders_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  ADD CONSTRAINT `orders_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_table_id_foreign` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`),
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_user`
--
ALTER TABLE `role_user`
  ADD CONSTRAINT `role_user_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tables`
--
ALTER TABLE `tables`
  ADD CONSTRAINT `tables_table_area_id_foreign` FOREIGN KEY (`table_area_id`) REFERENCES `table_areas` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `table_areas`
--
ALTER TABLE `table_areas`
  ADD CONSTRAINT `table_areas_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
