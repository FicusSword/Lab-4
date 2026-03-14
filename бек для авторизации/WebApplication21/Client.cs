public class Client
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Age { get; set; }
    //public string? PasswordHash { get; set; }
    public string? RefreshToken { get; set; }
    public bool IsAdmin { get; set; } = false;
    public string? Nickname { get; set; }
}
