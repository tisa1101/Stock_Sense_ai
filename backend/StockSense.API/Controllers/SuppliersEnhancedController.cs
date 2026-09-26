using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockSense.Application.DTOs;
using StockSense.Application.Interfaces;

namespace StockSense.API.Controllers;

[ApiController]
[Route("api/suppliers")]
[Authorize]
public class SuppliersEnhancedController : ControllerBase
{
    private readonly IEnhancedSupplierService _svc;
    public SuppliersEnhancedController(IEnhancedSupplierService svc) => _svc = svc;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search = null)
        => Ok(await _svc.GetAllAsync(search));

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
        => Ok(await _svc.GetStatsAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
        => Ok(await _svc.GetByIdAsync(id));

    [HttpGet("{id}/receipts")]
    public async Task<IActionResult> GetReceipts(int id)
        => Ok(await _svc.GetSupplierReceiptsAsync(id));

    [HttpPost]
    [Authorize(Roles = "Admin,InventoryManager")]
    public async Task<IActionResult> Create([FromBody] CreateSupplierDto dto)
        => Ok(await _svc.CreateAsync(dto));

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,InventoryManager")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSupplierDto dto)
        => Ok(await _svc.UpdateAsync(id, dto));

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,InventoryManager")]
    public async Task<IActionResult> Delete(int id)
    {
        await _svc.DeleteAsync(id);
        return Ok(new { message = "Supplier deactivated." });
    }
}
