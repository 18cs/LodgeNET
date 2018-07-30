using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace LodgeNET.API.DAL.Models
{
    public class Service
    {
        [Key]
        public int Id { get; set; }
        public string ServiceName { get; set; }
        public IEnumerable<Rank> Ranks { get; set; }

        public Service()
        {
            Ranks = new Collection<Rank>();
        }
    }
}