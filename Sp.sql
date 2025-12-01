use AnamSheeps;

ALTER PROCEDURE SP_GetDailyMovementData
    @UserId NVARCHAR(450),
    @TargetDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    SELECT * 
    FROM TblDailyMovements
    WHERE DailyMovement_UserID = @UserId
      AND DailyMovement_Date = @TargetDate
      AND DailyMovement_Visible = 'yes';

    SELECT d.*, p.Product_Name
    FROM TblDailyMovementDetails d
    LEFT JOIN TblProduct p ON p.Product_ID = d.DailyMovementDetails_ProductID
    WHERE d.DailyMovementDetails_MovementID IN (
        SELECT DailyMovement_ID FROM TblDailyMovements
        WHERE DailyMovement_UserID = @UserId
          AND DailyMovement_Date = @TargetDate
          AND DailyMovement_Visible = 'yes'
    )
    AND d.DailyMovementDetails_Visible = 'yes';

    SELECT s.*, p.Product_Name
    FROM TblDailyMovementSales s
    LEFT JOIN TblProduct p ON p.Product_ID = s.DailyMovementSales_ProductID
    WHERE s.DailyMovementSales_MovementID IN (
        SELECT DailyMovement_ID FROM TblDailyMovements
        WHERE DailyMovement_UserID = @UserId
          AND DailyMovement_Date = @TargetDate
          AND DailyMovement_Visible = 'yes'
    )
    AND s.DailyMovementSales_Visible = 'yes';

    SELECT * 
    FROM TblDailyMovementExpenses
    WHERE DailyMovementExpense_MovementID IN (
        SELECT DailyMovement_ID FROM TblDailyMovements
        WHERE DailyMovement_UserID = @UserId
          AND DailyMovement_Date = @TargetDate
          AND DailyMovement_Visible = 'yes'
    )
    AND DailyMovementExpense_Visible = 'yes';

    SELECT *
    FROM TblDailyMovementSuppliers
    WHERE DailyMovementSupplier_MovementID IN (
        SELECT DailyMovement_ID FROM TblDailyMovements
        WHERE DailyMovement_UserID = @UserId
          AND DailyMovement_Date = @TargetDate
          AND DailyMovement_Visible = 'yes'
    )
    AND DailyMovementSupplier_Visible = 'yes';

    SELECT *
    FROM TblDailyMovementCustomers
    WHERE DailyMovementCustomer_MovementID IN (
        SELECT DailyMovement_ID FROM TblDailyMovements
        WHERE DailyMovement_UserID = @UserId
          AND DailyMovement_Date = @TargetDate
          AND DailyMovement_Visible = 'yes'
    )
    AND DailyMovementCustomer_Visible = 'yes';

    SELECT *
    FROM TblDailyMovementTaslim
    WHERE DailyMovementTaslim_MovementID IN (
        SELECT DailyMovement_ID FROM TblDailyMovements
        WHERE DailyMovement_UserID = @UserId
          AND DailyMovement_Date = @TargetDate
          AND DailyMovement_Visible = 'yes'
    )
    AND DailyMovementTaslim_Visible = 'yes';

    SELECT *
    FROM TblDailyMovementWarid
    WHERE DailyMovementWarid_MovementID IN (
        SELECT DailyMovement_ID FROM TblDailyMovements
        WHERE DailyMovement_UserID = @UserId
          AND DailyMovement_Date = @TargetDate
          AND DailyMovement_Visible = 'yes'
    )
    AND DailyMovementWarid_Visible = 'yes';

    SELECT *
    FROM TblDailyMovementBalances
    WHERE DailyMovementBalance_MovementID IN (
        SELECT DailyMovement_ID FROM TblDailyMovements
        WHERE DailyMovement_UserID = @UserId
          AND DailyMovement_Date = @TargetDate
          AND DailyMovement_Visible = 'yes'
    )
    AND DailyMovementBalance_Visible = 'yes';

    SELECT TOP 1 DailyMovement_FinalBalance
    FROM TblDailyMovements
    WHERE DailyMovement_UserID = @UserId
      AND DailyMovement_Visible = 'yes'
      AND DailyMovement_Date < @TargetDate
    ORDER BY DailyMovement_Date DESC;
