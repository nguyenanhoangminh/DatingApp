using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System;
using System.IdentityModel.Tokens.Jwt;
using AutoMapper;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
            _config = config;
            _repo = repo;
            _mapper = mapper;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            //validate Request
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();//case insensitive

            if (await _repo.UserExists(userForRegisterDto.Username))//check if the user name already exist in the database
                return BadRequest("Usersname already exists");
            var userToCreate = _mapper.Map<User>(userForRegisterDto);

            var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            var userToReturn = _mapper.Map<UserForDetailedDto>(createdUser);

            return CreatedAtRoute("GetUser", new {Controller ="Users",
                id = createdUser.Id}, userToReturn);
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
                // lower case the user name because we store the lower case of username in the database 
                var userFromRepo = await _repo.Login(userForLoginDto.Username.ToLower(), userForLoginDto.Password);
                if (userFromRepo == null) { // the user name not exits in the database or the the password is invalid
                        return Unauthorized();// don't let the user know if the user name exits and the password is invalid
                }
                //build up a token to get a return from the user
                var claims = new[]
                {
                    // claim contain user Id and User name
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),// NameIdentifier is probally the most approciate type for Id
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };
                // create a key user for validation whether the tokens are valid token when it comes back from the server
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
                // create credentials by hasing key 
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
                // create a tokenDescriptor 
                // with Subject, Expires, and SigningCredentials
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.Now.AddDays(1),// the tokenDescriptor will expire after 24 hours
                    SigningCredentials = creds
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                // using tokenDescriptor to create a token
                var token = tokenHandler.CreateToken(tokenDescriptor);
                //write token to the response and send it back to the client
                var user = _mapper.Map<UserForListDto>(userFromRepo);
                return Ok(new
                {
                    token = tokenHandler.WriteToken(token),
                    user
                }
                );
        }
    }
}