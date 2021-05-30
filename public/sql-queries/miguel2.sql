SELECT Name, COUNT(CatalogNo) FROM Video
LEFT JOIN Director
ON Video.DirectorID = Director.DirectorID
GROUP BY Name 
ORDER BY COUNT(CatalogNo) DESC;