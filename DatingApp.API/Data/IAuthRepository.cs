using System.Threading.Tasks;
using DatingApp.API.Model;

namespace DatingApp.API.Data
{
    public interface IAuthRepository
    {
        //three task for users
        // registering the user
         Task<User> Register(User user, string password);
         // log in to our API
         Task<User> Login(string username, string password);
         // check to see if the user exist
         // user name need to be unique
         Task<bool> UserExists(string username);
         
    }
}