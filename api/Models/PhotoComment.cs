namespace api.Models
{
    public class PhotoComment
    {
        private static int _currentCommentId = 0;

        public PhotoComment(string description, int photoId, int userId)
        {
            Id = ++_currentCommentId;
            Description = description;
            Date = DateTime.UtcNow;
            PhotoId = photoId;
            UserId = userId;
        }

        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public int PhotoId { get; set; }
        public int UserId { get; set; }
    }
}
