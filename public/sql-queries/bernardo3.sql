/*Mostrar el video más rentado entre los branches*/
SELECT Video.Title
FROM Video
WHERE CatalogNo in (
SELECT CatalogNo
FROM VideoCopy
WHERE VideoNo in (
SELECT VideoNo 
FROM Video_Rental
GROUP BY VideoNo 
ORDER BY count(VideoNo) DESC
)) Limit 1;
