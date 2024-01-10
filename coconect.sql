-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Jan 05, 2024 at 11:38 AM
-- Server version: 8.2.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `coconect`
--

-- --------------------------------------------------------

--
-- Table structure for table `app_user`
--

CREATE TABLE `app_user` (
  `id` bigint NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_code` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','USER') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `app_user_conversations`
--

CREATE TABLE `app_user_conversations` (
  `app_user_id` bigint NOT NULL,
  `conversations_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `app_user_notifications`
--

CREATE TABLE `app_user_notifications` (
  `app_user_id` bigint NOT NULL,
  `notifications_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversation`
--

CREATE TABLE `conversation` (
  `personal` bit(1) NOT NULL,
  `unread` int DEFAULT NULL,
  `id` bigint NOT NULL,
  `conversation_code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media_file`
--

CREATE TABLE `media_file` (
  `id` bigint NOT NULL,
  `size` bigint DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `data` longblob
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `to_room` bit(1) DEFAULT NULL,
  `id` bigint NOT NULL,
  `content` varchar(255) DEFAULT NULL,
  `identity_code` varchar(255) DEFAULT NULL,
  `posted_time` varchar(255) DEFAULT NULL,
  `receiver_code` varchar(255) DEFAULT NULL,
  `sender_name` varchar(255) DEFAULT NULL,
  `status` enum('JOIN','MESSAGE','INVITE','KICK','ACCEPT','DENY','TYPING','NOTI','PROMOTE','LEAVE') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` bigint NOT NULL,
  `receiver_id` bigint DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `room_code` varchar(255) DEFAULT NULL,
  `room_name` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `status` enum('JOIN','MESSAGE','INVITE','KICK','ACCEPT','DENY','TYPING','NOTI','PROMOTE','LEAVE') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `id` bigint NOT NULL,
  `creator` varchar(255) DEFAULT NULL,
  `room_code` varchar(255) DEFAULT NULL,
  `room_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `room_members`
--

CREATE TABLE `room_members` (
  `members_id` bigint NOT NULL,
  `room_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `token`
--

CREATE TABLE `token` (
  `expired` bit(1) DEFAULT NULL,
  `revoked` bit(1) DEFAULT NULL,
  `token_type` tinyint DEFAULT NULL,
  `id` bigint NOT NULL,
  `owner_id` bigint DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL
) ;

-- --------------------------------------------------------

--
-- Table structure for table `token_seq`
--

CREATE TABLE `token_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `token_seq`
--

INSERT INTO `token_seq` (`next_val`) VALUES
(1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `app_user`
--
ALTER TABLE `app_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_3k4cplvh82srueuttfkwnylq0` (`username`);

--
-- Indexes for table `app_user_conversations`
--
ALTER TABLE `app_user_conversations`
  ADD PRIMARY KEY (`app_user_id`,`conversations_id`),
  ADD UNIQUE KEY `UK_4yp089vx97t6mn8g24mxyuqx4` (`conversations_id`);

--
-- Indexes for table `app_user_notifications`
--
ALTER TABLE `app_user_notifications`
  ADD PRIMARY KEY (`app_user_id`,`notifications_id`),
  ADD UNIQUE KEY `UK_j0ru960349yhv318ly5ytm9hk` (`notifications_id`);

--
-- Indexes for table `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `media_file`
--
ALTER TABLE `media_file`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKpanca36cyuytbaer9n19smvi2` (`receiver_id`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_members`
--
ALTER TABLE `room_members`
  ADD PRIMARY KEY (`members_id`,`room_id`),
  ADD KEY `FK76lf284bb0baceybfd2gi50rl` (`room_id`);

--
-- Indexes for table `token`
--
ALTER TABLE `token`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKnfl9avrll1rv0a3xr2xp9c3ts` (`owner_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `app_user`
--
ALTER TABLE `app_user`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conversation`
--
ALTER TABLE `conversation`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media_file`
--
ALTER TABLE `media_file`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `app_user_conversations`
--
ALTER TABLE `app_user_conversations`
  ADD CONSTRAINT `FK29pm55kc2rjh9ppx4b91dryq0` FOREIGN KEY (`conversations_id`) REFERENCES `conversation` (`id`),
  ADD CONSTRAINT `FKb7j92bqn00j0tofbrlnyuejeh` FOREIGN KEY (`app_user_id`) REFERENCES `app_user` (`id`);

--
-- Constraints for table `app_user_notifications`
--
ALTER TABLE `app_user_notifications`
  ADD CONSTRAINT `FK644xb4pwag1rx4vwaxvj3stae` FOREIGN KEY (`app_user_id`) REFERENCES `app_user` (`id`),
  ADD CONSTRAINT `FKdg9sku8ptc19jvl4qerg9otgq` FOREIGN KEY (`notifications_id`) REFERENCES `notification` (`id`);

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `FKpanca36cyuytbaer9n19smvi2` FOREIGN KEY (`receiver_id`) REFERENCES `app_user` (`id`);

--
-- Constraints for table `room_members`
--
ALTER TABLE `room_members`
  ADD CONSTRAINT `FK76lf284bb0baceybfd2gi50rl` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  ADD CONSTRAINT `FK924l7lbfyb2jo58wyghn5ue2n` FOREIGN KEY (`members_id`) REFERENCES `app_user` (`id`);

--
-- Constraints for table `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `FKnfl9avrll1rv0a3xr2xp9c3ts` FOREIGN KEY (`owner_id`) REFERENCES `app_user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
