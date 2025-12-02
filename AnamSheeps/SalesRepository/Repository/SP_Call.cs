using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SalesModel.IRepository;
using SalesModel.Models;
using SalesModel.ViewModels;
using SalesRepository.Data;
using System.Data;

namespace SalesRepository.Repository
{
    public class SP_Call : ISP_Call
    {
        private readonly SalesDBContext _db;
        private static string ConnectionString = "";

        public SP_Call(SalesDBContext db)
        {
            _db = db;
            ConnectionString = db.Database.GetDbConnection().ConnectionString;
        }

        public void Dispose()
        {
            _db.Dispose();
        }

        public void Execute(string procedureName, DynamicParameters param = null)
        {
            using (SqlConnection sqlCon = new SqlConnection(ConnectionString))
            {
                sqlCon.Open();
                sqlCon.Execute(procedureName, param, commandType: System.Data.CommandType.StoredProcedure);
            }
        }

        public IEnumerable<T> List<T>(string procedureName, DynamicParameters param = null)
        {
            using (SqlConnection sqlCon = new SqlConnection(ConnectionString))
            {
                sqlCon.Open();
                return sqlCon.Query<T>(procedureName, param, commandType: System.Data.CommandType.StoredProcedure);
            }
        }

        public Tuple<IEnumerable<T1>, IEnumerable<T2>> List<T1, T2>(string procedureName, DynamicParameters param = null)
        {
            using (SqlConnection sqlCon = new SqlConnection(ConnectionString))
            {
                sqlCon.Open();
                var result = SqlMapper.QueryMultiple(sqlCon, procedureName, param, commandType: System.Data.CommandType.StoredProcedure);
                var item1 = result.Read<T1>().ToList();
                var item2 = result.Read<T2>().ToList();


                if (item1 != null && item2 != null)
                {
                    return new Tuple<IEnumerable<T1>, IEnumerable<T2>>(item1, item2);
                }

            }

            return new Tuple<IEnumerable<T1>, IEnumerable<T2>>(new List<T1>(), new List<T2>());
        }

        public T OneRecord<T>(string procedureName, DynamicParameters param = null)
        {
            using (SqlConnection sqlCon = new SqlConnection(ConnectionString))
            {
                sqlCon.Open();
                var value = sqlCon.Query<T>(procedureName, param, commandType: System.Data.CommandType.StoredProcedure);
                return (T)Convert.ChangeType(value.FirstOrDefault(), typeof(T));
            }
        }

        public T Single<T>(string procedureName, DynamicParameters param = null)
        {
            using (SqlConnection sqlCon = new SqlConnection(ConnectionString))
            {
                sqlCon.Open();
                return (T)Convert.ChangeType(sqlCon.ExecuteScalar<T>(procedureName, param, commandType: System.Data.CommandType.StoredProcedure), typeof(T));
            }
        }

        public DailyMovementListSPResult DailyMovementList(string procedureName, DynamicParameters param = null)
        {
            using (SqlConnection sqlCon = new SqlConnection(ConnectionString))
            {
                sqlCon.Open();
                using (var multi = sqlCon.QueryMultiple(procedureName, param, commandType: CommandType.StoredProcedure))
                {
                    var result = new DailyMovementListSPResult();

                    result.Users = multi.Read<ModelUsers>().ToList();

                    result.TodayMovements = multi.Read<ModelDailyMovement>().ToList();

                    result.LastMovements = multi.Read<ModelDailyMovement>().ToList();

                    return result;
                }
            }
        }


