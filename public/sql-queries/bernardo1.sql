/*Desplegar el título de las películas dentro del sistema, con su num de catálogo, ordenados de manera ascendente por precio de renta.*/
SELECT CatalogNo, Title, DailyRental
FROM Video
ORDER BY DailyRental;