/*Obtener el título de las películas más rentadas por cada género, junto con la cantidad de veces que ha sido rentada por estos:*/
SELECT Title, Video_Grouped.Gender, Video_Grouped.C
FROM (
    SELECT Gender, MAX(C) AS Max_C
    FROM (
        SELECT Gender, COUNT(CatalogNo) AS C
        FROM Video_Rental
        LEFT JOIN Rental
        ON Video_Rental.RentalNo = Rental.RentalNo
        LEFT JOIN Member
        ON Rental.MemberNo = Member.MemberNo
        GROUP BY CatalogNo, Gender
    ) AS Video_Grouped
    GROUP BY Gender
) AS Max_Count
LEFT JOIN (
    SELECT Gender, CatalogNo, COUNT(CatalogNo) AS C
    FROM Video_Rental
    LEFT JOIN Rental
    ON Video_Rental.RentalNo = Rental.RentalNo
    LEFT JOIN Member
    ON Rental.MemberNo = Member.MemberNo
    GROUP BY CatalogNo, Gender
) AS Video_Grouped
ON Video_Grouped.Gender = Max_Count.Gender
AND Video_Grouped.C = Max_Count.Max_C
LEFT JOIN Video
ON Video_Grouped.CatalogNo = Video.CatalogNo
ORDER BY Video_Grouped.Gender;

