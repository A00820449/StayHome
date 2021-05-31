/*Desplegar los staffs que tienen un salario mayor a 500.*/
SELECT Staff.StaffNo, Staff.Name, Staff.Salary
FROM Staff
WHERE Salary>500;