END
GO

ALTER PROCEDURE SP_SaveDailyMovementComplete
    @UserId NVARCHAR(450),
    @TargetDate DATE,
    @DetailsJson NVARCHAR(MAX) = NULL,
    @SalesJson NVARCHAR(MAX) = NULL,
    @ExpensesJson NVARCHAR(MAX) = NULL,
    @SuppliersJson NVARCHAR(MAX) = NULL,
    @CustomersJson NVARCHAR(MAX) = NULL,
    @TaslimJson NVARCHAR(MAX) = NULL,
    @WaridJson NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;
    
    BEGIN TRY
        DECLARE @MovementId INT;
        
        SELECT @MovementId = DailyMovement_ID 
        FROM TblDailyMovements
        WHERE DailyMovement_UserID = @UserId 
            AND CAST(DailyMovement_Date AS DATE) = @TargetDate
            AND DailyMovement_Visible = 'yes';
        
        IF @MovementId IS NULL
        BEGIN
            INSERT INTO TblDailyMovements (
                DailyMovement_Date,
                DailyMovement_UserID,
                DailyMovement_Visible,
                DailyMovement_AddDate,
                DailyMovement_FinalBalance
            )
            VALUES (
                @TargetDate,
                @UserId,
                'yes',
                GETDATE(),
                0
            );
            
            SET @MovementId = SCOPE_IDENTITY();
        END
        ELSE
        BEGIN
            UPDATE TblDailyMovementDetails SET DailyMovementDetails_Visible = 'no' WHERE DailyMovementDetails_MovementID = @MovementId;
            UPDATE TblDailyMovementSales SET DailyMovementSales_Visible = 'no' WHERE DailyMovementSales_MovementID = @MovementId;
            UPDATE TblDailyMovementExpenses SET DailyMovementExpense_Visible = 'no' WHERE DailyMovementExpense_MovementID = @MovementId;
            UPDATE TblDailyMovementSuppliers SET DailyMovementSupplier_Visible = 'no' WHERE DailyMovementSupplier_MovementID = @MovementId;
            UPDATE TblDailyMovementCustomers SET DailyMovementCustomer_Visible = 'no' WHERE DailyMovementCustomer_MovementID = @MovementId;
            UPDATE TblDailyMovementTaslim SET DailyMovementTaslim_Visible = 'no' WHERE DailyMovementTaslim_MovementID = @MovementId;
            UPDATE TblDailyMovementWarid SET DailyMovementWarid_Visible = 'no' WHERE DailyMovementWarid_MovementID = @MovementId;
            UPDATE TblDailyMovementBalances SET DailyMovementBalance_Visible = 'no' WHERE DailyMovementBalance_MovementID = @MovementId;
        END
        
        IF @DetailsJson IS NOT NULL AND @DetailsJson != '[]' AND LEN(@DetailsJson) > 2
        BEGIN
            INSERT INTO TblDailyMovementDetails (
                DailyMovementDetails_MovementID, DailyMovementDetails_ProductID, DailyMovementDetails_Quantity,
                DailyMovementDetails_Price, DailyMovementDetails_Total, DailyMovementDetails_PaymentType,
                DailyMovementDetails_Notes, DailyMovementDetails_Visible
            )
            SELECT 
                @MovementId, ProductID, Quantity, Price, Total, PaymentType, ISNULL(Notes, ''), 'yes'
            FROM OPENJSON(@DetailsJson)
            WITH (
                ProductID INT '$.DailyMovementDetails_ProductID',
                Quantity INT '$.DailyMovementDetails_Quantity',
                Price DECIMAL(18,2) '$.DailyMovementDetails_Price',
                Total DECIMAL(18,2) '$.DailyMovementDetails_Total',
                PaymentType NVARCHAR(50) '$.DailyMovementDetails_PaymentType',
                Notes NVARCHAR(MAX) '$.DailyMovementDetails_Notes'
            );
        END
        
        IF @SalesJson IS NOT NULL AND @SalesJson != '[]' AND LEN(@SalesJson) > 2
        BEGIN
            INSERT INTO TblDailyMovementSales (
                DailyMovementSales_MovementID, DailyMovementSales_ProductID, DailyMovementSales_Quantity,
                DailyMovementSales_Price, DailyMovementSales_Total, DailyMovementSales_PaymentType,
                DailyMovementSales_Notes, DailyMovementSales_Visible
            )
            SELECT 
                @MovementId, ProductID, Quantity, Price, Total, PaymentType, ISNULL(Notes, ''), 'yes'
            FROM OPENJSON(@SalesJson)
            WITH (
                ProductID INT '$.DailyMovementSales_ProductID',
                Quantity INT '$.DailyMovementSales_Quantity',
                Price DECIMAL(18,2) '$.DailyMovementSales_Price',
                Total DECIMAL(18,2) '$.DailyMovementSales_Total',
                PaymentType NVARCHAR(50) '$.DailyMovementSales_PaymentType',
                Notes NVARCHAR(MAX) '$.DailyMovementSales_Notes'
            );
        END
        
        IF @ExpensesJson IS NOT NULL AND @ExpensesJson != '[]' AND LEN(@ExpensesJson) > 2
        BEGIN
            INSERT INTO TblDailyMovementExpenses (
                DailyMovementExpense_MovementID, DailyMovementExpense_CategoryID, DailyMovementExpense_CategoryName,
                DailyMovementExpense_Quantity, DailyMovementExpense_Amount, DailyMovementExpense_Total,
                DailyMovementExpense_Notes, DailyMovementExpense_Visible
            )
            SELECT 
                @MovementId, CategoryID, ISNULL(CategoryName, ''), Quantity, Amount, Total, ISNULL(Notes, ''), 'yes'
            FROM OPENJSON(@ExpensesJson)
            WITH (
                CategoryID INT '$.DailyMovementExpense_CategoryID',
                CategoryName NVARCHAR(200) '$.ExpenseCategory_Name',
                Quantity INT '$.DailyMovementExpense_Quantity',
                Amount DECIMAL(18,2) '$.DailyMovementExpense_Amount',
                Total DECIMAL(18,2) '$.DailyMovementExpense_Total',
                Notes NVARCHAR(MAX) '$.DailyMovementExpense_Notes'
            );
        END
        
        IF @SuppliersJson IS NOT NULL AND @SuppliersJson != '[]' AND LEN(@SuppliersJson) > 2
        BEGIN
            INSERT INTO TblDailyMovementSuppliers (
                DailyMovementSupplier_MovementID, DailyMovementSupplier_SupplierID,
                DailyMovementSupplier_SupplierName, DailyMovementSupplier_Amount,
                DailyMovementSupplier_Notes, DailyMovementSupplier_Visible
            )
            SELECT 
                @MovementId, SupplierID, ISNULL(SupplierName, ''), Amount, ISNULL(Notes, ''), 'yes'
            FROM OPENJSON(@SuppliersJson)
            WITH (
                SupplierID INT '$.DailyMovementSupplier_SupplierID',
                SupplierName NVARCHAR(200) '$.Supplier_Name',
                Amount DECIMAL(18,2) '$.DailyMovementSupplier_Amount',
                Notes NVARCHAR(MAX) '$.DailyMovementSupplier_Notes'
            );
        END
        
        IF @CustomersJson IS NOT NULL AND @CustomersJson != '[]' AND LEN(@CustomersJson) > 2
        BEGIN
            INSERT INTO TblDailyMovementCustomers (
                DailyMovementCustomer_MovementID, DailyMovementCustomer_CustomerID,
                DailyMovementCustomer_CustomerName, DailyMovementCustomer_Amount,
                DailyMovementCustomer_Notes, DailyMovementCustomer_Visible
            )
            SELECT 
                @MovementId, CustomerID, ISNULL(CustomerName, ''), Amount, ISNULL(Notes, ''), 'yes'
            FROM OPENJSON(@CustomersJson)
            WITH (
                CustomerID INT '$.DailyMovementCustomer_CustomerID',
                CustomerName NVARCHAR(200) '$.Customer_Name',
                Amount DECIMAL(18,2) '$.DailyMovementCustomer_Amount',
                Notes NVARCHAR(MAX) '$.DailyMovementCustomer_Notes'
            );
        END
        
        IF @TaslimJson IS NOT NULL AND @TaslimJson != '[]' AND LEN(@TaslimJson) > 2
        BEGIN
            INSERT INTO TblDailyMovementTaslim (
                DailyMovementTaslim_MovementID, DailyMovementTaslim_Receiver,
                DailyMovementTaslim_Amount, DailyMovementTaslim_Notes, DailyMovementTaslim_Visible
            )
            SELECT 
                @MovementId, Receiver, Amount, ISNULL(Notes, ''), 'yes'
            FROM OPENJSON(@TaslimJson)
            WITH (
                Receiver NVARCHAR(200) '$.DailyMovementTaslim_Receiver',
                Amount DECIMAL(18,2) '$.DailyMovementTaslim_Amount',
                Notes NVARCHAR(MAX) '$.DailyMovementTaslim_Notes'
            );
        END
        
        IF @WaridJson IS NOT NULL AND @WaridJson != '[]' AND LEN(@WaridJson) > 2
        BEGIN
            INSERT INTO TblDailyMovementWarid (
                DailyMovementWarid_MovementID, DailyMovementWarid_Receiver,
                DailyMovementWarid_Amount, DailyMovementWarid_Notes, DailyMovementWarid_Visible
            )
            SELECT 
                @MovementId, Receiver, Amount, ISNULL(Notes, ''), 'yes'
            FROM OPENJSON(@WaridJson)
            WITH (
                Receiver NVARCHAR(200) '$.DailyMovementWarid_Receiver',
                Amount DECIMAL(18,2) '$.DailyMovementWarid_Amount',
                Notes NVARCHAR(MAX) '$.DailyMovementWarid_Notes'
            );
        END
        
        COMMIT TRANSACTION;
        SELECT @MovementId AS MovementId;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

