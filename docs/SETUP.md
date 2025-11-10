# Joy App - Setup Guide

This guide will help you set up and run the Joy mobile app with its .NET backend.

## 🎯 Overview

Joy is a mobile application that allows users to send gifts and birthday messages to their friends. It consists of:
- **Mobile App**: React Native with Expo (SDK 54)
- **Backend**: .NET 8 with Aspire, HotChocolate GraphQL, MongoDB, and RabbitMQ

## 📋 Prerequisites

### For Backend
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (for MongoDB and RabbitMQ)
- Visual Studio 2022 or VS Code with C# extension

### For Mobile App
- [Node.js](https://nodejs.org/) (LTS version)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/go) app on your iOS or Android device
- Xcode (for iOS simulator) or Android Studio (for Android emulator)

## 🚀 Backend Setup

### 1. Start the Backend

```bash
cd backend
dotnet restore
dotnet build Joy.sln
cd Joy.AppHost
dotnet run
```

The Aspire dashboard will open at `http://localhost:15000`. This dashboard shows:
- MongoDB status (automatically starts via Docker)
- RabbitMQ status (automatically starts via Docker)
- Joy.Api status

The GraphQL API will be available at: `http://localhost:5000/graphql`

### 2. Verify Backend is Running

Open your browser and navigate to:
- **GraphQL Playground**: http://localhost:5000/graphql
- **Aspire Dashboard**: http://localhost:15000

## 📱 Mobile App Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure API Endpoint

The API endpoint is automatically configured in `mobile/config/api.ts`:
- **Android Emulator**: Uses `http://10.0.2.2:5000/graphql`
- **iOS Simulator**: Uses `http://localhost:5000/graphql`
- **Physical Device**: Update to your machine's IP address (e.g., `http://192.168.1.100:5000/graphql`)

To use on a physical device:
1. Find your machine's IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` (look for inet address)
2. Update `mobile/config/api.ts` with your IP
3. Ensure your device is on the same WiFi network

### 3. Start the Mobile App

```bash
cd mobile
npm start
# or
npx expo start
```

This will open the Expo development tools. You can:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your device

## 🔐 Login

The app includes a demo authentication system:
- Use **any email and password** to login
- Example: email@example.com / password123

## ✨ Features

### 1. Authentication
- Login screen with email and password
- Session persistence
- Logout functionality

### 2. Home Screen
- View gift and message statistics
- Quick actions to send gifts or messages
- Pull-to-refresh to update data

### 3. Send Gifts
- Enter gift details (title, description)
- Add recipient information
- Sends via GraphQL to backend

### 4. Send Messages
- Write birthday messages
- **AI Generate**: Click to generate a message with AI (requires backend AI module configuration)
- Add recipient details
- Automatically sends via email (if configured)

### 5. View History
- **Gifts Tab**: See all sent gifts
- **Messages Tab**: See all sent messages
- Pull-to-refresh to update lists

### 6. Profile
- View your statistics
- Account settings
- Logout

## 🔧 Backend Configuration

### AI Message Generation (Optional)

To enable AI message generation, configure Azure OpenAI in `backend/Joy.Api/appsettings.json`:

```json
{
  "AzureOpenAI": {
    "Endpoint": "https://your-openai-resource.openai.azure.com/",
    "ApiKey": "your-api-key",
    "DeploymentName": "gpt-35-turbo"
  }
}
```

Without configuration, the AI module returns mock responses.

### Email/SMS/WhatsApp (Optional)

To enable actual message sending, configure in `backend/Joy.Api/appsettings.json`:

```json
{
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": "587",
    "SenderEmail": "your-email@gmail.com",
    "SenderPassword": "your-app-password"
  },
  "Twilio": {
    "AccountSid": "your-account-sid",
    "AuthToken": "your-auth-token",
    "PhoneNumber": "+1234567890",
    "WhatsAppNumber": "whatsapp:+14155238886"
  }
}
```

Without configuration, these services return mock success responses.

## 🐛 Troubleshooting

### Backend Issues

**MongoDB or RabbitMQ not starting:**
- Ensure Docker Desktop is running
- Restart the AppHost: `Ctrl+C` and `dotnet run` again

**Port 5000 already in use:**
- Stop other applications using port 5000
- Or change the port in `backend/Joy.Api/Properties/launchSettings.json`

### Mobile App Issues

**Cannot connect to backend:**
- Verify backend is running at http://localhost:5000/graphql
- If using physical device, update IP in `mobile/config/api.ts`
- Check firewall settings

**App won't start:**
- Clear cache: `npx expo start --clear`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

**Stuck on splash screen:**
- Check for errors in terminal
- Try restarting Expo: `Ctrl+C` and `npm start`

## 📚 GraphQL Schema

### Queries

```graphql
query {
  gifts(senderEmail: "user@example.com") {
    id
    title
    description
    recipientEmail
    recipientName
    createdAt
  }
  
  messages(senderEmail: "user@example.com") {
    id
    content
    recipientEmail
    recipientName
    createdAt
  }
}
```

### Mutations

```graphql
mutation SendGift {
  createGift(input: {
    title: "Birthday Gift"
    description: "A special present"
    senderEmail: "you@example.com"
    recipientEmail: "friend@example.com"
    recipientName: "Friend Name"
  }) {
    id
    title
  }
}

mutation SendMessage {
  createMessage(input: {
    content: "Happy Birthday!"
    senderEmail: "you@example.com"
    recipientEmail: "friend@example.com"
    recipientName: "Friend Name"
  }) {
    id
    content
  }
}

mutation GenerateAI {
  generateAIMessage(request: {
    prompt: "Generate a birthday message for Sarah"
    tone: "warm"
    language: "English"
  }) {
    generatedMessage
  }
}
```

## 🎨 Tech Stack

### Mobile
- React Native 0.81.5
- Expo SDK 54
- TypeScript
- Axios (GraphQL client)
- Async Storage (authentication)
- React Navigation

### Backend
- .NET 8
- Aspire 8 (orchestration)
- HotChocolate 13 (GraphQL)
- MongoDB (database)
- RabbitMQ (message broker)
- Azure OpenAI (AI messages - optional)
- Twilio (SMS/WhatsApp - optional)
- MailKit (Email - optional)

## 📝 Notes

- The app uses demo authentication - any email/password works
- Backend data persists in MongoDB (survives restarts)
- Pull-to-refresh on all list screens to reload data
- AI and communication features work with mock data if not configured

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure backend is running before starting mobile app
4. Check console logs for detailed error messages

## 🎉 Enjoy spreading joy!

