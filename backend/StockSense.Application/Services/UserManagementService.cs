using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using StockSense.Application.Common;
using StockSense.Application.DTOs;
using StockSense.Application.Interfaces;
using StockSense.Domain.Enums;

namespace StockSense.Application.Services
{
    public class UserManagementService : IUserManagementService
    {
        private readonly IApplicationDbContext _db;
        private readonly IPasswordHasher _hasher;
        public UserManagementService(IApplicationDbContext db, IPasswordHasher hasher) { _db = db; _hasher = hasher; }

        public async Task<List<UserListDto>> GetAllUsersAsync()
            => await _db.Users.Select(u => new UserListDto(u.Id, u.Name, u.Email, u.Role, true, u.CreatedAt)).ToListAsync();

        public async Task<UserListDto> GetUserByIdAsync(int id)
        {
            var u = await _db.Users.FirstOrDefaultAsync(u => u.Id == id) ?? throw new NotFoundException($"User {id} not found.");
            return new UserListDto(u.Id, u.Name, u.Email, u.Role, true, u.CreatedAt);
        }

        public async Task<UserListDto> ChangeRoleAsync(int id, UserRole role, int currentUserId)
        {
            if (id == currentUserId) throw new BusinessException("You cannot change your own role.");
            var u = await _db.Users.FirstOrDefaultAsync(u => u.Id == id) ?? throw new NotFoundException($"User {id} not found.");
            u.Role = role;
            await _db.SaveChangesAsync();
            return new UserListDto(u.Id, u.Name, u.Email, u.Role, true, u.CreatedAt);
        }

        public async Task<UserListDto> ToggleStatusAsync(int id, bool isActive, int currentUserId)
        {
            if (id == currentUserId) throw new BusinessException("You cannot modify your own status.");
            var u = await _db.Users.FirstOrDefaultAsync(u => u.Id == id) ?? throw new NotFoundException($"User {id} not found.");
            return new UserListDto(u.Id, u.Name, u.Email, u.Role, isActive, u.CreatedAt);
        }

        public async Task DeleteUserAsync(int id, int currentUserId)
        {
            if (id == currentUserId) throw new BusinessException("You cannot delete your own account.");
            var u = await _db.Users.FirstOrDefaultAsync(u => u.Id == id) ?? throw new NotFoundException($"User {id} not found.");
            _db.Users.Remove(u);
            await _db.SaveChangesAsync();
        }

        public async Task<UserDto> GetProfileAsync(int userId)
        {
            var u = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new NotFoundException("User not found.");
            return new UserDto(u.Id, u.Name, u.Email, u.Role, u.CreatedAt);
        }

        public async Task<UserDto> UpdateProfileAsync(int userId, UpdateProfileDto dto)
        {
            var u = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new NotFoundException("User not found.");
            if (string.IsNullOrWhiteSpace(dto.Name)) throw new BusinessException("Name is required.");
            if (string.IsNullOrWhiteSpace(dto.Email)) throw new BusinessException("Email is required.");
            var emailExists = await _db.Users.AnyAsync(x => x.Email.ToLower() == dto.Email.ToLower() && x.Id != userId);
            if (emailExists) throw new BusinessException("Email already in use.");
            u.Name = dto.Name.Trim(); u.Email = dto.Email.Trim().ToLower();
            await _db.SaveChangesAsync();
            return new UserDto(u.Id, u.Name, u.Email, u.Role, u.CreatedAt);
        }

        public async Task ChangePasswordAsync(int userId, ChangePasswordDto dto)
        {
            if (dto.NewPassword != dto.ConfirmPassword) throw new BusinessException("Passwords do not match.");
            if (dto.NewPassword.Length < 8) throw new BusinessException("Password must be at least 8 characters.");
            var u = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId) ?? throw new NotFoundException("User not found.");
            if (!_hasher.VerifyPassword(dto.CurrentPassword, u.PasswordHash)) throw new BusinessException("Current password is incorrect.");
            u.PasswordHash = _hasher.HashPassword(dto.NewPassword);
            await _db.SaveChangesAsync();
        }
    }
}
