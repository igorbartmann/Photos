using System;
using api.Models;

namespace api.Services
{
    public class LogService
    {
        public readonly LoginService _loginService;
        public IList<Log> _logs;

        public LogService(LoginService loginService)
        {
            
            _loginService = loginService;

            _logs = new List<Log>()
            {
                new Log("Application started.", "Application", string.Empty, "LogService")
            };
        }

        public IEnumerable<Log> Get(int page, int records)
        {
            return _logs.Skip(page * records).Take(records).ToList();
        }

        public Log? Include(LogCreateRequest logRequest)
        {
            var userLoggedId = _loginService.GetLoogedUserId();
            if (!userLoggedId.HasValue)
            {
                return null;
            }

            var user = _loginService.GetById(userLoggedId.Value);
            if (user == null)
            {
                return null;
            }

            if (string.IsNullOrEmpty(logRequest.Message)
                || logRequest.Url == null
                || string.IsNullOrEmpty(logRequest.Stack))
            {
                return null;
            }

            var log = new Log(logRequest.Message, $"{user.NomeCompleto} - (id: {user.Id})", logRequest.Url, logRequest.Stack);

            _logs.Add(log);

            return log;
        }
    }
}