/*Desplegar las películas que están actualmente siendo rentadas por hombres.*/
SELECT Video.CatalogNo, Video.Title, VideoCopy.Status, Member.MemberNo, Member.FirstName, Member.LastName, Member.Gender 
FROM Video, VideoCopy, Member, Video_Rental, Rental
WHERE VideoCopy.Status='U'
AND
Member.Gender='M'
AND
VideoCopy.CatalogNo = Video.CatalogNo
AND
Video_Rental.CatalogNo = Video.CatalogNo
AND
Video_Rental.RentalNo = Rental.RentalNo
AND Member.MemberNo = Rental.MemberNo
ORDER BY Video.CatalogNo;