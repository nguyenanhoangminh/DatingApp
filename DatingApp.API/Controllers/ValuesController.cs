using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
//Post http://localhost:5000/api/values/5
/*
    recommendation using asynchronos code in web application for 2 reasons
    1st : simple to use
    2nd : does not affect a performance at all or so small in application
*/
namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        // GET api/values
        private readonly DataContext _context ;
        public ValuesController(DataContext context)
        {
            _context = context;

        }
        [AllowAnonymous]
        [HttpGet]
        // using ActionResult<IEnumerable<string>> Get() just can return a string 
        // while using IActionResult can return an TTP RESPONSE to the client
        // return Ok message
        public async Task<IActionResult> GetValues()
        {
            var values = await _context.Values.ToListAsync();
            return Ok (values);
        }

        // GET api/values/5
        [AllowAnonymous]
        [HttpGet("{id}")]
         public async Task<IActionResult> GetValue(int id)
        {
            var value = await _context.Values.FirstOrDefaultAsync(stu => stu.Id==id);
            return Ok (value);      
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
