// using Microsoft.AspNetCore.Mvc;
// using Microsoft.Extensions.Logging;
// using Moq;
// using Backend.Controllers;
// using Backend.DTOs;
// using Backend.Services;
// using Xunit;
// using FluentAssertions;
// using System.Security.Claims;
// using Microsoft.AspNetCore.Http;

// namespace Backend.Tests
// {
//     public class AuthControllerTests
//     {
//         private readonly Mock<IUserService> _mockUserService;
//         private readonly Mock<ILogger<AuthController>> _mockLogger;
//         private readonly AuthController _controller;

//         public AuthControllerTests()
//         {
//             _mockUserService = new Mock<IUserService>();
//             _mockLogger = new Mock<ILogger<AuthController>>();
//             _controller = new AuthController(_mockUserService.Object, _mockLogger.Object);
//         }

//         [Fact]
//         public async Task Login_ValidCredentials_ReturnsOkResult()
//         {
//             // Arrange
//             var loginDto = new LoginDto
//             {
//                 Username = "testuser",
//                 Password = "password123"
//             };

//             var expectedResponse = new LoginResponseDto
//             {
//                 Token = "test-token",
//                 Username = "testuser",
//                 Role = "User",
//                 ExpiresAt = DateTime.UtcNow.AddHours(24)
//             };

//             _mockUserService.Setup(x => x.AuthenticateAsync(loginDto))
//                            .ReturnsAsync(expectedResponse);

//             // Act
//             var result = await _controller.Login(loginDto);

//             // Assert
//             var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
//             var returnValue = okResult.Value.Should().BeOfType<LoginResponseDto>().Subject;
//             returnValue.Username.Should().Be("testuser");
//             returnValue.Token.Should().Be("test-token");
//         }

//         [Fact]
//         public async Task Login_InvalidCredentials_ReturnsUnauthorized()
//         {
//             // Arrange
//             var loginDto = new LoginDto
//             {
//                 Username = "testuser",
//                 Password = "wrongpassword"
//             };

//             _mockUserService.Setup(x => x.AuthenticateAsync(loginDto))
//                            .ReturnsAsync((LoginResponseDto?)null);

//             // Act
//             var result = await _controller.Login(loginDto);

//             // Assert
//             result.Should().BeOfType<UnauthorizedObjectResult>();
//         }

//         [Fact]
//         public void Dashboard_AuthenticatedUser_ReturnsOkWithUserInfo()
//         {
//             // Arrange
//             var claims = new[]
//             {
//                 new Claim(ClaimTypes.Name, "testuser"),
//                 new Claim(ClaimTypes.Role, "Admin")
//             };
//             var identity = new ClaimsIdentity(claims, "test");
//             var principal = new ClaimsPrincipal(identity);

//             _controller.ControllerContext = new ControllerContext
//             {
//                 HttpContext = new DefaultHttpContext { User = principal }
//             };

//             // Act
//             var result = _controller.Dashboard();

//             // Assert
//             var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
//             var response = okResult.Value;
//             response.Should().NotBeNull();
//         }
//     }
// }