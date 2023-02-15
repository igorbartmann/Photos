namespace api.Models
{
    public class Photo
    {
        private static int photoCurrentId = 0;

        public Photo(
            string description,
            string fileName,
            bool allowComments,
            int userId)
        {
            this.Id = ++photoCurrentId;
            this.Description = description;
            this.FileName = fileName;
            this.PostDate = DateTime.UtcNow;
            this.Likes = new List<PhotoLike>();
            this.AllowComments = allowComments;
            this.Comments = new List<PhotoComment>();
            this.UserId = userId;
        }

        public int Id { get; set; }
        public string Description { get; set; }
        public DateTime PostDate { get; set; }
        public string FileName { get; set; }
        public ICollection<PhotoLike> Likes { get; set; }
        public bool AllowComments { get; set; }
        public ICollection<PhotoComment> Comments { get; set; }
        public int UserId { get; set; }
    }
}