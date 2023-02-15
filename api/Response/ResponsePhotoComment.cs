using api.Models;

namespace api.Response
{
    public class ResponsePhotoComment
    {
        public ResponsePhotoComment(int id, int photoId, string description, DateTime date, string userName)
        {
            Id = id;
            PhotoId = photoId;
            Description = description;
            Date = date;
            UserName = userName;
        }

        public int Id { get; set; }
        public int PhotoId { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public string UserName { get; set; }
    }
}
