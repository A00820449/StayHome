/*Desplegar el nombre del actor y pelicula junto a los directores ordenados por directores pertenecientes a las peliculas con el actor mas repetido en el catalogo*/
SELECT
Director.Name,
ACTOR.Name, Video.Ttitle, MAX(Actor_Video.ActorID COUNT (*) AS apariciones) AS maximo, Actor_Video.CatalogNo, Video.CatalogNo, Director.DirectorID, Video.DirectorID
FROM
Video, Actor_Video, Director,
Actor
WHERE
Actor_Video.ActorID = maximo
AND
Actor.ActorID = Actor_Video
AND 
Actor_Video.CatalogNo = Video.CatalogNo
AND
Director.DirectorID = Video.DirectorID
ORDERED BY
Director.DirectorName