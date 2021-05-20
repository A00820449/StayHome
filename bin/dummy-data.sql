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
-- Dumping data for table `Actor`
--

LOCK TABLES `Actor` WRITE;
/*!40000 ALTER TABLE `Actor` DISABLE KEYS */;
INSERT INTO `Actor` VALUES (1,'Robert De Niro'),(2,'Leonardo Di Caprio'),(3,'Matt Damon'),(4,'Tom Hanks'),(5,'Frances McDormand'),(6,'Olivia Colman'),(7,'Anthony Hopkins'),(8,'Juhan Ulfsak'),(9,'Jim Carrey'),(10,'Tom Cruise'),(11,'Kang-ho Song'),(12,'Chris Hemsworth'),(13,'Mark Wahlberg'),(14,'Al Pacino');
/*!40000 ALTER TABLE `Actor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Actor_Video`
--

LOCK TABLES `Actor_Video` WRITE;
/*!40000 ALTER TABLE `Actor_Video` DISABLE KEYS */;
INSERT INTO `Actor_Video` VALUES (6,1),(7,1),(8,2),(5,3),(2,6),(2,7),(3,7),(13,7),(1,8),(10,9),(10,10),(11,11),(9,12),(1,13),(3,14),(4,14),(12,15),(1,16),(14,16),(2,17);
/*!40000 ALTER TABLE `Actor_Video` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Branch`
--

LOCK TABLES `Branch` WRITE;
/*!40000 ALTER TABLE `Branch` DISABLE KEYS */;
INSERT INTO `Branch` VALUES (1,3,'Volcanic Street 134','New York City','New York','10018','15968909980'),(2,5,'Rocky Mountain Street 432','Washington DC','Washington','20002','12006830899'),(3,9,'Ronny Street 567','San Antonio','Texas','78201','13777351234'),(4,13,'Elm Street 879','Chicago','Illinois','60601','15553237780');
/*!40000 ALTER TABLE `Branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (1,'Comedy'),(2,'Action'),(3,'Romance'),(4,'Adventure'),(5,'Sci-Fi'),(6,'Drama'),(7,'Biography'),(8,'Thriller'),(9,'Crime'),(10,'New Arrivals');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Director`
--

LOCK TABLES `Director` WRITE;
/*!40000 ALTER TABLE `Director` DISABLE KEYS */;
INSERT INTO `Director` VALUES (1,'Quentin Tarantino'),(2,'Sam Mendes'),(3,'Florian Zeller'),(4,'Martin Scorsese'),(5,'Joseph Kosinski'),(6,'Christopher Nolan'),(7,'Peter Weir'),(8,'Steven Spielberg'),(9,'Christopher McQuarrie'),(10,'Sam Hargrave'),(11,'Bong Joon Ho'),(12,'Guillermo del Toro'),(13,'Chloé Zhao'),(14,'Emerald Fennell'),(15,'J.C. Chandor');
/*!40000 ALTER TABLE `Director` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Member`
--

LOCK TABLES `Member` WRITE;
/*!40000 ALTER TABLE `Member` DISABLE KEYS */;
INSERT INTO `Member` VALUES (1,1,'2019-01-14','James','Smith','Apple Street 456','New York City','New York','10019','13002879908','M'),(2,2,'2020-01-18','Michael','Smith','Lemon Street 892','Washington DC','Washington','20002','18769990873','M'),(3,3,'2019-02-22','Robert','Smith','Peach Street 974','San Antonio','Texas','78202','13777354321','M'),(4,4,'2020-06-25','Maria','Garcia','Pecan Street 192','Chicago','Illinois','60602','18933232880','F'),(5,1,'2019-01-14','David ','Smith','Cherry Street 129','New York City','New York','10020','16678989981','M'),(6,2,'2019-02-19','Maria','Rodriguez','Grape Street 329','Washington DC','Washington','20003','12006830912','F'),(7,3,'2019-11-23','Maria','Gonzalez','Pear Street 555','San Antonio','Texas','78203','13777351223','F'),(8,4,'2019-09-26','Mary','Smith','Orange Street 234','Chicago','Illinois','60603','14446237781','F'),(9,1,'2019-01-14','Maria','Hernandez','Pine Street 678','New York City','New York','10021','15967779982','F'),(10,2,'2019-01-20','Timothy','Willliams','Watermelon Street 955','Washington DC','Washington','20004','15006830901','M'),(11,3,'2019-05-24','Rosa','Martinez','Banana Street 172','San Antonio','Texas','78204','13777351238','F'),(12,4,'2019-12-27','Rosemary','Gomez','Raspberry Street 238','Chicago','Illinois','60604','15273237782','F'),(13,1,'2019-01-17','James','Johnson','Strawberry Street 475','New York City','New York','10022','18888909983','M'),(14,2,'2020-03-21','Natalie','Mancero','Blueberry Street 333','Washington DC','Washington','20005','12008330902','F');
/*!40000 ALTER TABLE `Member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Rental`
--

LOCK TABLES `Rental` WRITE;
/*!40000 ALTER TABLE `Rental` DISABLE KEYS */;
INSERT INTO `Rental` VALUES (1,5,3,'2019-01-14'),(2,7,3,'2019-02-03'),(3,4,3,'2019-02-15'),(4,1,3,'2019-03-01'),(5,12,2,'2019-03-27'),(6,1,2,'2019-04-05'),(7,10,1,'2020-04-15'),(8,13,3,'2020-05-10'),(9,3,2,'2020-05-18'),(10,3,1,'2020-05-20'),(11,9,3,'2020-05-21'),(12,14,1,'2020-06-03'),(13,12,2,'2020-06-03'),(14,3,4,'2020-07-10'),(15,13,1,'2020-08-20');
/*!40000 ALTER TABLE `Rental` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Staff`
--

LOCK TABLES `Staff` WRITE;
/*!40000 ALTER TABLE `Staff` DISABLE KEYS */;
INSERT INTO `Staff` VALUES (1,1,'Jason','Salesclerk',500.00,'M'),(2,1,'Romina','Salesclerk',5000.00,'F'),(3,1,'Max','Manager',1000.00,'M'),(4,1,'Cindy','Assistant',300.00,'F'),(5,2,'Michael','Manager',1000.00,'M'),(6,2,'Regina','Assistant',300.00,'F'),(7,2,'James','Manager',1000.00,'M'),(8,2,'Jasmine','Assistant',300.00,'F'),(9,3,'Bertha','Manager',1000.00,'F'),(10,3,'Julieta','Assistant',300.00,'F'),(11,3,'Mark','Salesclerk',500.00,'M'),(12,3,'Natalia','Salesclerk',500.00,'F'),(13,4,'Robert','Salesclerk',500.00,'M'),(14,4,'Jessy','Salesclerk',500.00,'F');
/*!40000 ALTER TABLE `Staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Video`
--

LOCK TABLES `Video` WRITE;
/*!40000 ALTER TABLE `Video` DISABLE KEYS */;
INSERT INTO `Video` VALUES (1,3,'The Father',6.00,45.00),(2,6,'Tenet',6.00,50.00),(3,13,'Nomadland',5.50,40.00),(4,2,'1917',6.00,50.00),(5,14,'Promising Young Woman',5.50,45.00),(6,6,'Inception',5.50,45.00),(7,4,'The Departed',4.00,35.00),(8,4,'Taxi Driver',4.00,35.00),(9,9,'Jack Reacher',4.00,40.00),(10,5,'Oblivion',4.00,40.00),(11,11,'Parasite',4.50,45.00),(12,7,'The Truman Show',4.00,35.00),(13,4,'Good Fellas',4.50,40.00),(14,8,'Saving Private Ryan',4.50,40.00),(15,10,'Extraction',5.00,45.00),(16,4,'The Irishman',5.50,50.00),(17,1,'Django',5.00,45.00),(18,15,'Triple Frontier',4.50,40.00);
/*!40000 ALTER TABLE `Video` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `VideoCopy`
--

LOCK TABLES `VideoCopy` WRITE;
/*!40000 ALTER TABLE `VideoCopy` DISABLE KEYS */;
INSERT INTO `VideoCopy` VALUES (1,1,3,'A'),(1,2,2,'A'),(1,3,2,'A'),(1,4,1,'U'),(2,1,3,'A'),(2,2,1,'A'),(3,1,3,'A'),(3,2,3,'A'),(4,1,2,'A'),(5,1,3,'A'),(6,1,3,'A'),(6,2,1,'R'),(7,1,3,'R'),(7,2,2,'A'),(8,1,2,'A'),(8,2,2,'A'),(9,1,2,'A'),(9,2,2,'A'),(9,3,1,'A'),(9,4,2,'U'),(9,5,2,'U'),(10,1,1,'A'),(12,1,1,'A'),(13,3,2,'A'),(13,4,2,'A'),(13,8,4,'U'),(13,9,4,'A'),(14,1,1,'R'),(14,6,1,'A'),(15,1,1,'R'),(16,1,3,'A'),(16,2,3,'A'),(17,7,1,'A'),(18,4,3,'A'),(18,7,4,'A'),(18,8,4,'U'),(18,9,4,'A'),(18,10,1,'A');
/*!40000 ALTER TABLE `VideoCopy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Video_Category`
--

LOCK TABLES `Video_Category` WRITE;
/*!40000 ALTER TABLE `Video_Category` DISABLE KEYS */;
INSERT INTO `Video_Category` VALUES (11,1),(12,1),(2,2),(6,2),(9,2),(10,2),(15,2),(18,2),(6,4),(10,4),(18,4),(2,5),(6,5),(10,5),(1,6),(3,6),(4,6),(5,6),(7,6),(8,6),(11,6),(12,6),(13,6),(14,6),(16,6),(17,6),(13,7),(16,7),(2,8),(4,8),(5,8),(6,8),(7,8),(9,8),(11,8),(15,8),(5,9),(7,9),(8,9),(13,9),(16,9),(18,9),(1,10),(2,10),(3,10),(5,10),(15,10);
/*!40000 ALTER TABLE `Video_Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Video_Rental`
--

LOCK TABLES `Video_Rental` WRITE;
/*!40000 ALTER TABLE `Video_Rental` DISABLE KEYS */;
INSERT INTO `Video_Rental` VALUES (1,1,1,'2019-01-22'),(1,2,1,'2019-01-30'),(2,3,1,'2019-02-13'),(3,5,1,'2019-10-15'),(3,16,1,'2019-10-14'),(4,18,4,'2019-03-05'),(5,8,2,'2019-04-13'),(5,13,3,'2019-04-15'),(5,13,4,'2019-03-30'),(6,7,2,'2019-04-15'),(6,8,1,'2019-04-07'),(7,1,2,'2020-04-22'),(8,3,1,'2020-05-10'),(9,4,1,'2020-05-19'),(10,10,1,'2020-05-30'),(11,5,1,'2020-05-25'),(11,6,1,'2020-05-25'),(11,7,1,NULL),(12,1,2,'2020-06-06'),(12,5,1,NULL),(12,10,1,'2020-06-06'),(13,7,2,NULL),(14,4,1,'2020-08-10'),(15,6,2,NULL),(15,12,1,'2020-08-22'),(15,14,1,NULL),(15,15,1,NULL);
/*!40000 ALTER TABLE `Video_Rental` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-20 13:59:27
