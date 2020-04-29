using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository repo, IMapper mapper, 
            IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _cloudinaryConfig = cloudinaryConfig;
            _mapper = mapper;
            _repo = repo;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(acc);
        }
        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repo.GetPhoto(id);
            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);
            return Ok(photo);
        }

        
        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            //check to see the roots the user is accessing matches their user id. which match their token
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            //take user form the repo
            var user = await _repo.GetUser(userId);
            //check photo accessing is inside their photo collection
            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();
            //take photo form the repo            
            var photoFromRepo = await _repo.GetPhoto(id);      
            //check if ot is the main photo
            //if it is the main photo do nothing
            if (photoFromRepo.IsMain)
                return BadRequest("This is already the main photo");

            var currentMainPhoto = await _repo.GetMainPhotoForUser(userId);
            currentMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;

            if (await _repo.SaveAll())
                return NoContent();

            return BadRequest("Could not sent photo to main");       
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            //check to see the roots the user is accessing matches their user id. which match their token
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            //take user form the repo
            var user = await _repo.GetUser(userId);
            //check photo deleting is inside their photo collection
            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();
            //take photo form the repo            
            var photoFromRepo = await _repo.GetPhoto(id);      
            //check if ot is the main photo
            //if it is the main photo do nothing
            if (photoFromRepo.IsMain)
                return BadRequest("You can not deleting your main photo");

            // if delete photo is in the cloudinary
            if(photoFromRepo.PublicId != null)
            {
                //deleting photo form the cloudinary database
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);
                var result = _cloudinary.Destroy(deleteParams);

                //delete the photo 
                if(result.Result == "ok")
                {
                    _repo.Delete(photoFromRepo);
                }

            }
            // if photo form other source
            if(photoFromRepo.PublicId == null)
            {
                _repo.Delete(photoFromRepo);                
            }
            // save change
            if(await _repo.SaveAll())
            {
                return Ok();
            }
            // else send bad request
            return BadRequest("Failed to delete the photo");
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId,
            [FromForm] photoForCreationDto photoForCreationDto)
        {
            //check to see the roots the user is accessing matches their user id. which match their token           
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();  
            var userFormRepo = await _repo.GetUser(userId);
            var file = photoForCreationDto.File;
            var uploadResult = new ImageUploadResult();
            if(file.Length >0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation()
                            .Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }
            photoForCreationDto.Url = uploadResult.Uri.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;

            var photo = _mapper.Map<Photo>(photoForCreationDto);

            if(!userFormRepo.Photos.Any(u => u.IsMain))
                photo.IsMain = true;
            userFormRepo.Photos.Add(photo);
            if (await _repo.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new {userId = userId, id =photo.Id}, photoToReturn);
            }
            return BadRequest("could not add the photo");   
        }
    }
}