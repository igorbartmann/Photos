namespace api.Requests
{
    public class RequestCreatePhoto
    {

        public IFormFile? PhotoFile { get; set; }
        public string? Description { get; set; }
        public bool AllowComments { get; set; }
    }
}
