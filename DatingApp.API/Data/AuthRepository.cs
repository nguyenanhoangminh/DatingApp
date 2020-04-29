using System;
using System.Threading.Tasks;
using DatingApp.API.Model;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    // concrete class that implement the interface class
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;//to get access to the context in repository
        public AuthRepository(DataContext context)
        {
            _context = context;

        }
        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            //pass by reference for passwordHash, and passwordSalt
            CreatePasswordHash(password, out passwordHash, out passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();//save the changes back to the database
            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
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

        public async Task<User> Login(string username, string password)
        {

            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(user => username == user.Username);
            if (user == null)//not found user name
                return null;
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))//password are not the same in the database
                return null;
            return user;
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            //create a new instance of this class
            //to ensure that the dispose is called to release all resource used by lokeren
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))//use key to compute hash 
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                //compare the 2 byte array of computedHash and password
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i]) 
                        return false;//not equal
                }
                return true;//equal
            }
        }

        public async Task<bool> UserExists(string username)
        {
            if (await _context.Users.AnyAsync(user => user.Username == username))//compare the user name against any other user in that database
                return true;//hash found username in the database
            return false;//hash not found username in the database
        }
    }
}