using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace api.Models
{
    public class ApiToken
    {
        public ApiToken(string token, string refreshToken)
        {
            Token = token;
            RefreshToken = refreshToken;
        }

        public string Token {get;}
        public string RefreshToken {get;}
    }
}