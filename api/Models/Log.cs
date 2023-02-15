using System;

namespace api.Models
{
    public class Log
    {
        private static int _currentId = 0;

        public Log(string message, string user, string url, string stack) 
        {
            Id = ++_currentId;
            Message = message;
            User = user;
            Url = string.IsNullOrWhiteSpace(url) ? null : url;
            Stack = stack;
        }

        public int Id {get;set;}
        public string Message {get;set;}
        public string User {get;set;}
        public string? Url {get;set;}
        public string Stack {get;set;}
    }
}