ALTER PROCEDURE SP_RecalculateBalances
    @UserId NVARCHAR(450),
    @FromDate DATE
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @MovementId INT;
    DECLARE @MovementDate DATE;
    DECLARE @PreviousBalance DECIMAL(18,2);
    DECLARE @CashSales DECIMAL(18,2);
    DECLARE @CustomerPayments DECIMAL(18,2);
    DECLARE @CashPurchases DECIMAL(18,2);
    DECLARE @SupplierPayments DECIMAL(18,2);
    DECLARE @Expenses DECIMAL(18,2);
    DECLARE @Taslim DECIMAL(18,2);
    DECLARE @Warid DECIMAL(18,2);
    DECLARE @FinalBalance DECIMAL(18,2);
    
    DECLARE movement_cursor CURSOR FOR
    SELECT DailyMovement_ID, DailyMovement_Date
    FROM TblDailyMovements
    WHERE DailyMovement_UserID = @UserId
        AND DailyMovement_Date >= @FromDate
        AND DailyMovement_Visible = 'yes'
    ORDER BY DailyMovement_Date;
    
    OPEN movement_cursor;
    FETCH NEXT FROM movement_cursor INTO @MovementId, @MovementDate;
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SELECT TOP 1 @PreviousBalance = ISNULL(DailyMovement_FinalBalance, 0)
        FROM TblDailyMovements
        WHERE DailyMovement_UserID = @UserId
            AND DailyMovement_Date < @MovementDate
            AND DailyMovement_Visible = 'yes'
        ORDER BY DailyMovement_Date DESC;
        
        SET @PreviousBalance = ISNULL(@PreviousBalance, 0);
        
        SELECT @CashSales = ISNULL(SUM(DailyMovementSales_Total), 0)
        FROM TblDailyMovementSales
        WHERE DailyMovementSales_MovementID = @MovementId
            AND DailyMovementSales_Visible = 'yes'
            AND DailyMovementSales_PaymentType = N'نقدا';
        
        SELECT @CustomerPayments = ISNULL(SUM(DailyMovementCustomer_Amount), 0)
        FROM TblDailyMovementCustomers
        WHERE DailyMovementCustomer_MovementID = @MovementId
            AND DailyMovementCustomer_Visible = 'yes';
        
        SELECT @CashPurchases = ISNULL(SUM(DailyMovementDetails_Total), 0)
        FROM TblDailyMovementDetails
        WHERE DailyMovementDetails_MovementID = @MovementId
            AND DailyMovementDetails_Visible = 'yes'
            AND DailyMovementDetails_PaymentType = N'نقدا';
        
        SELECT @SupplierPayments = ISNULL(SUM(DailyMovementSupplier_Amount), 0)
        FROM TblDailyMovementSuppliers
        WHERE DailyMovementSupplier_MovementID = @MovementId
            AND DailyMovementSupplier_Visible = 'yes';
        
        SELECT @Expenses = ISNULL(SUM(DailyMovementExpense_Total), 0)
        FROM TblDailyMovementExpenses
        WHERE DailyMovementExpense_MovementID = @MovementId
            AND DailyMovementExpense_Visible = 'yes';
        
        SELECT @Taslim = ISNULL(SUM(DailyMovementTaslim_Amount), 0)
        FROM TblDailyMovementTaslim
        WHERE DailyMovementTaslim_MovementID = @MovementId
            AND DailyMovementTaslim_Visible = 'yes';
        
        SELECT @Warid = ISNULL(SUM(DailyMovementWarid_Amount), 0)
        FROM TblDailyMovementWarid
        WHERE DailyMovementWarid_MovementID = @MovementId
            AND DailyMovementWarid_Visible = 'yes';
        
        SET @FinalBalance = @PreviousBalance + @CashSales + @CustomerPayments + @Warid 
                           - (@CashPurchases + @SupplierPayments + @Expenses + @Taslim);
        
        UPDATE TblDailyMovements
        SET DailyMovement_FinalBalance = @FinalBalance
        WHERE DailyMovement_ID = @MovementId;
        
        UPDATE TblDailyMovementBalances
        SET DailyMovementBalance_Visible = 'no'
        WHERE DailyMovementBalance_MovementID = @MovementId;
        
        INSERT INTO TblDailyMovementBalances (
            DailyMovementBalance_MovementID, DailyMovementBalance_Type,
            DailyMovementBalance_Amount, DailyMovementBalance_Visible
        )
        VALUES
            (@MovementId, N'رصيد سابق', @PreviousBalance, 'yes'),
            (@MovementId, N'مبلغ وارد من الإدارة +', @Warid, 'yes'),
            (@MovementId, N'مبلغ وارد من المبيعات +', @CashSales, 'yes'),
            (@MovementId, N'مبلغ وارد سداد عميل +', @CustomerPayments, 'yes'),
            (@MovementId, N'مبلغ مسحوب تسليم للإدارة -', @Taslim, 'yes'),
            (@MovementId, N'مبلغ صادر مشتريات -', @CashPurchases, 'yes'),
            (@MovementId, N'مبلغ صادر سداد وارد -', @SupplierPayments, 'yes'),
            (@MovementId, N'إجمالي المصروفات -', @Expenses, 'yes');
        
        FETCH NEXT FROM movement_cursor INTO @MovementId, @MovementDate;
    END;
    
    CLOSE movement_cursor;
    DEALLOCATE movement_cursor;
