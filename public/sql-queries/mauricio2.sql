/*¿Cuál es el DailyRental promedio de las películas por nombre de categoría ordenadas de forma descendiente?*/
SELECT CategoryName, AVG(DailyRental)
FROM  Category, Video_Category, Video 
WHERE Category.CategoryID = Video_Category.CategoryID
AND Video.CatalogNo = Video_Category.CatalogNo
GROUP BY Category.CategoryName
ORDER BY AVG(DailyRental) DESC