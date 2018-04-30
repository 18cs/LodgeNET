using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.Models;

namespace LodgeNET.API.DAL
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        Task<IEnumerable<TEntity>> GetAsync(
           Expression<Func<TEntity, bool>> filter = null,
           System.Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
           string includeProperties = "");

        IEnumerable<TEntity> Get(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includeProperties = "");
         Task<TEntity> GetByID(object id);
        int GetCount(Expression<Func<TEntity, bool>> filter = null);
        int GetSum(Expression<Func<TEntity, int>> sumOf, Expression<Func<TEntity, bool>> filter = null);
        Task<TEntity> GetFirstOrDefault(Expression<Func<TEntity, bool>> filter, Expression<Func<TEntity, object>>[] includeProperties = null);
        void Insert(TEntity entity);
        void Delete(object id);
        void Delete(TEntity entityToDelete);
        void Update(TEntity entityToUpdate);
        void Save();
        void SaveAsync();
    }
}