        public DailyMovementSPResult ViewDailyMovement(string procedureName, DynamicParameters param)
        {
            using (var con = new SqlConnection(ConnectionString))
            {
                con.Open();

                using (var multi = con.QueryMultiple(procedureName, param, commandType: CommandType.StoredProcedure))
                {
                    var result = new DailyMovementSPResult();

                    result.OneMovement = multi.Read<ModelDailyMovement>().FirstOrDefault();
                    result.Details = multi.Read<ModelDailyMovementDetails>().ToList();
                    result.Sales = multi.Read<ModelDailyMovementSales>().ToList();
                    result.Expenses = multi.Read<ModelDailyMovementExpenses>().ToList();
                    result.Suppliers = multi.Read<ModelDailyMovementSuppliers>().ToList();
                    result.Customers = multi.Read<ModelDailyMovementCustomers>().ToList();
                    result.Warid = multi.Read<ModelDailyMovementWarid>().ToList();
                    result.Taslim = multi.Read<ModelDailyMovementTaslim>().ToList();
                    result.Balances = multi.Read<ModelDailyMovementBalances>().ToList();

                    return result;
                }
            }
        }

        public DailyMovementSPResult ViewAllDailyMovementsSP(string procedureName, DynamicParameters param)
        {
            using (var con = new SqlConnection(ConnectionString))
            {
                con.Open();
                using (var multi = con.QueryMultiple(procedureName, param, commandType: CommandType.StoredProcedure))
                {
                    var result = new DailyMovementSPResult();

                    result.Movement = multi.Read<ModelDailyMovement>().ToList();
                    result.Details = multi.Read<ModelDailyMovementDetails>().ToList();
                    result.Sales = multi.Read<ModelDailyMovementSales>().ToList();
                    result.Expenses = multi.Read<ModelDailyMovementExpenses>().ToList();
                    result.Suppliers = multi.Read<ModelDailyMovementSuppliers>().ToList();
                    result.Customers = multi.Read<ModelDailyMovementCustomers>().ToList();
                    result.Warid = multi.Read<ModelDailyMovementWarid>().ToList();
                    result.Taslim = multi.Read<ModelDailyMovementTaslim>().ToList();
                    result.Balances = multi.Read<ModelDailyMovementBalances>().ToList();
                    result.WarehouseMovement = multi.Read<ModelWarehouseMovement>().ToList();
                    result.Mortality = multi.Read<ModelWarehouseMortality>().ToList();

                    return result;
                }
            }
        }

        public DailyMovementSPResult MultiList(string procedureName, DynamicParameters param = null)
        {
            using (SqlConnection sqlCom = new SqlConnection(ConnectionString))
            {
                sqlCom.Open();
                using (var multi = sqlCom.QueryMultiple(procedureName, param, commandType: CommandType.StoredProcedure))
                {
                    var result = new DailyMovementSPResult
                    {
                        Movement = multi.Read<ModelDailyMovement>().ToList(),
                        Details = multi.Read<ModelDailyMovementDetails>().ToList(),
                        Sales = multi.Read<ModelDailyMovementSales>().ToList(),
                        Expenses = multi.Read<ModelDailyMovementExpenses>().ToList(),
                        Suppliers = multi.Read<ModelDailyMovementSuppliers>().ToList(),
                        Customers = multi.Read<ModelDailyMovementCustomers>().ToList(),
                        Taslim = multi.Read<ModelDailyMovementTaslim>().ToList(),
                        Warid = multi.Read<ModelDailyMovementWarid>().ToList(),
                        Balances = multi.Read<ModelDailyMovementBalances>().ToList(),
                        PreviousBalance = multi.Read<decimal?>().FirstOrDefault()
                    };

                    return result;
                }
            }
        }

        public WarehouseMovementSPResult MultiListWarehouse(string procedureName, DynamicParameters param = null)
        {
            using (SqlConnection sqlCon = new SqlConnection(ConnectionString))
            {
                sqlCon.Open();

                using (var multi = sqlCon.QueryMultiple(procedureName, param, commandType: CommandType.StoredProcedure))
                {
                    var result = new WarehouseMovementSPResult
                    {
                        Movement = multi.Read<ModelWarehouseMovement>().ToList(),

                        Mortalities = multi.Read<TblWarehouseMortality>().ToList(),

                        Livestocks = multi.Read<TblWarehouseLivestock>().ToList(),

                        Outgoings = multi.Read<TblWarehouseOutgoing>().ToList(),

                        Products = multi.Read<TblProduct>().ToList(),

                        Delegates = multi.Read<TblCustomer>().ToList()
                    };

                    return result;
                }
            }
        }
    }
}