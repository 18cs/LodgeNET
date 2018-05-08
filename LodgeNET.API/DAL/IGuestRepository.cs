using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.Models;

namespace LodgeNET.API.DAL {
    public interface IGuestRepository {
        Task<bool> IsGuestCheckedIn (int guestId);
        Task<IEnumerable<Guest>> GetAsync (
            Expression<Func<Guest, bool>> filter = null,
            System.Func<IQueryable<Guest>, IOrderedQueryable<Guest>> orderBy = null,
             Expression<Func<Guest, object>>[] includeProperties = null);

        IEnumerable<Guest> Get (
            Expression<Func<Guest, bool>> filter = null,
            Func<IQueryable<Guest>, IOrderedQueryable<Guest>> orderBy = null,
             Expression<Func<Guest, object>>[] includeProperties = null);
        Task<Guest> GetByID (object id);
        int GetCount (Expression<Func<Guest, bool>> filter = null);
        int GetSum (Expression<Func<Guest, int>> sumOf, Expression<Func<Guest, bool>> filter = null);
        Task<Guest> GetFirstOrDefault (Expression<Func<Guest, bool>> filter, Expression<Func<Guest, object>>[] includeProperties = null);
        void Insert (Guest entity);
        void Delete (object id);
        void Delete (Guest entityToDelete);
        void Update (Guest entityToUpdate);
        void Save ();
        Task SaveAsync ();
    }
}