/*Obtener el título, miembro, costo de renta de los videos pendientes de regresar.*/
SELECT
Video.Title, Member.FirstName, Member.LastName, Video.DailyRental
FROM Video_Rental,Video, Member, Rental
WHERE Video.CatalogNo = Video_Rental.CatalogNo 
AND Video_Rental.RentalNo = Rental.RentalNo
AND
Rental.MemberNo = Member.MemberNo
AND Video_Rental.DateReturn = '\N'
GROUP BY Member.Name 
ORDER BY Member.MemberID;