END
GO

--------------
ALTER PROCEDURE SP_GetWarehouseMovementData
    @UserId NVARCHAR(450),
    @TargetDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM TblWarehouseMovement
    WHERE WarehouseMovement_UserID = @UserId
      AND WarehouseMovement_Date  = @TargetDate
      AND WarehouseMovement_Visible = 'Yes';

    SELECT m.*, p.Product_Name
    FROM TblWarehouseMortality m
    LEFT JOIN TblProduct p ON p.Product_ID = m.WarehouseMortality_ProductID
    WHERE m.WarehouseMortality_MovementID IN (
        SELECT WarehouseMovement_ID
        FROM TblWarehouseMovement
        WHERE WarehouseMovement_UserID = @UserId
          AND WarehouseMovement_Date  = @TargetDate
          AND WarehouseMovement_Visible = 'Yes'
    )
    AND m.WarehouseMortality_Visible = 'Yes';

    SELECT l.*, p.Product_Name
    FROM TblWarehouseLivestock l
    LEFT JOIN TblProduct p ON p.Product_ID = l.WarehouseLivestock_ProductID
    WHERE l.WarehouseLivestock_MovementID IN (
        SELECT WarehouseMovement_ID
        FROM TblWarehouseMovement
        WHERE WarehouseMovement_UserID = @UserId
          AND CAST(WarehouseMovement_Date AS DATE) = @TargetDate
          AND WarehouseMovement_Visible = 'Yes'
    )
    AND l.WarehouseLivestock_Visible = 'Yes';

    SELECT o.*, p.Product_Name
    FROM TblWarehouseOutgoing o
    LEFT JOIN TblProduct p ON p.Product_ID = o.WarehouseOutgoing_ProductID
    WHERE o.WarehouseOutgoing_MovementID IN (
        SELECT WarehouseMovement_ID
        FROM TblWarehouseMovement
        WHERE WarehouseMovement_UserID = @UserId
          AND CAST(WarehouseMovement_Date AS DATE) = @TargetDate
          AND WarehouseMovement_Visible = 'Yes'
    )
    AND o.WarehouseOutgoing_Visible = 'Yes';

    SELECT Product_ID, Product_Name
    FROM TblProduct
    WHERE Product_Visible = 'Yes'
    ORDER BY Product_Name;

    SELECT Id, UserName
    FROM AspNetUsers
    WHERE UserType = N'مندوب'
      AND Visible = 'Yes'
    ORDER BY UserName;

