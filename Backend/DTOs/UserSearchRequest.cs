namespace Backend.DTOs
{
    public class UserSearchRequest
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? Search { get; set; }
        public string? SortBy { get; set; } = "Username";
        public string? SortDirection { get; set; } = "asc"; // "asc" or "desc"
    }
}