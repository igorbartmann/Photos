namespace api.Response
{
    public class UserResponse
    {
        public int Id { get; set; }
        public string NomeCompleto { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }

        public UserResponse(int id, string nomeCompleto, string email, string role)
        {
            this.Id = id;
            this.NomeCompleto = nomeCompleto;
            this.Email = email;
            this.Role = role;
        }
    }
}
