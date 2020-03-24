using System.Collections.Generic;
using System.Linq;
using DatingApp.API.Model;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        public static void SeedUsers(DataContext context)
        {
            // check if we've no user in the database 
            if (!context.Users.Any())
            {
                // take data from the json file
                // 5 female user and 5 male user
                var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
                //list of the users
                var users = JsonConvert.DeserializeObject<List<User>>(userData);
                foreach (var user in users)
                {
                    byte [] passwordHash, passwordSalt;
                    CreatePasswordHash("password", out passwordHash, out passwordSalt); 

                    user.PasswordHash = passwordHash;
                    user.PasswordSalt = passwordSalt;
                    // lowercase the user name
                    user.Username = user.Username.ToLower();
                    context.Users.Add(user);
                }

                context.SaveChanges();
            }
        }

        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            //create a new instance of this class
            //to ensure that the dispose is called to release all resource used by lokeren
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;// randomly generated key
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));// ComputeHash take a byte array
                //encoding a password as byte array
            }
        }
    }
}