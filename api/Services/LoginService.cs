using api.Models;
using api.Requests;
using API.Models;
using API.Requests;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace api.Services
{
    public class LoginService
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ICollection<User> _users;

        public LoginService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;

            _users = new List<User>()
            {
                new User("Igor Bartmann", "admin", "123", "administrador"),
                new User("Luísa Kruger", "user", "123", "usuário")
            };
        }           

        public User? GetById(int id)
        {
            return _users.FirstOrDefault(u => u.Id == id);
        }

        public bool IsNameInUse(string name)
        {
            var nameInUse = _users.Any(u => u.NomeCompleto == name);
            return nameInUse;
        }

        public ApiToken? Login(RequestLogin requestLogin)
        {
            if (string.IsNullOrEmpty(requestLogin.Email) 
                || string.IsNullOrEmpty(requestLogin.Senha)) 
            {
                return null;
            }

            var user = _users.FirstOrDefault(u => u.Email == requestLogin.Email && u.Senha == requestLogin.Senha);
            if (user == null)
            {
                return null;
            }

            return GenerateToken(user);
        }

        public ApiToken? RefreshToken() 
        {
            var userLoggedId = GetLoogedUserId();
            if (!userLoggedId.HasValue)
            {
                return null;
            }
            
            var user = GetById(userLoggedId.Value);
            if (user == null)
            {
                return null;
            }

            return GenerateToken(user);
        }

        public User? SignUp(RequestSignUp requestSignUp)
        {
            if (string.IsNullOrEmpty(requestSignUp.NomeCompleto)
                || string.IsNullOrEmpty(requestSignUp.Email)
                || string.IsNullOrEmpty(requestSignUp.Senha)
                || string.IsNullOrEmpty(requestSignUp.Role)) 
            {
                return null;
            }

            var newUser = new User(requestSignUp.NomeCompleto, requestSignUp.Email, requestSignUp.Senha, requestSignUp.Role);
            _users.Add(newUser);

            return newUser;
        }

        public string? GetUserNameById(int userId)
        {
            return _users.FirstOrDefault(u => u.Id == userId)?.NomeCompleto;
        }

        public int? GetLoogedUserId()
        {
            if (_httpContextAccessor.HttpContext == null 
                || _httpContextAccessor.HttpContext.User.Identity == null 
                || _httpContextAccessor.HttpContext.User.Identity.IsAuthenticated == false) 
            {
                return null;
            }

            var idValue = _httpContextAccessor.HttpContext.User.FindFirst("id")?.Value;

            return idValue == null ? null : Convert.ToInt16(idValue);
        }

        private ApiToken GenerateToken(User user)
        {
            #region Constants
            const int TOKEN_EXPIRATION_MINUTES = 30;
            const int REFRESH_TOKEN_EXPIRATION_MINUTES = 60;
            #endregion

            var currentDate = DateTime.UtcNow;

            var token = GenerateDefaultToken(user, currentDate.AddMinutes(TOKEN_EXPIRATION_MINUTES));
            var refreshToken = GenerateDefaultToken(user, currentDate.AddMinutes(REFRESH_TOKEN_EXPIRATION_MINUTES));

            return new ApiToken(token, refreshToken);
        }
        
        private string GenerateDefaultToken(User user, DateTime tokenExpirationDate)
        {
            var authenticationKey = _configuration["Authentication:Key"];
            if (string.IsNullOrWhiteSpace(authenticationKey))
            {
                throw new ApplicationException("Authentication key is not configured!");
            }

            var jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
            var securityTokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("id", user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.NomeCompleto),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role),
                }),
                Expires = tokenExpirationDate,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.ASCII.GetBytes(authenticationKey)), 
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = jwtSecurityTokenHandler.CreateToken(securityTokenDescriptor);
            return jwtSecurityTokenHandler.WriteToken(token);
        }
    }
}