/*Desplegar en cuántas películas en el inventario de cada branch se encuentra el actor Chris Hemsworth.*/
SELECT Branch.BranchNo, Branch.Address_City,COUNT (*) AS Cantidad, Actor.Name
ORDER BY Branch.BranchNo;
