using System;

namespace api.Requests
{
    public class RequestSignUp
    {
        public string? NomeCompleto { get; set; }
        public string? Email { get; set; }
        public string? Senha { get; set; }
        public string? Role { get; set; }
    }
}
