/*Desplegar las películas con un daily rental de más de 5.5*/
SELECT Title, DailyRental
FROM Video
WHERE Video.DailyRental > 5.5