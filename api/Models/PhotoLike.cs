namespace api.Models 
{
    public class PhotoLike
    {
        public PhotoLike(int photoId, int userId) 
        {
            PhotoId = photoId;
            UserId = userId;
        }
        
        public int PhotoId {get;set;}
        public int UserId {get;set;}
    }
}