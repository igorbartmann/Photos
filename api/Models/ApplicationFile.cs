using System;

namespace api.Models
{
    public class ApplicationFile
    {
        public ApplicationFile(string fileName, string filePath)
        {
            FileName = fileName;
            FilePath = filePath;
        }

        public string FileName {get;set;}
        public string FilePath {get;set;}
    }
}