using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockSense.Application.Common;
using StockSense.Application.DTOs;
using StockSense.Application.Interfaces;
using StockSense.Domain.Enums;

namespace StockSense.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService) => _authService = authService;

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Register([FromBody] RegisterRequestDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            return Ok(ApiResponse<AuthResponseDto>.Ok(result, "User registered successfully."));
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<AuthResponseDto>>> Login([FromBody] LoginRequestDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            return Ok(ApiResponse<AuthResponseDto>.Ok(result, "Login successful."));
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult<ApiResponse<OtpResponseDto>>> ForgotPassword([FromBody] ForgotPasswordRequestDto dto)
        {
            var result = await _authService.RequestOtpAsync(dto);
            return Ok(ApiResponse<OtpResponseDto>.Ok(result, result.Message));
        }

        [HttpPost("verify-otp")]
        public async Task<ActionResult<ApiResponse<bool>>> VerifyOtp([FromBody] VerifyOtpRequestDto dto)
        {
            var isValid = await _authService.VerifyOtpAsync(dto);
            if (!isValid)
                return BadRequest(ApiResponse<bool>.Fail("Invalid or expired OTP."));

            return Ok(ApiResponse<bool>.Ok(true, "OTP verified successfully."));
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<ApiResponse<OtpResponseDto>>> ResetPassword([FromBody] ResetPasswordOtpRequestDto dto)
        {
            var result = await _authService.ResetPasswordWithOtpAsync(dto);
            return Ok(ApiResponse<OtpResponseDto>.Ok(result, result.Message));
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoriesController(ICategoryService categoryService) => _categoryService = categoryService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<CategoryDto>>>> GetAll()
        {
            var data = await _categoryService.GetAllAsync();
            return Ok(ApiResponse<List<CategoryDto>>.Ok(data));
        }

        [HttpPost]
        [Authorize(Roles = "Admin,InventoryManager")]
        public async Task<ActionResult<ApiResponse<CategoryDto>>> Create([FromBody] CreateCategoryDto dto)
        {
            var data = await _categoryService.CreateAsync(dto);
            return Ok(ApiResponse<CategoryDto>.Ok(data, "Category created successfully."));
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WarehousesController : ControllerBase
    {
        private readonly IWarehouseService _warehouseService;
        public WarehousesController(IWarehouseService warehouseService) => _warehouseService = warehouseService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<WarehouseDto>>>> GetAll()
        {
            var data = await _warehouseService.GetAllAsync();
            return Ok(ApiResponse<List<WarehouseDto>>.Ok(data));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<WarehouseDto>>> Create([FromBody] CreateWarehouseDto dto)
        {
            var data = await _warehouseService.CreateAsync(dto);
            return Ok(ApiResponse<WarehouseDto>.Ok(data, "Warehouse created successfully."));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<WarehouseDto>>> Update(int id, [FromBody] UpdateWarehouseDto dto)
        {
            var data = await _warehouseService.UpdateAsync(id, dto);
            return Ok(ApiResponse<WarehouseDto>.Ok(data, "Warehouse updated successfully."));
        }
    }



    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductsController(IProductService productService) => _productService = productService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ProductDto>>>> GetAll([FromQuery] int? categoryId, [FromQuery] string? search)
        {
            var data = await _productService.GetAllAsync(categoryId, search);
            return Ok(ApiResponse<List<ProductDto>>.Ok(data));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProductDto>>> GetById(int id)
        {
            var data = await _productService.GetByIdAsync(id);
            return Ok(ApiResponse<ProductDto>.Ok(data));
        }

        [HttpPost]
        [Authorize(Roles = "Admin,InventoryManager")]
        public async Task<ActionResult<ApiResponse<ProductDto>>> Create([FromBody] CreateProductDto dto)
        {
            var data = await _productService.CreateAsync(dto);
            return Ok(ApiResponse<ProductDto>.Ok(data, "Product created successfully."));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,InventoryManager")]
        public async Task<ActionResult<ApiResponse<ProductDto>>> Update(int id, [FromBody] UpdateProductDto dto)
        {
            var data = await _productService.UpdateAsync(id, dto);
            return Ok(ApiResponse<ProductDto>.Ok(data, "Product updated successfully."));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
        {
            await _productService.DeleteAsync(id);
            return Ok(ApiResponse<bool>.Ok(true, "Product deleted successfully."));
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;
        public InventoryController(IInventoryService inventoryService) => _inventoryService = inventoryService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<InventoryDto>>>> GetAll(
            [FromQuery] int? categoryId,
            [FromQuery] int? warehouseId,
            [FromQuery] string? stockStatus,
            [FromQuery] string? search)
        {
            var data = await _inventoryService.GetAllAsync(categoryId, warehouseId, stockStatus, search);
            return Ok(ApiResponse<List<InventoryDto>>.Ok(data));
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<ApiResponse<List<InventoryDto>>>> GetByProduct(int productId)
        {
            var data = await _inventoryService.GetByProductIdAsync(productId);
            return Ok(ApiResponse<List<InventoryDto>>.Ok(data));
        }

        [HttpGet("warehouse/{warehouseId}")]
        public async Task<ActionResult<ApiResponse<List<InventoryDto>>>> GetByWarehouse(int warehouseId)
        {
            var data = await _inventoryService.GetByWarehouseIdAsync(warehouseId);
            return Ok(ApiResponse<List<InventoryDto>>.Ok(data));
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReceiptsController : ControllerBase
    {
        private readonly IReceiptService _receiptService;
        public ReceiptsController(IReceiptService receiptService) => _receiptService = receiptService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ReceiptDto>>>> GetAll()
        {
            var data = await _receiptService.GetAllAsync();
            return Ok(ApiResponse<List<ReceiptDto>>.Ok(data));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ReceiptDto>>> GetById(int id)
        {
            var data = await _receiptService.GetByIdAsync(id);
            return Ok(ApiResponse<ReceiptDto>.Ok(data));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<ReceiptDto>>> Create([FromBody] CreateReceiptDto dto)
        {
            var data = await _receiptService.CreateAsync(dto);
            return Ok(ApiResponse<ReceiptDto>.Ok(data, "Receipt draft created successfully."));
        }

        [HttpPost("{id}/validate")]
        public async Task<ActionResult<ApiResponse<ReceiptDto>>> Validate(int id)
        {
            var user = User.Identity?.Name ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "System User";
            var data = await _receiptService.ValidateAsync(id, user);
            return Ok(ApiResponse<ReceiptDto>.Ok(data, "Receipt validated successfully. Inventory updated."));
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DeliveriesController : ControllerBase
    {
        private readonly IDeliveryService _deliveryService;
        public DeliveriesController(IDeliveryService deliveryService) => _deliveryService = deliveryService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<DeliveryDto>>>> GetAll()
        {
            var data = await _deliveryService.GetAllAsync();
            return Ok(ApiResponse<List<DeliveryDto>>.Ok(data));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<DeliveryDto>>> GetById(int id)
        {
            var data = await _deliveryService.GetByIdAsync(id);
            return Ok(ApiResponse<DeliveryDto>.Ok(data));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<DeliveryDto>>> Create([FromBody] CreateDeliveryDto dto)
        {
            var data = await _deliveryService.CreateAsync(dto);
            return Ok(ApiResponse<DeliveryDto>.Ok(data, "Delivery draft created successfully."));
        }

        [HttpPost("{id}/validate")]
        public async Task<ActionResult<ApiResponse<DeliveryDto>>> Validate(int id)
        {
            var user = User.Identity?.Name ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "System User";
            var data = await _deliveryService.ValidateAsync(id, user);
            return Ok(ApiResponse<DeliveryDto>.Ok(data, "Delivery order validated successfully. Inventory reduced."));
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TransfersController : ControllerBase
    {
        private readonly ITransferService _transferService;
        public TransfersController(ITransferService transferService) => _transferService = transferService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<TransferDto>>>> GetAll()
        {
            var data = await _transferService.GetAllAsync();
            return Ok(ApiResponse<List<TransferDto>>.Ok(data));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<TransferDto>>> GetById(int id)
        {
            var data = await _transferService.GetByIdAsync(id);
            return Ok(ApiResponse<TransferDto>.Ok(data));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<TransferDto>>> Create([FromBody] CreateTransferDto dto)
        {
            var data = await _transferService.CreateAsync(dto);
            return Ok(ApiResponse<TransferDto>.Ok(data, "Internal transfer draft created successfully."));
        }

        [HttpPost("{id}/validate")]
        public async Task<ActionResult<ApiResponse<TransferDto>>> Validate(int id)
        {
            var user = User.Identity?.Name ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "System User";
            var data = await _transferService.ValidateAsync(id, user);
            return Ok(ApiResponse<TransferDto>.Ok(data, "Internal transfer validated successfully. Ledger records updated for both warehouses."));
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AdjustmentsController : ControllerBase
    {
        private readonly IStockAdjustmentService _adjustmentService;
        public AdjustmentsController(IStockAdjustmentService adjustmentService) => _adjustmentService = adjustmentService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<AdjustmentDto>>>> GetAll()
        {
            var data = await _adjustmentService.GetAllAsync();
            return Ok(ApiResponse<List<AdjustmentDto>>.Ok(data));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<AdjustmentDto>>> GetById(int id)
        {
            var data = await _adjustmentService.GetByIdAsync(id);
            return Ok(ApiResponse<AdjustmentDto>.Ok(data));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<AdjustmentDto>>> Create([FromBody] CreateAdjustmentDto dto)
        {
            var data = await _adjustmentService.CreateAsync(dto);
            return Ok(ApiResponse<AdjustmentDto>.Ok(data, "Stock adjustment draft created. Difference auto-calculated."));
        }

        [HttpPost("{id}/validate")]
        public async Task<ActionResult<ApiResponse<AdjustmentDto>>> Validate(int id)
        {
            var user = User.Identity?.Name ?? User.FindFirst(ClaimTypes.Email)?.Value ?? "System User";
            var data = await _adjustmentService.ValidateAsync(id, user);
            return Ok(ApiResponse<AdjustmentDto>.Ok(data, "Stock adjustment validated successfully. Ledger record created."));
        }
    }

    [ApiController]
    [Route("api/ledger")]
    [Authorize]
    public class LedgerController : ControllerBase
    {
        private readonly IStockLedgerService _ledgerService;
        public LedgerController(IStockLedgerService ledgerService) => _ledgerService = ledgerService;

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<StockLedgerDto>>>> GetAll(
            [FromQuery] int? productId,
            [FromQuery] int? warehouseId,
            [FromQuery] TransactionType? transactionType)
        {
            var data = await _ledgerService.GetAllAsync(productId, warehouseId, transactionType);
            return Ok(ApiResponse<List<StockLedgerDto>>.Ok(data));
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<ApiResponse<List<StockLedgerDto>>>> GetByProduct(int productId)
        {
            var data = await _ledgerService.GetByProductIdAsync(productId);
            return Ok(ApiResponse<List<StockLedgerDto>>.Ok(data));
        }

        [HttpGet("warehouse/{warehouseId}")]
        public async Task<ActionResult<ApiResponse<List<StockLedgerDto>>>> GetByWarehouse(int warehouseId)
        {
            var data = await _ledgerService.GetByWarehouseIdAsync(warehouseId);
            return Ok(ApiResponse<List<StockLedgerDto>>.Ok(data));
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;
        public DashboardController(IDashboardService dashboardService) => _dashboardService = dashboardService;

        [HttpGet("summary")]
        public async Task<ActionResult<ApiResponse<DashboardSummaryDto>>> GetSummary()
        {
            var data = await _dashboardService.GetSummaryAsync();
            return Ok(ApiResponse<DashboardSummaryDto>.Ok(data));
        }
    }
}
