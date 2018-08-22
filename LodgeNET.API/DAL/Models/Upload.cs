using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using LodgeNET.API.DAL.Models;

namespace LodgeNET.API.DAL.Models
{
    public class Upload
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }
        public DateTime DateUploaded { get; set; }
        public string FileName { get; set; }
    }
}