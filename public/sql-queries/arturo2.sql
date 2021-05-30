/*Desplegar actor, con el número de títulos en los que aparece de forma descendente*/
SELECT Name, COUNT(CatalogNo) FROM Actor_Video
LEFT JOIN Actor
ON Actor_Video.ActorID = Actor.ActorID
GROUP BY Name 
ORDER BY COUNT(CatalogNo);