END
GO

ALTER PROCEDURE SP_SaveWarehouseMovement
    @UserId NVARCHAR(450),
    @TargetDate DATE,
    @MortalitiesJson NVARCHAR(MAX) = NULL,
    @LivestocksJson NVARCHAR(MAX) = NULL,
    @OutgoingsJson NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRANSACTION;

    BEGIN TRY
        DECLARE @MovementId INT;

        SELECT @MovementId = WarehouseMovement_ID
        FROM TblWarehouseMovement
        WHERE WarehouseMovement_UserID = @UserId
          AND CAST(WarehouseMovement_Date AS DATE) = @TargetDate
          AND WarehouseMovement_Visible = 'Yes';

        IF @MovementId IS NULL
        BEGIN
            INSERT INTO TblWarehouseMovement (
                WarehouseMovement_Date,
                WarehouseMovement_UserID,
                WarehouseMovement_Visible,
                WarehouseMovement_AddDate
            )
            VALUES (
                @TargetDate,
                @UserId,
                'Yes',
                GETDATE()
            );

            SET @MovementId = SCOPE_IDENTITY();
        END
        ELSE
        BEGIN
            UPDATE TblWarehouseMortality 
            SET WarehouseMortality_Visible = 'No' 
            WHERE WarehouseMortality_MovementID = @MovementId;

            UPDATE TblWarehouseLivestock 
            SET WarehouseLivestock_Visible = 'No' 
            WHERE WarehouseLivestock_MovementID = @MovementId;

            UPDATE TblWarehouseOutgoing 
            SET WarehouseOutgoing_Visible = 'No' 
            WHERE WarehouseOutgoing_MovementID = @MovementId;

            UPDATE TblWarehouseMovement
            SET WarehouseMovement_EditDate = GETDATE()
            WHERE WarehouseMovement_ID = @MovementId;
        END

        IF @MortalitiesJson IS NOT NULL AND @MortalitiesJson != '[]' AND LEN(@MortalitiesJson) > 2
        BEGIN
            INSERT INTO TblWarehouseMortality (
                WarehouseMortality_MovementID,
                WarehouseMortality_ProductID,
                WarehouseMortality_Quantity,
                WarehouseMortality_Notes,
                WarehouseMortality_Visible,
                WarehouseMortality_AddDate
            )
            SELECT 
                @MovementId, ProductID, Quantity, ISNULL(Notes, ''), 'Yes', GETDATE()
            FROM OPENJSON(@MortalitiesJson)
            WITH (
                ProductID INT '$.WarehouseMortality_ProductID',
                Quantity INT '$.WarehouseMortality_Quantity',
                Notes NVARCHAR(MAX) '$.WarehouseMortality_Notes'
            );
        END

        IF @LivestocksJson IS NOT NULL AND @LivestocksJson != '[]' AND LEN(@LivestocksJson) > 2
        BEGIN
            INSERT INTO TblWarehouseLivestock (
                WarehouseLivestock_MovementID,
                WarehouseLivestock_ProductID,
                WarehouseLivestock_Quantity,
                WarehouseLivestock_Notes,
                WarehouseLivestock_Visible,
                WarehouseLivestock_AddDate
            )
            SELECT 
                @MovementId, ProductID, Quantity, ISNULL(Notes, ''), 'Yes', GETDATE()
            FROM OPENJSON(@LivestocksJson)
            WITH (
                ProductID INT '$.WarehouseLivestock_ProductID',
                Quantity INT '$.WarehouseLivestock_Quantity',
                Notes NVARCHAR(MAX) '$.WarehouseLivestock_Notes'
            );
        END

        IF @OutgoingsJson IS NOT NULL AND @OutgoingsJson != '[]' AND LEN(@OutgoingsJson) > 2
        BEGIN
            INSERT INTO TblWarehouseOutgoing (
                WarehouseOutgoing_MovementID,
                WarehouseOutgoing_DelegateName,
                WarehouseOutgoing_ProductID,
                WarehouseOutgoing_Quantity,
                WarehouseOutgoing_Notes,
                WarehouseOutgoing_Visible,
                WarehouseOutgoing_AddDate
            )
            SELECT 
                @MovementId, DelegateName, ProductID, Quantity, ISNULL(Notes, ''), 'Yes', GETDATE()
            FROM OPENJSON(@OutgoingsJson)
            WITH (
                DelegateName NVARCHAR(200) '$.WarehouseOutgoing_DelegateName',
                ProductID INT '$.WarehouseOutgoing_ProductID',
                Quantity INT '$.WarehouseOutgoing_Quantity',
                Notes NVARCHAR(MAX) '$.WarehouseOutgoing_Notes'
            );
        END

        COMMIT TRANSACTION;
        SELECT @MovementId AS MovementId;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

