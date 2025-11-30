using Dapper;
using SalesModel.ViewModels;

namespace SalesModel.IRepository
{
    public interface ISP_Call : IDisposable
    {
        T Single<T>(string procedureName, DynamicParameters param = null);

        void Execute(string procedureName, DynamicParameters param = null);

        T OneRecord<T>(string procedureName, DynamicParameters param = null);

        IEnumerable<T> List<T>(string procedureName, DynamicParameters param = null);

        Tuple<IEnumerable<T1>, IEnumerable<T2>> List<T1, T2>(string procedureName, DynamicParameters param = null);

        DailyMovementSPResult MultiList(string procedureName, DynamicParameters param = null);
        WarehouseMovementSPResult MultiListWarehouse(string procedureName, DynamicParameters param = null);


    }
}
