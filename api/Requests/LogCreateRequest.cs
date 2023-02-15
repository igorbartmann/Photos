using System;

namespace api.Models
{
    public class LogCreateRequest
    {
        public string? Message {get;set;}
        public string? Url {get;set;}
        public string? Stack {get;set;}
    }
}