--------------

ALTER PROCEDURE SP_GetDailyMovementsTracking
    @TargetDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM AspNetUsers
    WHERE Visible = 'Yes'
    ORDER BY UserName;

    SELECT 
        dm.*
    FROM TblDailyMovements dm
    INNER JOIN AspNetUsers u ON u.Id = dm.DailyMovement_UserID
    WHERE dm.DailyMovement_Date = @TargetDate
      AND dm.DailyMovement_Visible = 'yes'
      AND u.Visible = 'Yes';

    SELECT 
        dm.*
    FROM TblDailyMovements dm
    INNER JOIN AspNetUsers u ON u.Id = dm.DailyMovement_UserID
    WHERE dm.DailyMovement_Visible = 'yes'
      AND u.Visible = 'Yes'
      AND dm.DailyMovement_Date = (
            SELECT TOP 1 DailyMovement_Date
            FROM TblDailyMovements
            WHERE DailyMovement_UserID = dm.DailyMovement_UserID
              AND DailyMovement_Visible = 'yes'
              AND DailyMovement_Date < @TargetDate
            ORDER BY DailyMovement_Date DESC
      );

END
GO


ALTER PROCEDURE SP_ViewDailyMovement
    @MovementId INT
AS
BEGIN
    SET NOCOUNT ON;


    SELECT *
    FROM TblDailyMovements
    WHERE DailyMovement_ID = @MovementId
      AND DailyMovement_Visible = 'yes';

    SELECT d.*, p.Product_Name
    FROM TblDailyMovementDetails d
    LEFT JOIN TblProduct p ON p.Product_ID = d.DailyMovementDetails_ProductID
    WHERE d.DailyMovementDetails_MovementID = @MovementId
      AND d.DailyMovementDetails_Visible = 'yes';

    SELECT s.*, p.Product_Name
    FROM TblDailyMovementSales s
    LEFT JOIN TblProduct p ON p.Product_ID = s.DailyMovementSales_ProductID
    WHERE s.DailyMovementSales_MovementID = @MovementId
      AND s.DailyMovementSales_Visible = 'yes';

    SELECT *
    FROM TblDailyMovementExpenses
    WHERE DailyMovementExpense_MovementID = @MovementId
      AND DailyMovementExpense_Visible = 'yes';


    SELECT *
    FROM TblDailyMovementSuppliers
    WHERE DailyMovementSupplier_MovementID = @MovementId
      AND DailyMovementSupplier_Visible = 'yes';

    SELECT *
    FROM TblDailyMovementCustomers
    WHERE DailyMovementCustomer_MovementID = @MovementId
      AND DailyMovementCustomer_Visible = 'yes';

    SELECT *
    FROM TblDailyMovementWarid
    WHERE DailyMovementWarid_MovementID = @MovementId
      AND DailyMovementWarid_Visible = 'yes';


    SELECT *
    FROM TblDailyMovementTaslim
    WHERE DailyMovementTaslim_MovementID = @MovementId
      AND DailyMovementTaslim_Visible = 'yes';


    SELECT *
    FROM TblDailyMovementBalances
    WHERE DailyMovementBalance_MovementID = @MovementId
      AND DailyMovementBalance_Visible = 'yes';

