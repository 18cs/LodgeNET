using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using LodgeNET.API.DAL.Models;
using LodgeNET.API.Helpers;
using Microsoft.EntityFrameworkCore;

namespace LodgeNET.API.DAL.Repos
{
    public class FileRepository : GenericRepository<Upload>, IFileRepository
    {
        public FileRepository(DataContext context) : base(context) { }

        public async Task<PagedList<Upload>> GetUploadsPagination (
            UploadUserParams userParams,
            Expression<Func<Upload, object>>[] includeProperties = null,
            Expression<Func<Upload, bool>> filter = null) {
            var uploads = _context.Uploads.AsQueryable ();

            if (includeProperties != null) {
                foreach (Expression<Func<Upload, object>> includeProperty in includeProperties) {
                    uploads = uploads.Include<Upload, object> (includeProperty);
                }
            }

            if (filter != null) {
                uploads = uploads.Where (filter);
            }

            if (userParams.DateUploaded != null) {
                uploads = uploads.Where (u => u.DateUploaded == userParams.DateUploaded);
            }

            if (userParams.FileName != null) {
                uploads = uploads.Where (u => u.FileName == userParams.FileName);
            }

            if (userParams.UserId != null) {
                uploads = uploads.Where (u => u.User.Id == userParams.UserId);
            }

            return await PagedList<Upload>.CreateAsync (uploads, userParams.PageNumber, userParams.PageSize);

        }
    }
}