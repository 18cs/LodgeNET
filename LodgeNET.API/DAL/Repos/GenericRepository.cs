using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace LodgeNET.API.DAL
{
    /// <summary>
    /// Represents the current context of a generic table in database
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
    {
        internal DataContext _context;
        //internal DbSet<TEntity> DbSet;

        /// <summary>
        /// Constructor sets current context and specifies the set
        /// </summary>
        /// <param name="context">context of the database</param>
        public GenericRepository(DataContext context)
        {
            this._context = context;
            //this.DbSet = context.Set<TEntity>();
        }

        #region Methods

        /// <summary>
        /// Queries the database of the specified table that correlates with TEntity table
        /// </summary>
        /// <param name="filter">Filter to be applied to query</param>
        /// <param name="orderBy">attribute to orderby</param>
        /// <param name="includeProperties">Properties of specified entity to be included in query results</param>
        /// <returns>Emumerable set of results from database</returns>
        public async virtual Task<IEnumerable<TEntity>> GetAsync(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            Expression<Func<TEntity, object>>[] includeProperties = null)
        {
            // IQueryable<TEntity> query = DbSet;
            IQueryable<TEntity> query = _context.Set<TEntity>();

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (includeProperties != null)
            {
                foreach (Expression<Func<TEntity, object>> includeProperty in includeProperties)
                {
                    query = query.Include<TEntity, object>(includeProperty);
                }
            }

            if (orderBy != null)
            {
                return await orderBy(query).ToListAsync();
            }
            else
            {
                return await query.ToListAsync();
            }
        }

        public virtual IEnumerable<TEntity> Get(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
             Expression<Func<TEntity, object>>[] includeProperties = null)
        {
            // IQueryable<TEntity> query = DbSet; 
            IQueryable<TEntity> query = _context.Set<TEntity>();

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (includeProperties != null)
            {
                foreach (Expression<Func<TEntity, object>> includeProperty in includeProperties)
                {
                    query = query.Include<TEntity, object>(includeProperty);
                }
            }

            if (orderBy != null)
            {
                return orderBy(query).ToList();
            }
            else
            {
                return query.ToList();
            }
        }

        public async virtual Task<int> GetCount(Expression<Func<TEntity, bool>> filter = null)
        {
            int countResult;
            IQueryable<TEntity> query = _context.Set<TEntity>();

            if (filter != null)
            {
                countResult = await query.Where(filter).CountAsync();
            }
            else
            {
                countResult = await query.CountAsync();
            }
            return countResult;
        }

        public async virtual Task<int> GetSum(Expression<Func<TEntity, int>> sumOf, Expression<Func<TEntity, bool>> filter = null)
        {
            int sumResult;
            IQueryable<TEntity> query = _context.Set<TEntity>();

            if (filter != null)
            {
                sumResult = await query.Where(filter).SumAsync(sumOf);
            }
            else
            {
                sumResult = await query.SumAsync(sumOf);
            }
            return sumResult;
        }

        /// <summary>
        /// Gets specific record from database bases on primary key
        /// </summary>
        /// <param name="id">unique identifier of record</param>
        /// <returns>Record of DB information stored in Entity model instance</returns>
        public async virtual Task<TEntity> GetByID(object id)
        {
            return await _context.Set<TEntity>().FindAsync(id);
        }

        public async virtual Task<TEntity> GetFirstOrDefault(Expression<Func<TEntity, bool>> filter, Expression<Func<TEntity, object>>[] includeProperties = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null)
        {
            IQueryable<TEntity> query = _context.Set<TEntity>();

            if (includeProperties != null)
            {
                foreach (Expression<Func<TEntity, object>> includeProperty in includeProperties)
                {
                    query = query.Include<TEntity, object>(includeProperty);
                }
            }

            if (orderBy != null)
            {
                return await orderBy(query).Where(filter).FirstOrDefaultAsync();
            }
            else
            {
                return await query.Where(filter).FirstOrDefaultAsync();
            }

            //return await query.Where (filter).FirstOrDefaultAsync ();
        }

        /// <summary>
        /// Inserts entity record into database context
        /// </summary>
        /// <param name="entity">Entity to be entered into database</param>
        public async virtual Task Insert(TEntity entity)
        {
            await _context.Set<TEntity>().AddAsync(entity);
        }

        /// <summary>
        /// Deletes record from database context based on ID
        /// </summary>
        /// <param name="id">unique identifier of record</param>
        public async virtual Task Delete(object id)
        {
            TEntity entityToDelete = await _context.Set<TEntity>().FindAsync(id);
            await Delete(entityToDelete);
        }

        /// <summary>
        /// Removes record from current DB context 
        /// </summary>
        /// <param name="entityToDelete">Record to remove</param>
        public async virtual Task Delete(TEntity entityToDelete)
        {
            if (_context.Entry(entityToDelete).State == EntityState.Detached)
            {
                _context.Set<TEntity>().Attach(entityToDelete);
            }
            _context.Set<TEntity>().Remove(entityToDelete);
        }

        /// <summary>
        /// Updates a specific record within current DB context
        /// </summary>
        /// <param name="entityToUpdate">entity record to update</param>
        public async virtual void Update(TEntity entityToUpdate)
        {
            _context.Set<TEntity>().Attach(entityToUpdate);
            _context.Entry(entityToUpdate).State = EntityState.Modified;
        }

        /// <summary>
        /// Saves current context to database
        /// </summary>
        public virtual void Save()
        {
            _context.SaveChanges();
        }

        public async virtual Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
        #endregion
    }
}