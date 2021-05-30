/*¿En qué ciudad está ubicada la Branch donde se paga más por concepto de salario?*/
SELECT Branch.Address_City
FROM Branch
WHERE BranchNo = (
    SELECT Staff.BranchNo
    FROM Branch, Staff
    WHERE Branch.BranchNo = Staff.BranchNo
    GROUP BY Staff.BranchNo
    ORDER BY SUM(Salary) DESC
    LIMIT 1
)
