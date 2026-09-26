using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockSense.Application.DTOs;
using StockSense.Application.Interfaces;
using StockSense.Domain.Enums;

namespace StockSense.API.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class UserManagementController : ControllerBase
{
    private readonly IUserManagementService _svc;
    public UserManagementController(IUserManagementService svc) => _svc = svc;
    private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    [HttpGet("users")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll() => Ok(await _svc.GetAllUsersAsync());

    [HttpGet("users/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetById(int id) => Ok(await _svc.GetUserByIdAsync(id));

    [HttpPut("users/{id}/role")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ChangeRole(int id, [FromBody] ChangeRoleDto dto)
        => Ok(await _svc.ChangeRoleAsync(id, dto.Role, GetUserId()));

    [HttpPut("users/{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleStatus(int id, [FromBody] ToggleUserStatusDto dto)
        => Ok(await _svc.ToggleStatusAsync(id, dto.IsActive, GetUserId()));

    [HttpDelete("users/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        await _svc.DeleteUserAsync(id, GetUserId());
        return Ok(new { message = "User deleted." });
    }

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile() => Ok(await _svc.GetProfileAsync(GetUserId()));

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
        => Ok(await _svc.UpdateProfileAsync(GetUserId(), dto));

    [HttpPut("profile/password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        await _svc.ChangePasswordAsync(GetUserId(), dto);
        return Ok(new { message = "Password changed successfully." });
    }
}
