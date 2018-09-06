using LodgeNET.API.Dtos;
using LodgeNET.API.Dtos.Charts;

namespace LodgeNET.API.BLL
{
    public class DataService
    {
        public DataService() {}
        public ChartDto<S> GetChart<S>() => new ChartDto<S>();
        public T GetSeries<T>() where T : new() => new T();
    }
}