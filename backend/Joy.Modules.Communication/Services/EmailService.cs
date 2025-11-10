using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;

namespace Joy.Modules.Communication.Services;

public class EmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<bool> SendEmailAsync(string toEmail, string subject, string message)
    {
        try
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_configuration["Email:From"] ?? "noreply@joy.com"));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            var builder = new BodyBuilder
            {
                HtmlBody = $@"
                    <html>
                    <body style='font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;'>
                        <div style='max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);'>
                            <div style='text-align: center; margin-bottom: 30px;'>
                                <h1 style='color: #6366f1; font-size: 36px; margin: 0;'>✨ Joy</h1>
                                <p style='color: #8b5cf6; margin-top: 5px;'>Spreading happiness</p>
                            </div>
                            <div style='color: #1f2937; line-height: 1.6; font-size: 16px;'>
                                {message.Replace("\n", "<br>")}
                            </div>
                            <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;'>
                                <p>Sent with love from the Joy app 💝</p>
                            </div>
                        </div>
                    </body>
                    </html>"
            };

            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            
            var smtpHost = _configuration["Email:SmtpHost"] ?? "smtp.gmail.com";
            var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            var username = _configuration["Email:Username"];
            var password = _configuration["Email:Password"];

            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                // Demo mode - simulate success
                await Task.Delay(500);
                Console.WriteLine($"[DEMO] Email would be sent to {toEmail}");
                return true;
            }

            await smtp.ConnectAsync(smtpHost, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(username, password);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);

            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Email send error: {ex.Message}");
            return false;
        }
    }
}

