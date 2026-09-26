using System.Net.Http.Json;
using System.Text.Json;
using StockSense.Application.DTOs;
using StockSense.Application.Interfaces;

namespace StockSense.Application.Services;

public class AiService : IAiService
{
    private readonly HttpClient _httpClient;
    private readonly IDashboardService _dashboardService;
    private static readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
        PropertyNameCaseInsensitive = true
    };

    public AiService(IHttpClientFactory httpClientFactory, IDashboardService dashboardService)
    {
        _httpClient = httpClientFactory.CreateClient("AiService");
        _dashboardService = dashboardService;
    }

    public async Task<DemandForecastDto> GetForecastAsync(int productId, int horizonDays = 30)
    {
        try
        {
            var response = await _httpClient.PostAsync(
                $"/forecast/{productId}?horizon_days={horizonDays}", null);
            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadFromJsonAsync<DemandForecastDto>(_jsonOptions);
            return result ?? throw new InvalidOperationException("AI service returned null.");
        }
        catch (HttpRequestException)
        {
            throw new InvalidOperationException(
                "AI Service is unavailable. Please ensure the Python AI service is running on port 8000.");
        }
    }

    public async Task<AiAnomalyResultDto> GetAnomaliesAsync(int days = 30)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/anomalies?days={days}");
            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadFromJsonAsync<AiAnomalyResultDto>(_jsonOptions);
            return result ?? throw new InvalidOperationException("AI service returned null.");
        }
        catch (HttpRequestException)
        {
            throw new InvalidOperationException(
                "AI Service is unavailable. Please ensure the Python AI service is running on port 8000.");
        }
    }

    public async Task<CopilotResponseDto> ChatAsync(CopilotRequestDto request)
    {
        try
        {
            // Build context from dashboard
            var dashboard = await _dashboardService.GetSummaryAsync();
            var contextPayload = new
            {
                message = request.Message,
                history = request.History?.Select(h => new { role = h.Role, content = h.Content }).ToList(),
                context = new
                {
                    total_products = dashboard.TotalProducts,
                    total_stock = dashboard.TotalStockQuantity,
                    low_stock_count = dashboard.LowStockCount,
                    out_of_stock_count = dashboard.OutOfStockCount,
                    low_stock_items = dashboard.LowStockProducts.Take(10).Select(p => new
                    {
                        product_name = p.ProductName,
                        sku = p.SKU,
                        stock = p.TotalStock,
                        reorder_level = p.ReorderLevel,
                        status = p.Status
                    }),
                    recent_movements = dashboard.RecentStockMovements.Take(20).Select(m => new
                    {
                        product_name = m.ProductName,
                        transaction_type = m.TransactionType.ToString(),
                        quantity_change = m.QuantityChange,
                        created_at = m.CreatedAt.ToString("yyyy-MM-dd HH:mm")
                    })
                }
            };

            var response = await _httpClient.PostAsJsonAsync("/copilot/chat", contextPayload, _jsonOptions);
            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadFromJsonAsync<CopilotResponseDto>(_jsonOptions);
            return result ?? throw new InvalidOperationException("AI service returned null.");
        }
        catch (HttpRequestException)
        {
            throw new InvalidOperationException(
                "AI Service is unavailable. Please ensure the Python AI service is running on port 8000.");
        }
    }
}
