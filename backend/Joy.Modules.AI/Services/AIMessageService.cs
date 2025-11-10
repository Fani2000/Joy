using Azure;
using Azure.AI.OpenAI;
using OpenAI.Chat;
using Joy.Modules.AI.Models;
using Microsoft.Extensions.Configuration;
using System.ClientModel;

namespace Joy.Modules.AI.Services;

public class AIMessageService
{
    private readonly ChatClient? _chatClient;
    private readonly IConfiguration _configuration;
    private readonly bool _isConfigured;

    public AIMessageService(IConfiguration configuration)
    {
        _configuration = configuration;
        
        try
        {
            var apiKey = configuration["AzureOpenAI:ApiKey"] ?? configuration["OpenAI:ApiKey"];
            var endpoint = configuration["AzureOpenAI:Endpoint"];
            var deploymentName = configuration["AzureOpenAI:DeploymentName"] ?? configuration["OpenAI:Model"] ?? "gpt-35-turbo";

            if (!string.IsNullOrEmpty(apiKey))
            {
                if (!string.IsNullOrEmpty(endpoint))
                {
                    // Azure OpenAI
                    var azureClient = new AzureOpenAIClient(
                        new Uri(endpoint),
                        new ApiKeyCredential(apiKey)
                    );
                    _chatClient = azureClient.GetChatClient(deploymentName);
                    _isConfigured = true;
                    Console.WriteLine($"✅ Azure OpenAI configured with deployment: {deploymentName}");
                }
                else
                {
                    // OpenAI
                    var openAIClient = new OpenAI.OpenAIClient(new ApiKeyCredential(apiKey));
                    _chatClient = openAIClient.GetChatClient(deploymentName);
                    _isConfigured = true;
                    Console.WriteLine($"✅ OpenAI configured with model: {deploymentName}");
                }
            }
            else
            {
                Console.WriteLine("⚠️  AI API key not configured. Using template-based messages.");
                _isConfigured = false;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️  Failed to initialize AI client: {ex.Message}. Using template-based messages.");
            _isConfigured = false;
        }
    }

    public async Task<AIMessageResponse> GenerateMessageAsync(AIMessageRequest request)
    {
        // If AI is not configured or fails, use template-based fallback
        if (!_isConfigured || _chatClient == null)
        {
            return GenerateFallbackMessage(request);
        }

        try
        {
            var prompt = BuildPrompt(request);

            var messages = new List<ChatMessage>
            {
                new SystemChatMessage("You are a helpful assistant that creates warm, personalized messages for special occasions. Generate heartfelt messages that are sincere and appropriate."),
                new UserChatMessage(prompt)
            };

            var options = new ChatCompletionOptions
            {
                MaxOutputTokenCount = 500,
                Temperature = 0.7f
            };

            var response = await _chatClient.CompleteChatAsync(messages, options);
            var mainMessage = response.Value.Content[0].Text;

            // Generate variations
            var variations = await GenerateVariationsAsync(request, mainMessage);

            return new AIMessageResponse
            {
                Message = mainMessage,
                Suggestions = variations
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️  AI generation failed: {ex.Message}. Using fallback.");
            // Fallback to template-based messages if AI fails
            return GenerateFallbackMessage(request);
        }
    }

    private string BuildPrompt(AIMessageRequest request)
    {
        var prompt = $"Create a {request.Tone} {request.Occasion} message for {request.RecipientName}.";
        
        if (!string.IsNullOrEmpty(request.AdditionalDetails))
        {
            prompt += $" Additional context: {request.AdditionalDetails}";
        }

        prompt += " Keep it warm, sincere, and under 200 words.";
        
        return prompt;
    }

    private async Task<List<string>> GenerateVariationsAsync(AIMessageRequest request, string originalMessage)
    {
        var variations = new List<string>();

        if (!_isConfigured || _chatClient == null)
        {
            return variations;
        }

        try
        {
            var prompt = $"Based on this {request.Occasion} message: \"{originalMessage}\", " +
                        "generate 2 shorter alternative versions (50-75 words each) with different tones.";

            var messages = new List<ChatMessage>
            {
                new SystemChatMessage("Generate brief, alternative message variations."),
                new UserChatMessage(prompt)
            };

            var options = new ChatCompletionOptions
            {
                MaxOutputTokenCount = 300,
                Temperature = 0.8f
            };

            var response = await _chatClient.CompleteChatAsync(messages, options);
            var content = response.Value.Content[0].Text;
            
            // Parse variations (simple split by newlines)
            variations = content.Split('\n', StringSplitOptions.RemoveEmptyEntries)
                .Where(s => !string.IsNullOrWhiteSpace(s) && s.Length > 20)
                .Take(2)
                .ToList();
        }
        catch
        {
            // Return empty list on failure
        }

        return variations;
    }

    private AIMessageResponse GenerateFallbackMessage(AIMessageRequest request)
    {
        var templates = new Dictionary<string, List<string>>
        {
            ["birthday"] = new List<string>
            {
                $"Happy Birthday, {request.RecipientName}! 🎉 Wishing you a day filled with joy, laughter, and all the things that make you smile. May this year bring you endless happiness and amazing adventures!",
                $"🎂 Happy Birthday to an amazing person! {request.RecipientName}, may your special day be as wonderful as you are. Here's to another year of great memories and success!",
                $"Warmest birthday wishes to you, {request.RecipientName}! May this year be your best one yet, filled with love, prosperity, and unforgettable moments. Celebrate big! 🎈"
            },
            ["congratulations"] = new List<string>
            {
                $"Congratulations, {request.RecipientName}! 🎊 Your hard work and dedication have truly paid off. This achievement is well-deserved, and I'm so proud of you!",
                $"Way to go, {request.RecipientName}! This is a huge accomplishment, and you should be incredibly proud. Here's to your continued success! 🌟",
                $"Fantastic news, {request.RecipientName}! Your achievement is inspiring, and I can't wait to see what you accomplish next. Congratulations! 🎉"
            },
            ["thankyou"] = new List<string>
            {
                $"Thank you so much, {request.RecipientName}! Your kindness and generosity mean the world to me. I'm truly grateful for everything you've done. 🙏",
                $"Dear {request.RecipientName}, I wanted to express my heartfelt thanks. Your support has made such a difference, and I'm incredibly appreciative!",
                $"A big thank you to you, {request.RecipientName}! Your thoughtfulness never goes unnoticed, and I'm so lucky to have you in my life. 💙"
            },
            ["anniversary"] = new List<string>
            {
                $"Happy Anniversary, {request.RecipientName}! 💕 Celebrating the beautiful journey you've shared. Here's to many more years of love and happiness!",
                $"Congratulations on your anniversary, {request.RecipientName}! May your love continue to grow stronger with each passing year. 💑",
                $"Wishing you both a very Happy Anniversary! {request.RecipientName}, your love story is truly inspiring. Cheers to forever! 🥂"
            },
            ["getwell"] = new List<string>
            {
                $"Get well soon, {request.RecipientName}! 💐 Sending healing thoughts your way. Hope you feel better soon and are back on your feet in no time!",
                $"Thinking of you, {request.RecipientName}! Wishing you a speedy recovery. Take care and rest up! 🌺",
                $"Sending you positive vibes and warm wishes, {request.RecipientName}! Get well soon! 💪"
            }
        };

        var occasion = request.Occasion.ToLower().Replace(" ", "");
        var messages = templates.ContainsKey(occasion) 
            ? templates[occasion] 
            : templates["birthday"];

        return new AIMessageResponse
        {
            Message = messages[0],
            Suggestions = messages.Skip(1).ToList()
        };
    }
}
