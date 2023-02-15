using api.Models;
using api.Requests;

namespace api.Services
{
    public class PhotoService
    {
        #region Constants
        private const string FILE_STORAGE_PHOTOS_SUBPATH = "Photos";
        #endregion

        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ICollection<Photo> _photos;

        public PhotoService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
            _photos = new List<Photo>();
        }

        public Photo? GetById(int id)
        {
            return _photos.FirstOrDefault(p => p.Id == id);
        }

        public IEnumerable<Photo> GetAll(int page = 0, int records = 10)
        {
            return _photos.Skip(page * records).Take(records).ToList();
        }

        public PhotoComment? AddComment(RequestCreatePhotoComment requestComment)
        {
            var userLoggedId = Convert.ToInt16(_httpContextAccessor.HttpContext?.User.FindFirst("id")?.Value ?? "0");
            if (userLoggedId == 0)
            {
                return null;
            }

            var photo = GetById(requestComment.PhotoId);
            if (photo == null || string.IsNullOrEmpty(requestComment.Description))
            {
                return null;
            }

            var newComment = new PhotoComment(requestComment.Description, requestComment.PhotoId, userLoggedId);

            photo.Comments.Add(newComment);

            return newComment;
        }

        public IEnumerable<PhotoComment> GetComments(int photoId)
        {
            var photo = GetById(photoId);

            return photo != null
                ? photo.Comments
                : new List<PhotoComment>();
        }

        public Photo? Include(RequestCreatePhoto requestPhoto)
        {
            var userLoggedId = Convert.ToInt16(_httpContextAccessor.HttpContext?.User.FindFirst("id")?.Value ?? "0");

            if (requestPhoto.PhotoFile == null || string.IsNullOrEmpty(requestPhoto.Description) || userLoggedId == 0)
            {
                return null;
            }

            VerifyAndCreateFileStoragePhotosDirectory();

            var file = GenerateFileData();
            using (var fileStream = new FileStream(file.FilePath, FileMode.Create))
            {
                requestPhoto.PhotoFile.CopyTo(fileStream);
            }

            var photoIncluded = new Photo(requestPhoto.Description, file.FileName, requestPhoto.AllowComments, userLoggedId);

            _photos.Add(photoIncluded);

            return photoIncluded;
        }

        public Photo? Edit(RequestEditPhoto requestPhoto)
        {
            var userLoggedId = Convert.ToInt16(_httpContextAccessor.HttpContext?.User.FindFirst("id")?.Value ?? "0");

            if (requestPhoto.PhotoFile == null || string.IsNullOrEmpty(requestPhoto.Description) || userLoggedId == 0)
            {
                return null;
            }
            
            var photo = GetById(requestPhoto.Id);
            if (photo == null || photo.UserId != userLoggedId)
            {
                return null;
            }

            VerifyAndCreateFileStoragePhotosDirectory();

            try
            {
                File.Delete(BuildPhotoFilePath(photo.FileName));
            }
            catch
            {
                // Não quebra o fluxo caso não conseguir deletar.
            }

            var file = GenerateFileData();
            using (var fileStream = new FileStream(file.FilePath, FileMode.Create))
            {
                requestPhoto.PhotoFile.CopyTo(fileStream);
            }

            photo.Description = requestPhoto.Description;
            photo.FileName = file.FileName;
            photo.AllowComments = requestPhoto.AllowComments;

            if (!photo.AllowComments && photo.Comments.Any())
            {
                photo.Comments.Clear();
            }

            return photo;
        }

        public bool? Like(int photoId) 
        {
            var userLoggedId = Convert.ToInt16(_httpContextAccessor.HttpContext?.User.FindFirst("id")?.Value);

            var photo = GetById(photoId);
            if (photo == null) {
                return null;
            }

            if (photo.Likes.Any(like => like.UserId == userLoggedId)) 
            {
                return false;
            }

            photo.Likes.Add(new PhotoLike(photo.Id, userLoggedId));
            return true;
        }

        public bool Delete(int photoId)
        {
            var userLoggedId = Convert.ToInt16(_httpContextAccessor.HttpContext?.User.FindFirst("id")?.Value ?? "0");

            var photo = GetById(photoId);
            if (photo == null || photo.UserId != userLoggedId)
            {
                return false;
            }

            try
            {
                File.Delete(BuildPhotoFilePath(photo.FileName));
            }
            catch
            {
                // Não quebra o fluxo.
            }

            _photos.Remove(photo);

            return true;
        }

        public byte[]? Download(int id)
        {
            var photo = GetById(id);
            if (photo == null)
            {
                return null;
            }

            var filePath = BuildPhotoFilePath(photo.FileName);
            if (!File.Exists(filePath))
            {
                return null;
            }

            return File.ReadAllBytes(filePath);
        }

        public bool VerifyIfAllowComments(int photoId)
        {
            return GetById(photoId)?.AllowComments ?? false;
        }

        #region Auxiliary Methods
        private string GetFileStoragePhotosPath()
        {
            var fileStoragePath = _configuration["FileStorage:Path"];

            if (string.IsNullOrWhiteSpace(fileStoragePath))
            {
                throw new ApplicationException("There is no configured file storage path!");
            }

            return Path.Combine(fileStoragePath, FILE_STORAGE_PHOTOS_SUBPATH);
        }

        private void VerifyAndCreateFileStoragePhotosDirectory()
        {
            var fileStoragePhotosPath = GetFileStoragePhotosPath();

            if (!Directory.Exists(fileStoragePhotosPath))
            {
                Directory.CreateDirectory(fileStoragePhotosPath);
            }
        }

        private string BuildPhotoFilePath(string fileName)
        {
            var fileStoragePhotoPath = GetFileStoragePhotosPath();
            return Path.Combine(fileStoragePhotoPath, fileName);
        }

        private ApplicationFile GenerateFileData()
        {
            var fileName = Guid.NewGuid().ToString();
            var filePath = BuildPhotoFilePath(fileName);
            while (File.Exists(filePath))
            {
                fileName = Guid.NewGuid().ToString();
                filePath = BuildPhotoFilePath(fileName);
            }

            return new ApplicationFile(fileName, filePath);
        }
        #endregion
    }
}
