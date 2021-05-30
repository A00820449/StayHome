/*Obtener los nombres de los directores en el sistema y la cantidad de películas en el catálogo que han dirigido, ordenados de mayor a menor:*/
SELECT Name, COUNT(CatalogNo) FROM Video
LEFT JOIN Director
ON Video.DirectorID = Director.DirectorID
GROUP BY Name 
ORDER BY COUNT(CatalogNo) DESC;