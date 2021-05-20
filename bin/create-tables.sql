-- MySQL dump 10.13  Distrib 8.0.23, for Linux (x86_64)
--
-- Host: localhost    Database: test
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Actor`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Actor` (
  `ActorID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  PRIMARY KEY (`ActorID`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Actor_Video`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Actor_Video` (
  `ActorID` int NOT NULL,
  `CatalogNo` int NOT NULL,
  PRIMARY KEY (`ActorID`,`CatalogNo`),
  KEY `CatalogNo` (`CatalogNo`),
  CONSTRAINT `Actor_Video_ibfk_1` FOREIGN KEY (`ActorID`) REFERENCES `Actor` (`ActorID`),
  CONSTRAINT `Actor_Video_ibfk_2` FOREIGN KEY (`CatalogNo`) REFERENCES `Video` (`CatalogNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Branch`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Branch` (
  `BranchNo` int NOT NULL AUTO_INCREMENT,
  `ManagerStaffNo` int DEFAULT NULL,
  `Address_Street` varchar(50) NOT NULL,
  `Address_City` varchar(50) NOT NULL,
  `Address_State` varchar(50) NOT NULL,
  `Address_ZipCode` varchar(10) NOT NULL,
  `TelephoneNum` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`BranchNo`),
  KEY `ManagerStaffNo` (`ManagerStaffNo`),
  CONSTRAINT `Branch_ibfk_1` FOREIGN KEY (`ManagerStaffNo`) REFERENCES `Staff` (`StaffNo`) ON DELETE SET NULL,
  CONSTRAINT `Valid_Phone_Branch` CHECK (regexp_like(`TelephoneNum`,_utf8mb4'^[0-9]{3,15}$'))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Category`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `CategoryID` int NOT NULL AUTO_INCREMENT,
  `CategoryName` varchar(100) NOT NULL,
  PRIMARY KEY (`CategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Director`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Director` (
  `DirectorID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  PRIMARY KEY (`DirectorID`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Member`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Member` (
  `MemberNo` int NOT NULL AUTO_INCREMENT,
  `BranchNo` int NOT NULL,
  `DateJoined` date NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) NOT NULL,
  `Address_Street` varchar(50) NOT NULL,
  `Address_City` varchar(50) NOT NULL,
  `Address_State` varchar(50) NOT NULL,
  `Address_ZipCode` varchar(10) NOT NULL,
  `TelephoneNum` varchar(15) NOT NULL,
  `Gender` char(1) DEFAULT NULL,
  PRIMARY KEY (`MemberNo`),
  KEY `BranchNo` (`BranchNo`),
  CONSTRAINT `Member_ibfk_1` FOREIGN KEY (`BranchNo`) REFERENCES `Branch` (`BranchNo`),
  CONSTRAINT `Valid_Gender_Member` CHECK ((`Gender` in (_utf8mb4'M',_utf8mb4'F'))),
  CONSTRAINT `Valid_Phone_Member` CHECK (regexp_like(`TelephoneNum`,_utf8mb4'^[0-9]{3,15}$'))
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Rental`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Rental` (
  `RentalNo` int NOT NULL AUTO_INCREMENT,
  `MemberNo` int NOT NULL,
  `BranchNo` int NOT NULL,
  `DateOut` date NOT NULL,
  PRIMARY KEY (`RentalNo`),
  KEY `MemberNo` (`MemberNo`),
  KEY `BranchNo` (`BranchNo`),
  CONSTRAINT `Rental_ibfk_1` FOREIGN KEY (`MemberNo`) REFERENCES `Member` (`MemberNo`),
  CONSTRAINT `Rental_ibfk_2` FOREIGN KEY (`BranchNo`) REFERENCES `Branch` (`BranchNo`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Staff`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Staff` (
  `StaffNo` int NOT NULL AUTO_INCREMENT,
  `BranchNo` int NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Position` varchar(10) NOT NULL,
  `Salary` decimal(12,2) NOT NULL DEFAULT '0.00',
  `Gender` char(1) DEFAULT NULL,
  PRIMARY KEY (`StaffNo`),
  KEY `BranchNo` (`BranchNo`),
  CONSTRAINT `Staff_ibfk_1` FOREIGN KEY (`BranchNo`) REFERENCES `Branch` (`BranchNo`),
  CONSTRAINT `Valid_Gender_Staff` CHECK ((`Gender` in (_utf8mb4'M',_utf8mb4'F')))
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Video`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Video` (
  `CatalogNo` int NOT NULL AUTO_INCREMENT,
  `DirectorID` int DEFAULT NULL,
  `Title` varchar(100) NOT NULL,
  `DailyRental` decimal(12,2) NOT NULL,
  `Cost` decimal(12,2) NOT NULL,
  PRIMARY KEY (`CatalogNo`),
  KEY `DirectorID` (`DirectorID`),
  CONSTRAINT `Video_ibfk_1` FOREIGN KEY (`DirectorID`) REFERENCES `Director` (`DirectorID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `VideoCopy`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VideoCopy` (
  `CatalogNo` int NOT NULL,
  `VideoNo` int NOT NULL,
  `BranchNo` int NOT NULL,
  `Status` char(1) NOT NULL,
  PRIMARY KEY (`CatalogNo`,`VideoNo`),
  KEY `BranchNo` (`BranchNo`),
  CONSTRAINT `VideoCopy_ibfk_1` FOREIGN KEY (`CatalogNo`) REFERENCES `Video` (`CatalogNo`),
  CONSTRAINT `VideoCopy_ibfk_2` FOREIGN KEY (`BranchNo`) REFERENCES `Branch` (`BranchNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Video_Category`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Video_Category` (
  `CatalogNo` int NOT NULL,
  `CategoryID` int NOT NULL,
  PRIMARY KEY (`CatalogNo`,`CategoryID`),
  KEY `CategoryID` (`CategoryID`),
  CONSTRAINT `Video_Category_ibfk_1` FOREIGN KEY (`CatalogNo`) REFERENCES `Video` (`CatalogNo`),
  CONSTRAINT `Video_Category_ibfk_2` FOREIGN KEY (`CategoryID`) REFERENCES `Category` (`CategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Video_Rental`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Video_Rental` (
  `RentalNo` int NOT NULL,
  `CatalogNo` int NOT NULL,
  `VideoNo` int NOT NULL,
  `DateReturn` date DEFAULT NULL,
  PRIMARY KEY (`RentalNo`,`CatalogNo`,`VideoNo`),
  KEY `CatalogNo` (`CatalogNo`,`VideoNo`),
  CONSTRAINT `Video_Rental_ibfk_1` FOREIGN KEY (`RentalNo`) REFERENCES `Rental` (`RentalNo`),
  CONSTRAINT `Video_Rental_ibfk_2` FOREIGN KEY (`CatalogNo`, `VideoNo`) REFERENCES `VideoCopy` (`CatalogNo`, `VideoNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-20 13:56:09
