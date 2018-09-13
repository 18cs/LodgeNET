using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.DAL.Models;

namespace LodgeNET.API.DAL
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        Task<IEnumerable<TEntity>> GetAsync(
           Expression<Func<TEntity, bool>> filter = null,
           System.Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            Expression<Func<TEntity, object>>[] includeProperties = null);

        IEnumerable<TEntity> Get(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
             Expression<Func<TEntity, object>>[] includeProperties = null);
         Task<TEntity> GetByID(object id);
        Task<int> GetCount(Expression<Func<TEntity, bool>> filter = null);
        Task<int> GetSum(Expression<Func<TEntity, int>> sumOf, Expression<Func<TEntity, bool>> filter = null);
        Task<TEntity> GetFirstOrDefault(Expression<Func<TEntity, bool>> filter, Expression<Func<TEntity, object>>[] includeProperties = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null);
        Task Insert(TEntity entity);
        Task Delete(object id);
        Task Delete(TEntity entityToDelete);
        void Update(TEntity entityToUpdate);
        void Save();
        Task SaveAsync();
    }
}