using api.Models;

namespace api.Response
{
    public class PhotoResponse
    {
        public PhotoResponse(int id, string description, DateTime postDate, int numberLiks, bool allowComments, int numberComments, int userId)
        {
            this.Id = id;
            this.Description = description;
            this.PostDate = postDate;
            this.NumberLiks = numberLiks;
            this.AllowComments = allowComments;
            this.NumberComments = numberComments;
            this.UserId = userId;
        }

        public PhotoResponse(Photo photo)
        {
            this.Id = photo.Id;
            this.Description = photo.Description;
            this.PostDate = photo.PostDate;
            this.NumberLiks = photo.Likes.Count;
            this.AllowComments = photo.AllowComments;
            this.NumberComments = photo.Comments.Count;
            this.UserId = photo.UserId;
        }

        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime PostDate { get; set; }
        public int NumberLiks { get; set; }
        public bool AllowComments { get; set; }
        public int NumberComments {get;set;}
        public string Url => $"/api/photos/{this.Id}/download";
        public int UserId { get; set; }
    }
}
