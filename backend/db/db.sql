-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 27, 2025 at 03:18 PM
-- Server version: 8.0.30
-- PHP Version: 8.2.29

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
  `booking_time` datetime NOT NULL,
  `people_count` int NOT NULL,
  `status` enum('pending','confirmed','cancelled','completed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `special_request` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `table_id`, `booking_time`, `people_count`, `status`, `special_request`, `created_at`, `updated_at`) VALUES
(1, 1, 2, '2025-11-14 15:23:42', 5, 'pending', NULL, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(2, 2, 14, '2025-11-10 15:23:42', 1, 'pending', NULL, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(3, 3, 19, '2025-11-08 15:23:42', 5, 'pending', NULL, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(4, 4, 7, '2025-10-23 15:23:42', 2, 'pending', NULL, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(5, 5, 12, '2025-11-14 15:23:42', 3, 'pending', NULL, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(6, 6, 19, '2025-10-25 15:23:42', 4, 'pending', NULL, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(7, 7, 9, '2025-11-10 15:23:42', 3, 'pending', NULL, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(8, 8, 14, '2025-10-22 15:23:42', 6, 'pending', NULL, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(9, 9, 18, '2025-10-21 15:23:42', 6, 'pending', NULL, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(10, 10, 6, '2025-11-08 15:23:42', 5, 'pending', NULL, '2025-10-16 08:23:42', '2025-10-16 08:23:42');

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `address`, `phone`, `email`, `created_at`, `updated_at`) VALUES
(1, 'Branch 1', '123 Street 1', '0991', 'branch1@example.com', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(2, 'Branch 2', '123 Street 2', '0992', 'branch2@example.com', '2025-10-16 08:23:42', '2025-10-16 08:23:42');

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
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Món khai vị', 'Các món ăn nhẹ trước bữa chính', '2025-10-22 21:10:32', '2025-10-22 21:10:32');

-- --------------------------------------------------------

--
-- Table structure for table `combos`
--

CREATE TABLE `combos` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(12,2) NOT NULL,
  `menu_ids` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `combos`
--

INSERT INTO `combos` (`id`, `name`, `description`, `price`, `menu_ids`, `created_at`, `updated_at`) VALUES
(1, 'Combo 1', 'Combo includes menus: 1,2,3,4', '421.00', '[1, 2, 3, 4]', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(2, 'Combo 2', 'Combo includes menus: 5,6,7,8', '255.00', '[5, 6, 7, 8]', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(3, 'Combo 3', 'Combo includes menus: 9,10,11,12', '241.00', '[9, 10, 11, 12]', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(4, 'Combo 4', 'Combo includes menus: 13,14,15,16', '551.00', '[13, 14, 15, 16]', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(5, 'Combo 5', 'Combo includes menus: 17,18,19,20', '770.00', '[17, 18, 19, 20]', '2025-10-16 08:23:42', '2025-10-16 08:23:42');

-- --------------------------------------------------------

--
-- Table structure for table `configurations`
--

CREATE TABLE `configurations` (
  `id` bigint UNSIGNED NOT NULL,
  `restaurant_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'TableGo',
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `open_time` time NOT NULL DEFAULT '08:00:00',
  `close_time` time NOT NULL DEFAULT '22:00:00',
  `max_people_per_table` int NOT NULL DEFAULT '6',
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` enum('Receptionist','Waiter','Kitchen','Cashier') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `branch_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `name`, `email`, `phone`, `position`, `status`, `branch_id`, `created_at`, `updated_at`) VALUES
(1, 'Employee 1 Branch 1', 'employee1_branch1@example.com', '09311', 'Cashier', 'active', 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(2, 'Employee 2 Branch 1', 'employee2_branch1@example.com', '09321', 'Receptionist', 'active', 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(3, 'Employee 3 Branch 1', 'employee3_branch1@example.com', '09331', 'Cashier', 'active', 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(4, 'Employee 4 Branch 1', 'employee4_branch1@example.com', '09341', 'Cashier', 'active', 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(5, 'Employee 5 Branch 1', 'employee5_branch1@example.com', '09351', 'Receptionist', 'active', 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(6, 'Employee 1 Branch 2', 'employee1_branch2@example.com', '09312', 'Receptionist', 'active', 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(7, 'Employee 2 Branch 2', 'employee2_branch2@example.com', '09322', 'Receptionist', 'active', 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(8, 'Employee 3 Branch 2', 'employee3_branch2@example.com', '09332', 'Waiter', 'active', 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(9, 'Employee 4 Branch 2', 'employee4_branch2@example.com', '09342', 'Waiter', 'active', 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(10, 'Employee 5 Branch 2', 'employee5_branch2@example.com', '09352', 'Receptionist', 'active', 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42');

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` bigint UNSIGNED NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `date` date NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `branch_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `order_id` bigint UNSIGNED DEFAULT NULL,
  `rating` tinyint NOT NULL DEFAULT '5',
  `comment` text COLLATE utf8mb4_unicode_ci,
  `type` enum('food','service') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'food',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `user_id`, `order_id`, `rating`, `comment`, `type`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 5, 'Feedback for order 0', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(2, 1, 2, 3, 'Feedback for order 1', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(3, 2, 3, 5, 'Feedback for order 2', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(4, 2, 4, 4, 'Feedback for order 3', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(5, 3, 5, 3, 'Feedback for order 4', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(6, 3, 6, 5, 'Feedback for order 5', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(7, 4, 7, 3, 'Feedback for order 6', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(8, 4, 8, 4, 'Feedback for order 7', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(9, 5, 9, 5, 'Feedback for order 8', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(10, 5, 10, 4, 'Feedback for order 9', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(11, 6, 11, 5, 'Feedback for order 10', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(12, 6, 12, 4, 'Feedback for order 11', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(13, 7, 13, 4, 'Feedback for order 12', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(14, 7, 14, 5, 'Feedback for order 13', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(15, 8, 15, 5, 'Feedback for order 14', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(16, 8, 16, 3, 'Feedback for order 15', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(17, 9, 17, 3, 'Feedback for order 16', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(18, 9, 18, 3, 'Feedback for order 17', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(19, 10, 19, 3, 'Feedback for order 18', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(20, 10, 20, 4, 'Feedback for order 19', 'food', '2025-10-16 08:23:42', '2025-10-16 08:23:42');

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `unit` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'kg',
  `branch_id` bigint UNSIGNED NOT NULL,
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
-- Table structure for table `loyalty_cards`
--

CREATE TABLE `loyalty_cards` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `level` enum('silver','gold','diamond') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'silver',
  `points` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `loyalty_cards`
--

INSERT INTO `loyalty_cards` (`id`, `user_id`, `level`, `points`, `created_at`, `updated_at`) VALUES
(1, 1, 'silver', 595, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(2, 2, 'silver', 335, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(3, 3, 'silver', 575, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(4, 4, 'silver', 692, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(5, 5, 'silver', 156, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(6, 6, 'silver', 338, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(7, 7, 'silver', 899, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(8, 8, 'silver', 749, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(9, 9, 'silver', 684, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(10, 10, 'silver', 700, '2025-10-16 08:23:42', '2025-10-16 08:23:42');

-- --------------------------------------------------------

--
-- Table structure for table `managers`
--

CREATE TABLE `managers` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `branch_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `managers`
--

INSERT INTO `managers` (`id`, `user_id`, `branch_id`, `created_at`, `updated_at`) VALUES
(1, 12, 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42');

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(12,2) NOT NULL,
  `calories` int DEFAULT NULL,
  `status` enum('available','unavailable') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `name`, `description`, `price`, `calories`, `status`, `image`, `category_id`, `created_at`, `updated_at`) VALUES
(1, 'Menu Item 1', 'Description for Menu Item 1', '482.00', 308, 'available', NULL, 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(2, 'Menu Item 2', 'Description for Menu Item 2', '278.00', 490, 'available', NULL, 4, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(3, 'Menu Item 3', 'Description for Menu Item 3', '136.00', 339, 'available', NULL, 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(4, 'Menu Item 4', 'Description for Menu Item 4', '107.00', 139, 'available', NULL, 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(5, 'Menu Item 5', 'Description for Menu Item 5', '493.00', 528, 'available', NULL, 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(6, 'Menu Item 6', 'Description for Menu Item 6', '60.00', 349, 'available', NULL, 4, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(7, 'Menu Item 7', 'Description for Menu Item 7', '264.00', 654, 'available', NULL, 4, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(8, 'Menu Item 8', 'Description for Menu Item 8', '214.00', 384, 'available', NULL, 4, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(9, 'Menu Item 9', 'Description for Menu Item 9', '109.00', 573, 'available', NULL, 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(10, 'Menu Item 10', 'Description for Menu Item 10', '426.00', 102, 'available', NULL, 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(11, 'Menu Item 11', 'Description for Menu Item 11', '169.00', 560, 'available', NULL, 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(12, 'Menu Item 12', 'Description for Menu Item 12', '354.00', 666, 'available', NULL, 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(13, 'Menu Item 13', 'Description for Menu Item 13', '250.00', 257, 'available', NULL, 3, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(14, 'Menu Item 14', 'Description for Menu Item 14', '311.00', 458, 'available', NULL, 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(15, 'Menu Item 15', 'Description for Menu Item 15', '64.00', 431, 'available', NULL, 3, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(16, 'Menu Item 16', 'Description for Menu Item 16', '229.00', 644, 'available', NULL, 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(17, 'Menu Item 17', 'Description for Menu Item 17', '202.00', 139, 'available', NULL, 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(18, 'Menu Item 18', 'Description for Menu Item 18', '325.00', 408, 'available', NULL, 3, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(19, 'Menu Item 19', 'Description for Menu Item 19', '334.00', 679, 'available', NULL, 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(20, 'Menu Item 20', 'Description for Menu Item 20', '383.00', 401, 'available', NULL, 4, '2025-10-16 08:23:42', '2025-10-16 08:23:42');

-- --------------------------------------------------------

--
-- Table structure for table `menu_categories`
--

CREATE TABLE `menu_categories` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menu_categories`
--

INSERT INTO `menu_categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Khai vị', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(2, 'Món chính', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(3, 'Tráng miệng', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(4, 'Đồ uống', '2025-10-16 08:23:42', '2025-10-16 08:23:42');

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
(3, '2025_10_08_113833_create_full_system_tables', 1),
(4, '2025_10_16_153129_create_personal_access_tokens_table', 2),
(5, '2025_10_23_035421_create_categories_table', 3),
(6, '2025_10_25_145457_create_configurations_table', 4);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint UNSIGNED NOT NULL,
  `booking_id` bigint UNSIGNED DEFAULT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `menu_id` bigint UNSIGNED NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `special_request` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','preparing','served','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `booking_id`, `user_id`, `menu_id`, `quantity`, `special_request`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 10, 1, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(2, 1, 1, 1, 2, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(3, 2, 2, 18, 2, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(4, 2, 2, 11, 1, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(5, 3, 3, 9, 3, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(6, 3, 3, 4, 1, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(7, 4, 4, 7, 2, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(8, 4, 4, 20, 3, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(9, 5, 5, 19, 3, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(10, 5, 5, 3, 1, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(11, 6, 6, 4, 2, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(12, 6, 6, 15, 1, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(13, 7, 7, 11, 3, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(14, 7, 7, 10, 3, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(15, 8, 8, 12, 2, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(16, 8, 8, 15, 3, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(17, 9, 9, 2, 2, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(18, 9, 9, 9, 1, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(19, 10, 10, 10, 3, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(20, 10, 10, 17, 3, NULL, 'pending', '2025-10-16 08:23:42', '2025-10-16 08:23:42');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `booking_id` bigint UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` enum('VNPAY','MoMo','BankTransfer','Cash') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Cash',
  `status` enum('pending','paid','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `user_id`, `booking_id`, `amount`, `method`, `status`, `paid_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '969.00', 'Cash', 'paid', '2025-10-16 08:23:42', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(2, 2, 2, '995.00', 'Cash', 'paid', '2025-10-16 08:23:42', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(3, 3, 3, '570.00', 'Cash', 'paid', '2025-10-16 08:23:42', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(4, 4, 4, '181.00', 'Cash', 'paid', '2025-10-16 08:23:42', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(5, 5, 5, '114.00', 'Cash', 'paid', '2025-10-16 08:23:42', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(6, 6, 6, '799.00', 'Cash', 'paid', '2025-10-16 08:23:42', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(7, 7, 7, '924.00', 'Cash', 'paid', '2025-10-16 08:23:42', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(8, 8, 8, '138.00', 'Cash', 'paid', '2025-10-16 08:23:42', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(9, 9, 9, '696.00', 'Cash', 'paid', '2025-10-16 08:23:42', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(10, 10, 10, '907.00', 'Cash', 'paid', '2025-10-16 08:23:42', '2025-10-16 08:23:42', '2025-10-16 08:23:42');

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
(1, 'App\\Models\\User', 15, 'user-token', 'b75fa9fd8492c0b2632d884fd34825473ad6d59e721b3f730d95b51ce85fedbe', '[\"*\"]', NULL, NULL, '2025-10-16 08:32:44', '2025-10-16 08:32:44'),
(3, 'App\\Models\\User', 20, 'auth_token', 'f80018435b4d7b8eabc80d274444cea81d5d9824ea33fc41b5e9e8f2b6214228', '[\"*\"]', NULL, NULL, '2025-10-19 08:31:51', '2025-10-19 08:31:51'),
(4, 'App\\Models\\User', 20, 'auth_token', '86403ec6ec493b1fe5a0c0116a7766feb2550d04d82a0c30ffb2108208801839', '[\"*\"]', NULL, NULL, '2025-10-19 08:32:35', '2025-10-19 08:32:35'),
(5, 'App\\Models\\User', 21, 'auth_token', '36170be6376f63b868cbf5c91b6872c4e596aad3864368bc3b5a4c800f58578a', '[\"*\"]', NULL, NULL, '2025-10-19 08:33:29', '2025-10-19 08:33:29'),
(6, 'App\\Models\\User', 22, 'auth_token', '83499cb12e91f7d018cd0b594e6fc9af95d7f9ed075463dc7c2257ed0d16a20d', '[\"*\"]', NULL, NULL, '2025-10-19 08:44:39', '2025-10-19 08:44:39'),
(7, 'App\\Models\\User', 23, 'auth_token', '5b48372bb9988f506a05032d6165947ab73395822a7df618690dca033c5113ab', '[\"*\"]', NULL, NULL, '2025-10-22 18:18:52', '2025-10-22 18:18:52'),
(8, 'App\\Models\\User', 23, 'auth_token', 'ae537297816a0b3171d2139b47981e60a544c59bde41d0c6880391aa5c259342', '[\"*\"]', NULL, NULL, '2025-10-22 20:09:44', '2025-10-22 20:09:44'),
(9, 'App\\Models\\User', 23, 'auth_token', 'a26a50a7a3015185381f65ac3b440be0bdf767f9ffec37cf65e759e199f7bb96', '[\"*\"]', NULL, NULL, '2025-10-22 20:12:47', '2025-10-22 20:12:47'),
(10, 'App\\Models\\User', 23, 'auth_token', 'be84255df0d0252c6b29d4de87edae1851698cff63d6d71a7aa7cc629bbce406', '[\"*\"]', NULL, NULL, '2025-10-22 20:16:00', '2025-10-22 20:16:00'),
(11, 'App\\Models\\User', 23, 'auth_token', '7ae1a03cb3d67279c8f337cd629f8f18dd03fa84b9627e7c1b7f5f248437db39', '[\"*\"]', NULL, NULL, '2025-10-22 20:24:56', '2025-10-22 20:24:56'),
(12, 'App\\Models\\User', 23, 'auth_token', '91d4204adb69426d39d50d605cec5510d008c78ce39d5205f0b06f0271418da5', '[\"*\"]', NULL, NULL, '2025-10-22 21:12:55', '2025-10-22 21:12:55'),
(13, 'App\\Models\\User', 23, 'auth_token', '70763400bab95b4a941bd627e327af50392e3a30bc1098235bc5f7f48a94e959', '[\"*\"]', NULL, NULL, '2025-10-22 21:19:48', '2025-10-22 21:19:48'),
(14, 'App\\Models\\User', 23, 'auth_token', 'd487622790fbd8393a3655c2a90a87aec356fe23545ff5672ca41920f588a88e', '[\"*\"]', NULL, NULL, '2025-10-22 22:10:04', '2025-10-22 22:10:04');

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `id` bigint UNSIGNED NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` bigint UNSIGNED NOT NULL,
  `branch_id` bigint UNSIGNED NOT NULL,
  `type` enum('daily','monthly','yearly') COLLATE utf8mb4_unicode_ci NOT NULL,
  `revenue` decimal(12,2) NOT NULL,
  `expense` decimal(12,2) NOT NULL,
  `profit` decimal(12,2) NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `permissions` json NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `id` bigint UNSIGNED NOT NULL,
  `employee_id` bigint UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `shift_start` time NOT NULL,
  `shift_end` time NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` (`id`, `employee_id`, `date`, `shift_start`, `shift_end`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-10-26', '09:00:00', '17:00:00', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(2, 2, '2025-10-21', '09:00:00', '17:00:00', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(3, 3, '2025-10-26', '09:00:00', '17:00:00', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(4, 4, '2025-10-23', '09:00:00', '17:00:00', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(5, 5, '2025-10-21', '09:00:00', '17:00:00', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(6, 6, '2025-10-23', '09:00:00', '17:00:00', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(7, 7, '2025-10-26', '09:00:00', '17:00:00', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(8, 8, '2025-10-16', '09:00:00', '17:00:00', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(9, 9, '2025-10-18', '09:00:00', '17:00:00', '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(10, 10, '2025-10-16', '09:00:00', '17:00:00', '2025-10-16 08:23:42', '2025-10-16 08:23:42');

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
('40sOY90Wwloa4EbglzY0iNn7pDkjYBQezfq3HmeH', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoibkdQY0x6YnBZQldBRnJ1U2FtNkZkVmRNYkZkSElDWklCSTMzc1g0WSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1760685053),
('9doCrR5SHvyjea1qaQ6MBIdNg4uzH6MRVWbGnFfT', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiNXA0cHl6cEVRRlVNTllOcDFMVVlReWdnN0FNTWtJb1R4TnZwbVZSVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1761390025),
('cJyny2Z7yauHYSWV97driOlkco2bUATXqesMMkF7', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidEg1bVM1RjRoRzVtVU1QQnJOSGNNeEo3VkE1akh1cDBveVRSQ1lleCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1761042832),
('IkdMjRyFRecx5LroSV8mJTHOZQE3uf26DwrFStom', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiejlldGp2a2FMcHplaDIybWJWZEtnbUI4Q01STzlFa1pLekJtSGhkbCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1761180471),
('kXv90S39BiE1jQ8geCwxpC1ZirL4NqzsMdUkw6TU', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiUEJ6QVl0QzhSTUpoWFRpbnJGZm1qb2d4R0dnZkhpUW02T1JaeURsYiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1761182224),
('Mv4Pf0cO5OpCWvogzxcxrPfnJSddmrIwJzjo50UY', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoib3B0VnFBdG50eXJlVEdzNWR2ekdFVEl3dVdpMU5jN1ZWR1VLT3I1aSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1760887881),
('raIoVoZY2Ti6pJ31Lt3IszeZJVhGoRRV3ReuW3aq', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoid2oxVWlzVkVNbEFYUEltZU5DVGNhcXFZSldqTlQ3T3VDN1RjNWpyNSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1761405045);

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tables`
--

CREATE TABLE `tables` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seats` int NOT NULL,
  `status` enum('available','occupied','reserved') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
  `branch_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tables`
--

INSERT INTO `tables` (`id`, `name`, `seats`, `status`, `branch_id`, `created_at`, `updated_at`) VALUES
(1, 'Table 1', 4, 'available', 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(2, 'Table 2', 4, 'available', 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(3, 'Table 3', 4, 'available', 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(4, 'Table 4', 3, 'available', 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(5, 'Table 5', 4, 'available', 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(6, 'Table 6', 6, 'available', 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(7, 'Table 7', 4, 'available', 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(8, 'Table 8', 5, 'available', 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(9, 'Table 9', 3, 'available', 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(10, 'Table 10', 4, 'available', 1, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(11, 'Table 1', 6, 'available', 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(12, 'Table 2', 4, 'available', 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(13, 'Table 3', 3, 'available', 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(14, 'Table 4', 6, 'available', 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(15, 'Table 5', 5, 'available', 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(16, 'Table 6', 5, 'available', 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(17, 'Table 7', 3, 'available', 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(18, 'Table 8', 6, 'available', 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(19, 'Table 9', 5, 'available', 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(20, 'Table 10', 4, 'available', 2, '2025-10-16 08:23:42', '2025-10-16 08:23:42');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('customer','employee','manager','owner') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'customer',
  `vip_level` enum('none','silver','gold','diamond') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `vip_level`, `avatar`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Customer 1', 'customer1@example.com', '090000001', '$2y$12$t6rO/LlpJf99bndomCVWlO54dQaWF4uRtEs.rzgU1MkU7d.F8E73i', 'customer', 'none', NULL, NULL, NULL, '2025-10-16 08:23:40', '2025-10-16 08:23:40'),
(2, 'Customer 2', 'customer2@example.com', '090000002', '$2y$12$FPAes82LSgUaWpDk0fgeuOdqAififgX0vHHzNH2OPbfy7Bo2mRoG6', 'customer', 'none', NULL, NULL, NULL, '2025-10-16 08:23:40', '2025-10-16 08:23:40'),
(3, 'Customer 3', 'customer3@example.com', '090000003', '$2y$12$z02z38YtlpBuCRkBVwrrJOvpUFPLXIJHj5cYDgxkllwl/ZnlZcGDC', 'customer', 'none', NULL, NULL, NULL, '2025-10-16 08:23:40', '2025-10-16 08:23:40'),
(4, 'Customer 4', 'customer4@example.com', '090000004', '$2y$12$BDuySrOIuVftsQ8AFAKHmO0XFV0VgMA9iNy2V32rHH/ty23JJvzY.', 'customer', 'none', NULL, NULL, NULL, '2025-10-16 08:23:40', '2025-10-16 08:23:40'),
(5, 'Customer 5', 'customer5@example.com', '090000005', '$2y$12$Ad1koWnTAgnhDEWMu746BOc9Cck0SdxcMesNaYRrqbai.SY9fWEBW', 'customer', 'none', NULL, NULL, NULL, '2025-10-16 08:23:41', '2025-10-16 08:23:41'),
(6, 'Customer 6', 'customer6@example.com', '090000006', '$2y$12$3tCbu4WNl6JPUwz1SCH5Wu861tYgwsQ4/OxnRSk.wWYArzer9jbxC', 'customer', 'none', NULL, NULL, NULL, '2025-10-16 08:23:41', '2025-10-16 08:23:41'),
(7, 'Customer 7', 'customer7@example.com', '090000007', '$2y$12$LyX05fbVGILAb41DOsw89OL3gJXJN/i.676bun53EBIUUUgMl32Jm', 'customer', 'none', NULL, NULL, NULL, '2025-10-16 08:23:41', '2025-10-16 08:23:41'),
(8, 'Customer 8', 'customer8@example.com', '090000008', '$2y$12$moCZRjJN97YYrUaiLwW87.BjdpyVSpNdAcjxkNTqaDAdo7KML5M3C', 'customer', 'none', NULL, NULL, NULL, '2025-10-16 08:23:41', '2025-10-16 08:23:41'),
(9, 'Customer 9', 'customer9@example.com', '090000009', '$2y$12$V1esx2Y0Cv3LNEUqEkr.duKMIwI7zUIu/RbHwH154tuGeTwJUiqtq', 'customer', 'none', NULL, NULL, NULL, '2025-10-16 08:23:41', '2025-10-16 08:23:41'),
(10, 'Customer 10', 'customer10@example.com', '0900000010', '$2y$12$XWD9YonV.YoPyM5qoTvZm.YM5lQTVNZb.4G7bmZh4R1NWVDGUuqze', 'customer', 'none', NULL, NULL, NULL, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(11, 'Owner TableGo', 'owner@example.com', '0910000000', '$2y$12$6H389Rs6mmNTrTJXghvnaOC/WtIYgCOj4znQjgW6ut.T5N2aAElv.', 'owner', 'diamond', NULL, NULL, NULL, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(12, 'Manager Branch 1', 'manager1@example.com', '0920000000', '$2y$12$bUdkEaoK1CCXZEVijpSqRuPegpg85XblSp2IftWLm8lkQTrOHCKOu', 'manager', 'gold', NULL, NULL, NULL, '2025-10-16 08:23:42', '2025-10-16 08:23:42'),
(13, 'nasa12345', 'thuytg12345@example.com', '01234567890', '$2y$12$6KiEI2..ZmhEXfumC2Rdj.tlID8.pNG.nHci.7YBLPUNFBLw.1GJK', 'customer', 'none', NULL, NULL, NULL, '2025-10-16 08:28:40', '2025-10-16 08:28:40'),
(14, 'nasa1', 'thuytg5@example.com', '0355176223', '$2y$12$hnAI..hW/C3BlJnAILqrlu6NBmDu25c97n6bRZKKYt3r8LoH9YFaO', 'customer', 'none', NULL, NULL, NULL, '2025-10-16 08:29:07', '2025-10-16 08:29:07'),
(15, 'nasa2005', 'thuytg1711@example.com', '0986652805', '$2y$12$NB3D1LkpBDTAWX8Tf0A95eKuwbwMpLcGJwLFffEhB5ZL7BAzhdtnm', 'customer', 'none', NULL, NULL, NULL, '2025-10-16 08:32:44', '2025-10-16 08:32:44'),
(16, 'Xuân Thủy', 'thuy5@example.com', '0987654321', '$2y$12$sJXVyNxqT1tkCprBzVmxyuYAu3jRX8ou8mnPUyGKXVjOqj1jj8anK', 'customer', 'none', NULL, NULL, NULL, '2025-10-16 08:57:13', '2025-10-16 08:57:13'),
(23, 'thuytg1724', 'thuylxph53530@gmail.com', '0986652871', '$2y$12$2LpVQFomEizYh6yZYm.nrOwYSzF6QU167mGbAuOwB3jA/dSSKR29e', 'customer', 'none', NULL, NULL, NULL, '2025-10-22 18:18:37', '2025-10-22 18:18:37'),
(24, 'thuytg4566', 'admin12@gmail.com', '0931149779', '$2y$12$c2CyLEPEXZCyx5eZbcfJ1.1w40Yhc.7u1QlrJDyIhtwkWl/e3S9bK', 'customer', 'none', NULL, NULL, NULL, '2025-10-22 20:20:10', '2025-10-22 20:20:10');

-- --------------------------------------------------------

--
-- Table structure for table `waiting_list`
--

CREATE TABLE `waiting_list` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `people_count` int NOT NULL,
  `desired_time` datetime NOT NULL,
  `branch_id` bigint UNSIGNED NOT NULL,
  `status` enum('waiting','notified','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'waiting',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bookings_user_id_foreign` (`user_id`),
  ADD KEY `bookings_table_id_foreign` (`table_id`);

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
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `combos`
--
ALTER TABLE `combos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `configurations`
--
ALTER TABLE `configurations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employees_email_unique` (`email`),
  ADD KEY `employees_branch_id_foreign` (`branch_id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expenses_branch_id_foreign` (`branch_id`);

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
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inventory_branch_id_foreign` (`branch_id`);

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
-- Indexes for table `loyalty_cards`
--
ALTER TABLE `loyalty_cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `loyalty_cards_user_id_foreign` (`user_id`);

--
-- Indexes for table `managers`
--
ALTER TABLE `managers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `managers_user_id_foreign` (`user_id`),
  ADD KEY `managers_branch_id_foreign` (`branch_id`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menus_category_id_foreign` (`category_id`);

--
-- Indexes for table `menu_categories`
--
ALTER TABLE `menu_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_booking_id_foreign` (`booking_id`),
  ADD KEY `orders_user_id_foreign` (`user_id`),
  ADD KEY `orders_menu_id_foreign` (`menu_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_user_id_foreign` (`user_id`),
  ADD KEY `payments_booking_id_foreign` (`booking_id`);

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
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reports_branch_id_foreign` (`branch_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `schedules_employee_id_foreign` (`employee_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `1` (`user_id`),
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
  ADD KEY `tables_branch_id_foreign` (`branch_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_phone_unique` (`phone`),
  ADD KEY `users_role_index` (`role`),
  ADD KEY `users_vip_level_index` (`vip_level`);

--
-- Indexes for table `waiting_list`
--
ALTER TABLE `waiting_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `waiting_list_user_id_foreign` (`user_id`),
  ADD KEY `waiting_list_branch_id_foreign` (`branch_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `combos`
--
ALTER TABLE `combos`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `configurations`
--
ALTER TABLE `configurations`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `loyalty_cards`
--
ALTER TABLE `loyalty_cards`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `managers`
--
ALTER TABLE `managers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `menu_categories`
--
ALTER TABLE `menu_categories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tables`
--
ALTER TABLE `tables`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `waiting_list`
--
ALTER TABLE `waiting_list`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_table_id_foreign` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `feedbacks_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `inventory_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `loyalty_cards`
--
ALTER TABLE `loyalty_cards`
  ADD CONSTRAINT `loyalty_cards_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `managers`
--
ALTER TABLE `managers`
  ADD CONSTRAINT `managers_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `managers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `menus`
--
ALTER TABLE `menus`
  ADD CONSTRAINT `menus_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `menu_categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_menu_id_foreign` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_employee_id_foreign` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `tables`
--
ALTER TABLE `tables`
  ADD CONSTRAINT `tables_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `waiting_list`
--
ALTER TABLE `waiting_list`
  ADD CONSTRAINT `waiting_list_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `waiting_list_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
