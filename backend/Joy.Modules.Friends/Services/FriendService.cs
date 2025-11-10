using MongoDB.Driver;
using Joy.Modules.Shared.Models;
using Joy.Modules.Friends.Models;

namespace Joy.Modules.Friends.Services;

public class FriendService : IFriendService
{
    private readonly IMongoCollection<User> _users;
    private readonly IMongoCollection<Friendship> _friendships;

    public FriendService(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("users");
        _friendships = database.GetCollection<Friendship>("friendships");
    }

    public async Task<User> AddFriendAsync(string userEmail, string friendEmail)
    {
        // Ensure both users exist
        var user = await GetUserByEmailAsync(userEmail) ?? await CreateOrUpdateUserAsync(userEmail);
        var friend = await GetUserByEmailAsync(friendEmail) ?? await CreateOrUpdateUserAsync(friendEmail);

        // Check if friendship already exists
        var existingFriendship = await _friendships
            .Find(f => (f.UserEmail == userEmail && f.FriendEmail == friendEmail) ||
                       (f.UserEmail == friendEmail && f.FriendEmail == userEmail))
            .FirstOrDefaultAsync();

        if (existingFriendship == null)
        {
            var friendship = new Friendship
            {
                UserEmail = userEmail,
                FriendEmail = friendEmail,
                CreatedAt = DateTime.UtcNow
            };
            await _friendships.InsertOneAsync(friendship);
        }

        return friend;
    }

    public async Task<IEnumerable<User>> GetFriendsAsync(string userEmail)
    {
        var friendships = await _friendships
            .Find(f => f.UserEmail == userEmail || f.FriendEmail == userEmail)
            .ToListAsync();

        var friendEmails = friendships
            .Select(f => f.UserEmail == userEmail ? f.FriendEmail : f.UserEmail)
            .Distinct()
            .ToList();

        var friends = await _users
            .Find(u => friendEmails.Contains(u.Email))
            .ToListAsync();

        return friends;
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
    }

    public async Task<User> CreateOrUpdateUserAsync(string email, string? name = null, DateTime? birthday = null)
    {
        var user = await GetUserByEmailAsync(email);
        
        if (user == null)
        {
            user = new User
            {
                Email = email,
                Name = name,
                Birthday = birthday,
                CreatedAt = DateTime.UtcNow
            };
            await _users.InsertOneAsync(user);
        }
        else
        {
            if (name != null) user.Name = name;
            if (birthday != null) user.Birthday = birthday;
            await _users.ReplaceOneAsync(u => u.Id == user.Id, user);
        }

        return user;
    }
}

