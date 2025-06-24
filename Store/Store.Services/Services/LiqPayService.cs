using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;

public interface ILiqPayService
{
    string GenerateLiqPayData(object paymentData);
    string GenerateSignature(string data);
}

public class LiqPayService : ILiqPayService
{
    private readonly string? _publicKey;
    private readonly string? _privateKey;

    public LiqPayService(IConfiguration config)
    {
        _publicKey = config["LiqPay:PublicKey"];
        _privateKey = config["LiqPay:PrivateKey"];
    }

    public string GenerateLiqPayData(object paymentData)
    {
        var json = System.Text.Json.JsonSerializer.Serialize(paymentData);
        var bytes = Encoding.UTF8.GetBytes(json);
        return Convert.ToBase64String(bytes);
    }

    public string GenerateSignature(string data)
    {
        var fullString = _privateKey + data + _privateKey;
        var bytes = Encoding.UTF8.GetBytes(fullString);
        using var sha1 = SHA1.Create();
        var hash = sha1.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }
}