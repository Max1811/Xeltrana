namespace Store.Business.Services.Contracts
{
    public interface IAuthorizationService
    {
        public string GenerateJwtToken(User user);
    }
}
