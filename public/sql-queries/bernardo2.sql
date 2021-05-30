/*Obtener el título, costo de renta, nombre de categoría y número de copia de los videos disponibles en el sistema.*/
SELECT
VideoCopy.VideoNo, Video_Category.CategoryName, Video.Title, Video.DailyRental
FROM VideoCopy,Video, Video_Category
WHERE Video.CatalogNo = VideoCopy.CatalogNo 
AND Video.CatalogNo = Video_Category.CatalogNo
AND VideoCopy.Status = 'D'
GROUP BY Category.CategoryName 
ORDER BY VideoCopy.VideoNo;