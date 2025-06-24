using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Store.Business.Services;

namespace Store.WebAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly ILiqPayService _liqPayService;
        private readonly IConfiguration _configuration;

        public OrderController(IOrderService orderService, ILiqPayService liqPayService, IConfiguration configuration)
        {
            _orderService = orderService;
            _liqPayService = liqPayService;
            _configuration = configuration;
        }

        [HttpPost("create-liqpay-order")]
        public IActionResult CreateLiqPayOrder([FromBody] CreateOrderRequest request)
        {
            var publicKey = _configuration["LiqPay:PublicKey"];
            var callbackUrl = _configuration["LiqPay:CallbackUrl"];
            var redirectUrl = _configuration["LiqPay:RedirectUrl"];

            var orderId = Guid.NewGuid().ToString(); // Ideally, from your DB

            var payment = new
            {
                public_key = publicKey,
                version = "3",
                action = "pay",
                amount = request.Amount,
                currency = "UAH",
                description = $"Order #{orderId}",
                order_id = orderId,
                server_url = callbackUrl,
                result_url = redirectUrl
            };

            var data = _liqPayService.GenerateLiqPayData(payment);
            var signature = _liqPayService.GenerateSignature(data);

            return Ok(new { data, signature });
        }

        // For LiqPay to send status update (must be public-facing)
        [AllowAnonymous]
        [HttpPost("liqpay-callback")]
        public IActionResult LiqPayCallback([FromForm] string data, [FromForm] string signature)
        {
            // TODO: Decode and verify signature, then process order status
            return Ok();
        }
    }

    public class CreateOrderRequest
    {
        public decimal Amount { get; set; }
    }
}
