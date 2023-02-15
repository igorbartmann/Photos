using api.Models;
using api.Requests;
using api.Response;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/photos")]
    public class PhotoContoller : ControllerBase
    {
        private readonly PhotoService _photoService;
        private readonly LoginService _loginService;

        public PhotoContoller(PhotoService photoService, LoginService loginService) {
            _photoService = photoService;
            _loginService = loginService;
        }
        
        [HttpGet("")]
        [Authorize]
        public ActionResult<IEnumerable<Photo>> GetPhotos([FromQuery] int page, [FromQuery] int records = 100)
        {
            var photos = _photoService.GetAll(page, records);

            var photosResponse = new List<PhotoResponse>();
            foreach (var photo in photos)
            {
                photosResponse.Add(new PhotoResponse(photo));
            }

            return Ok(photosResponse);
        }

        [HttpGet("{id}")]
        [Authorize]
        public ActionResult<Photo> GetPhotoById(int id) 
        {
            var photo = _photoService.GetById(id);
            return photo != null 
                ? Ok(new PhotoResponse(photo))
                : NotFound($"Error to find by id: {id}.");
        }

        [HttpGet("{id}/download")]
        [Authorize]
        public ActionResult Download(int id)
        {
            var photoFileBytes = _photoService.Download(id);

            if (photoFileBytes == null)
            {
                return BadRequest($"Não foi possível obter a photo de id: {id}");
            }

            return File(photoFileBytes, "image/png");
        }

        [HttpPost("")]
        [Authorize]
        public ActionResult Included([FromForm] RequestCreatePhoto requestPhotoUpload)
        {
            var photoUploaded = _photoService.Include(requestPhotoUpload);

            if (photoUploaded == null) 
            {
                return BadRequest("An error ocurred!");
            }

            return Ok(new PhotoResponse(photoUploaded));           
        }

        [HttpPut("")]
        [Authorize]
        public ActionResult Edit([FromForm] RequestEditPhoto requestPhotoUpload)
        {
            var photoEdit = _photoService.Edit(requestPhotoUpload);

            if (photoEdit == null)
            {
                return BadRequest("Error to edit photo!");
            }

            return Ok(new PhotoResponse(photoEdit));
        }

        [HttpPut("{id}/like")]
        [Authorize]
        public ActionResult Like(int id) 
        {
            var likeAdded = _photoService.Like(id);

            if (likeAdded == null) 
            {
                return BadRequest($"Could not find the photo with id {id}.");
            }

            if (likeAdded == false) 
            {
                return StatusCode(StatusCodes.Status304NotModified);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public ActionResult Delete(int id)
        {
            var success = _photoService.Delete(id);

            if (!success)
            {
                return BadRequest("Not can delete this photo!");
            }

            return NoContent();
        }

        [HttpGet("{id}/comments")]
        [Authorize]
        public ActionResult GetComments(int id)
        {
            var comments = _photoService.GetComments(id);

            var responseComments = new List<ResponsePhotoComment>();
            foreach(var comment in comments)
            {
                var userName = _loginService.GetUserNameById(comment.UserId);

                if (string.IsNullOrEmpty(userName))
                {
                    continue;
                }

                responseComments.Add(
                    new ResponsePhotoComment(
                        comment.Id,
                        comment.PhotoId,
                        comment.Description,
                        comment.Date,
                        userName
                    )
                );
            }

            return Ok(responseComments.OrderByDescending(c => c.Date));
        }

        [HttpPost("{id}/comments")]
        [Authorize]
        public ActionResult AddComment(int id, [FromBody] RequestCreatePhotoComment requestComment)
        {
            if (id != requestComment.PhotoId)
            {
                return BadRequest("Id inválido!");
            }

            if (!_photoService.VerifyIfAllowComments(id))
            {
                return BadRequest("Not allowed comments.");
            }

            var commentAdded = _photoService.AddComment(requestComment);
            if (commentAdded == null)
            {
                return BadRequest("Não foi possével incluir o comentário na foto.");
            }

            return NoContent();
        }
    }
}