using Diplomski.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Diplomski.Context
{
    public class Contexts : DbContext
    {
        public Contexts(DbContextOptions<Contexts> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Person> Persons { get; set; }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<Models.Route> Routes { get; set; }
        public DbSet<Models.Club> Clubs { get; set; }
      
        public Person GetUserWithEmailAndPassword(string email, string password)
        {
            return Persons.Where(x => x.Email == email && x.Password == password).FirstOrDefault();
        }
        public Person GetUserWithActivationLink(string link)
        {
            return Persons.Where(x => x.ActivationLink == link).FirstOrDefault();
        }
        public User GetUserById(int id)
        {
            return Users.SingleOrDefault(u => u.Id == id);
        }
        public Person GetPersonById(int id)
        {
            return Persons.SingleOrDefault(u => u.UserID == id);
        }
    }
}
