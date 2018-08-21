using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.DAL.Models;
using LodgeNET.API.Helpers;

namespace LodgeNET.API.DAL
{
    public interface IFileRepository : IGenericRepository<Upload>
    {
        Task<PagedList<Upload>> GetUploadsPagination(
            UploadUserParams userParams, 
            Expression<Func<Upload, object>>[] includeProperties = null,
            Expression<Func<Upload, bool>> filter = null
        );
    }
}