using System;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/logs")]
    public class LogController : ControllerBase
    {
        public readonly LogService _logService;

        public LogController(LogService logService, LoginService loginService)
        {
            _logService = logService;
        }

        [HttpGet]
        [Authorize]
        public ActionResult<IEnumerable<Log>> Get(int page = 0, int records = 15)
        {
            var logs = _logService.Get(page, records);
            return Ok(logs);
        }

        [HttpPost]
        [Authorize]
        public ActionResult Include([FromBody] LogCreateRequest logRequest)
        {
            var logIncluded = _logService.Include(logRequest);
            return logIncluded != null
                ? Ok()
                : BadRequest("Can not included the log!");
        }
    }
}