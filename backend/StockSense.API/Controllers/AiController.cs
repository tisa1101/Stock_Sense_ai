using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockSense.Application.DTOs;
using StockSense.Application.Interfaces;

namespace StockSense.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AiController : ControllerBase
{
    private readonly IAiService _aiService;

    public AiController(IAiService aiService)
    {
        _aiService = aiService;
    }

    [HttpGet("forecast/{productId}")]
    public async Task<IActionResult> GetForecast(int productId, [FromQuery] int horizonDays = 30)
    {
        try
        {
            var result = await _aiService.GetForecastAsync(productId, horizonDays);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(503, new { message = ex.Message });
        }
    }

    [HttpGet("anomalies")]
    public async Task<IActionResult> GetAnomalies([FromQuery] int days = 30)
    {
        try
        {
            var result = await _aiService.GetAnomaliesAsync(days);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(503, new { message = ex.Message });
        }
    }

    [HttpPost("copilot/chat")]
    public async Task<IActionResult> Chat([FromBody] CopilotRequestDto request)
    {
        try
        {
            var result = await _aiService.ChatAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return StatusCode(503, new { message = ex.Message });
        }
    }
}
