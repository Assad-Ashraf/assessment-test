using Backend.DTOs;
using Backend.Models;

namespace Backend.Services
{
    public interface IUserService
    {
        Task<LoginResponseDto?> AuthenticateAsync(LoginDto loginDto);
        Task<PagedResult<UserResponseDto>> GetPagedUsersAsync(int page, int pageSize); 
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
        Task<UserResponseDto?> GetUserByIdAsync(int id);
        Task<UserResponseDto> CreateUserAsync(CreateUserDto createUserDto);
        Task<UserResponseDto?> UpdateUserAsync(int id, UpdateUserDto updateUserDto);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> UserExistsAsync(int id);
        Task<PagedResult<UserResponseDto>> SearchUsersAsync(UserSearchRequest request);

    }
}