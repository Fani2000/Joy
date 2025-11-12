namespace Joy.Api.Data;

/// <summary>
/// Predefined seed data for demo users
/// </summary>
public static class SeedData
{
    /// <summary>
    /// Demo users for testing the application
    /// </summary>
    public static class Users
    {
        public static readonly (string Email, string Name, string Password)[] DemoUsers = new[]
        {
            ("john.doe@example.com", "John Doe", "password123"),
            ("sarah.smith@example.com", "Sarah Smith", "password123"),
            ("mike.johnson@example.com", "Mike Johnson", "password123"),
            ("emily.brown@example.com", "Emily Brown", "password123"),
            ("user@example.com", "Demo User", "password123")
        };
    }

    /// <summary>
    /// Sample gift templates
    /// </summary>
    public static class GiftTemplates
    {
        public static readonly string[] Titles = new[]
        {
            "Birthday Surprise Box",
            "Anniversary Gift Card",
            "Congratulations Flowers",
            "Thank You Gift Basket",
            "Get Well Soon Care Package",
            "Graduation Present",
            "Wedding Gift",
            "Baby Shower Gift"
        };

        public static readonly string[] Descriptions = new[]
        {
            "A beautiful gift box filled with chocolates and flowers",
            "Gift card to favorite restaurant",
            "Beautiful bouquet of roses and lilies",
            "Gourmet food basket with wines and cheeses",
            "Care package with books, tea, and comfort items",
            "Special commemorative gift",
            "Thoughtful present for a special occasion",
            "Handpicked items with love"
        };
    }

    /// <summary>
    /// Sample message templates
    /// </summary>
    public static class MessageTemplates
    {
        public static readonly string[] BirthdayMessages = new[]
        {
            "Happy Birthday! 🎉 Wishing you a day filled with love, laughter, and all your favorite things. May this year bring you endless joy and success!",
            "Happy Birthday to an amazing friend! 🎂 May your special day be filled with wonderful surprises and unforgettable moments!",
            "Wishing you the happiest of birthdays! 🎈 May all your dreams come true this year!",
            "Happy Birthday! 🎁 Hope your day is as special as you are!"
        };

        public static readonly string[] ThankYouMessages = new[]
        {
            "Thank you so much for everything! 🙏 Your kindness and support mean the world to me. I'm truly grateful to have you in my life.",
            "I can't thank you enough! Your generosity has touched my heart. Thank you! 💝",
            "Thanks a million! Your help made all the difference. 🌟"
        };

        public static readonly string[] CelebrationMessages = new[]
        {
            "Congratulations on your promotion! 🎊 Your hard work and dedication truly paid off. So proud of you!",
            "Happy Anniversary! 💕 Celebrating the beautiful journey you've shared together. Here's to many more years of love and happiness!",
            "Congratulations! 🎓 Your achievement is truly inspiring!"
        };

        public static readonly string[] WellWishesMessages = new[]
        {
            "Get well soon! 💐 Sending healing thoughts your way. Hope you feel better soon and are back on your feet in no time!",
            "Thinking of you and wishing you a speedy recovery! 🌺",
            "Sending you positive vibes and warm wishes! Get well soon! 💪"
        };
    }
}

