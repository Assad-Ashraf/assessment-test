using Microsoft.AspNetCore.Mvc;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<AuthController> _logger;
        
        public AuthController(IUserService userService, ILogger<AuthController> logger)
        {
            _userService = userService;
            _logger = logger;
        }
        
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { message = "Invalid input data", errors = ModelState });
                }
                
                var result = await _userService.AuthenticateAsync(loginDto);
                
                if (result == null)
                {
                    return Unauthorized(new { message = "Invalid username or password" });
                }
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login attempt");
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }
        
        [HttpGet("dashboard")]
        [Authorize]
        public IActionResult Dashboard()
        {
            try
            {
                var username = User.Identity?.Name;
                var role = User.FindFirst(ClaimTypes.Role)?.Value;
                
                var message = role switch
                {
                    "Admin" => "Admin Dashboard - Full access granted",
                    "User" => "User Dashboard - Welcome to your personal space",
                    _ => "Dashboard - Access granted"
                };
                
                return Ok(new 
                { 
                    message, 
                    username, 
                    role,
                    timestamp = DateTime.UtcNow 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error accessing dashboard");
                return StatusCode(500, new { message = "An error occurred accessing the dashboard" });
            }
        }
    }
}