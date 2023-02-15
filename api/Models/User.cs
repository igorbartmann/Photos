using System;

namespace API.Models
{
    public class User
    {
        public static int userCurrentId = 0;

        public User (string nomeCompleto, string email, string senha, string role) {
            this.Id = ++userCurrentId;
            this.NomeCompleto = nomeCompleto;
            this.Email = email;
            this.Senha = senha;
            this.Role = role;
        }

        public int Id {get;set;}
        public string NomeCompleto {get;set;}
        public string Email {get;set;}
        public string Senha {get;set;}
        public string Role {get;set;}
    }
}