END
GO


Alter PROCEDURE SP_ViewAllDailyMovements
    @TargetDate DATE
AS
BEGIN
    DECLARE @Movement TABLE (ID INT);

    INSERT INTO @Movement
    SELECT DailyMovement_ID
    FROM TblDailyMovements
    WHERE DailyMovement_Date = @TargetDate
      AND DailyMovement_Visible = 'yes';

    SELECT * 
    FROM TblDailyMovements
    WHERE DailyMovement_ID IN (SELECT ID FROM @Movement);

    SELECT d.*, p.*
    FROM TblDailyMovementDetails d
    JOIN TblProduct p ON d.DailyMovementDetails_ProductID = p.Product_ID
    JOIN @Movement m ON d.DailyMovementDetails_MovementID = m.ID
    WHERE d.DailyMovementDetails_Visible = 'yes';

    SELECT s.*, p.*
    FROM TblDailyMovementSales s
    JOIN TblProduct p ON s.DailyMovementSales_ProductID = p.Product_ID
    JOIN @Movement m ON s.DailyMovementSales_MovementID = m.ID
    WHERE s.DailyMovementSales_Visible = 'yes';

    SELECT e.*
    FROM TblDailyMovementExpenses e
    JOIN @Movement m ON e.DailyMovementExpense_MovementID = m.ID
    WHERE e.DailyMovementExpense_Visible = 'yes';

    SELECT s.*
    FROM TblDailyMovementSuppliers s
    JOIN @Movement m ON s.DailyMovementSupplier_MovementID = m.ID
    WHERE s.DailyMovementSupplier_Visible = 'yes';

    SELECT c.*
    FROM TblDailyMovementCustomers c
    JOIN @Movement m ON c.DailyMovementCustomer_MovementID = m.ID
    WHERE c.DailyMovementCustomer_Visible = 'yes';

    SELECT w.*
    FROM TblDailyMovementWarid w
    JOIN @Movement m ON w.DailyMovementWarid_MovementID = m.ID
    WHERE w.DailyMovementWarid_Visible = 'yes';

    SELECT t.*
    FROM TblDailyMovementTaslim t
    JOIN @Movement m ON t.DailyMovementTaslim_MovementID = m.ID
    WHERE t.DailyMovementTaslim_Visible = 'yes';

    SELECT b.*
    FROM TblDailyMovementBalances b
    JOIN @Movement m ON b.DailyMovementBalance_MovementID = m.ID
    WHERE b.DailyMovementBalance_Visible = 'yes';
END
