/*Desplegar los nombres y teléfonos de los miembros que tienen más de 3 videos en renta ordenados por quienes tienen más rentas*/
SELECT Member.FirstName, Member.LastName, Member.TelephoneNum,
Member.MemberNo Rental.MemberNo COUNT(*) AS cantidadRentas,
FROM Member, Rental
WHERE cantidadRentas > 3
AND 
Rental.MemberNo = Member.MemberNo
ORDERED BY
cantidadRentas