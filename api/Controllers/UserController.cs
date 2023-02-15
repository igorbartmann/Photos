using System.Security.Claims;
using api.Requests;
using api.Response;
using api.Services;
using API.Requests;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly LoginService _loginService;

        public UserController(LoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpGet("IsAuthenticated")]
        [AllowAnonymous]
        public ActionResult IsAutenticated()
        {
            return User.Identity?.IsAuthenticated ?? false
                ? Ok()
                : Unauthorized("Usuário não autenticado!");
        }

        [HttpGet("IsNameInUse")]
        [AllowAnonymous]
        public ActionResult IsNameInUse([FromQuery] string nomeCompleto)
        {
            var nameInUse = _loginService.IsNameInUse(nomeCompleto);
            return Ok(nameInUse);
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public ActionResult Login([FromBody] RequestLogin requestLogin)
        {
            var token = _loginService.Login(requestLogin);

            if (token == null)
            {
                return BadRequest("Invalid user name or password!");
            }

            return Ok(token);
        }

        [HttpPost("RefreshToken")]
        [Authorize]
        public ActionResult RefreshToken()
        {
            // Garantir Autenticação.
            if (User.Identity == null 
                || User.Identity.IsAuthenticated == false)
            {
                return Unauthorized();
            }

            var token = _loginService.RefreshToken();

            if (token == null)
            {
                // If RefreshToken and User is authenticated, must works!
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            return Ok(token);
        }

        [HttpPost("SignUp")]
        [AllowAnonymous]
        public ActionResult SignUp([FromBody] RequestSignUp requestSignUp)
        {
            var newUser = _loginService.SignUp(requestSignUp);

            if (newUser == null)
            {
                return BadRequest("Houve algum erro com os dados do usuário.");
            }

            var userResponse = new UserResponse(newUser.Id, newUser.NomeCompleto, newUser.Email, newUser.Role);

            return Ok(userResponse);
        }
    }
}