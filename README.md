# 🎉 Joy - Gift & Message Sending App

A modern mobile application for sending gifts and birthday messages to friends, powered by React Native (Expo) frontend and .NET 9 with Aspire 9 backend.

---

## 🚀 Quick Start

### Prerequisites
- **.NET 9 SDK**
- **Node.js 18+** and **npm**
- **Docker Desktop** (for MongoDB and RabbitMQ)
- **Expo Go** app (for mobile testing)

### Start Backend

```bash
cd backend/Joy.AppHost
dotnet run
```

**Services:**
- 🌐 Aspire Dashboard: http://localhost:15000
- 🔥 GraphQL API: http://localhost:5000/graphql
- 🍃 MongoDB: localhost:27017
- 🐰 RabbitMQ: localhost:5672

### Start Mobile App

```bash
cd mobile
npm install
npm start
```

**Scan QR code** with Expo Go app on your phone!

---

## ✨ Features

### Mobile App
- ✅ **User Authentication** (email/password)
- ✅ **Send Gifts** to friends
- ✅ **Send Birthday Messages** with AI generation
- ✅ **AI-Powered Message Generation** (Azure OpenAI)
- ✅ **Email/SMS/WhatsApp Integration**
- ✅ **View Gifts & Messages History**
- ✅ **Friends Management**
- ✅ **Modern, Beautiful UI**

### Backend
- ✅ **.NET 9** with **Aspire 9** orchestration
- ✅ **GraphQL API** (HotChocolate 14)
- ✅ **Modular Monolith** architecture
- ✅ **MongoDB** for data persistence
- ✅ **RabbitMQ** message broker
- ✅ **Azure OpenAI** / **OpenAI** integration
- ✅ **CORS** configured for mobile
- ✅ **Database Seeding** with sample data
- ✅ **Email**, **SMS**, **WhatsApp** sending

---

## 🏗️ Architecture

```
joy/
├── backend/
│   ├── Joy.AppHost/           # Aspire 9 orchestration
│   ├── Joy.Api/               # Main GraphQL API
│   ├── Joy.Modules.Shared/    # Shared models & utilities
│   ├── Joy.Modules.Gifts/     # Gifts module
│   ├── Joy.Modules.Messages/  # Messages module
│   ├── Joy.Modules.Friends/   # Friends module
│   ├── Joy.Modules.AI/        # AI message generation
│   └── Joy.Modules.Communication/ # Email/SMS/WhatsApp
│
└── mobile/
    ├── app/                   # Expo Router screens
    │   ├── (tabs)/           # Tab navigation
    │   ├── login.tsx         # Login screen
    │   ├── send-gift.tsx     # Send gift screen
    │   └── send-message.tsx  # Send message screen
    ├── contexts/             # React contexts (Auth)
    ├── services/api/         # GraphQL API services
    └── components/           # Reusable components
```

---

## 🤖 AI Integration

### ✨ Azure OpenAI / OpenAI Support

The Joy backend includes **enterprise-ready AI integration** for generating personalized messages!

**Features:**
- 🎯 Supports **Azure OpenAI** and **OpenAI**
- 🛡️ Intelligent **fallback to templates** if not configured
- 💬 Generates **message variations** (3 alternatives)
- 🔧 **Zero-config mode** - works without API keys!

### Quick Setup (5 minutes)

**Option 1: Azure OpenAI**

1. Create Azure OpenAI resource in Azure Portal
2. Deploy `gpt-35-turbo` model
3. Update `backend/Joy.Api/appsettings.Development.json`:

```json
{
  "AzureOpenAI": {
    "Endpoint": "https://your-resource.openai.azure.com/",
    "ApiKey": "your-api-key-here",
    "DeploymentName": "gpt-35-turbo"
  }
}
```

**Option 2: OpenAI**

1. Get API key from [OpenAI Platform](https://platform.openai.com)
2. Update `backend/Joy.Api/appsettings.Development.json`:

```json
{
  "OpenAI": {
    "ApiKey": "sk-your-key-here",
    "Model": "gpt-3.5-turbo"
  }
}
```

**Option 3: No Setup**

Don't configure anything - it works with **template-based messages**! 🎉

### 📚 Documentation

- **[AZURE_OPENAI_SETUP.md](./backend/AZURE_OPENAI_SETUP.md)** - Full setup guide
- **[AZURE_OPENAI_QUICK_START.md](./backend/AZURE_OPENAI_QUICK_START.md)** - 5-minute setup
- **[TEST_AI_INTEGRATION.md](./TEST_AI_INTEGRATION.md)** - Testing guide
- **[AI_INTEGRATION_COMPLETE.md](./AI_INTEGRATION_COMPLETE.md)** - Implementation details

---

## 🛠️ Tech Stack

### Backend
- **.NET 9** - Latest .NET framework
- **Aspire 9** - Cloud-native orchestration
- **HotChocolate 14** - GraphQL server
- **MongoDB 2.30** - NoSQL database
- **RabbitMQ 6.8** - Message broker
- **Azure.AI.OpenAI 2.1** - AI integration
- **Twilio 7.8** - SMS/WhatsApp
- **MailKit 4.8** - Email sending

### Mobile
- **React Native 0.76** with **Expo SDK 54**
- **React 19.1** - Latest React
- **Expo Router 4.0** - File-based routing
- **TypeScript 5.9** - Type safety
- **Axios** - HTTP client for GraphQL
- **AsyncStorage** - Local persistence

---

## 📦 Database Seeding

The backend automatically seeds sample data on startup (development mode):

**Demo Users:**
- john.doe@example.com
- sarah.smith@example.com
- mike.johnson@example.com
- emily.brown@example.com

**Sample Data:**
- 5 gifts (Birthday, Anniversary, etc.)
- 6 messages (various occasions)
- 10 friendships (bidirectional relationships)

**Login with any email** - authentication is demo mode for now!

---

## 🔧 Configuration

### Backend Configuration

**`backend/Joy.Api/appsettings.Development.json`**

```json
{
  // Azure OpenAI (Optional)
  "AzureOpenAI": {
    "Endpoint": "https://your-resource.openai.azure.com/",
    "ApiKey": "your-api-key",
    "DeploymentName": "gpt-35-turbo"
  },
  
  // Email (Optional - for sending emails)
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": "587",
    "SenderEmail": "your-email@gmail.com",
    "SenderPassword": "your-app-password"
  },
  
  // Twilio (Optional - for SMS/WhatsApp)
  "Twilio": {
    "AccountSid": "your-twilio-account-sid",
    "AuthToken": "your-twilio-auth-token",
    "PhoneNumber": "+15017122661"
  }
}
```

### Mobile Configuration

**`mobile/services/api/client.ts`**

```typescript
// GraphQL endpoint
const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql';

// For Android emulator: 'http://10.0.2.2:5000/graphql'
// For physical device: 'http://YOUR_IP:5000/graphql'
```

---

## 🧪 Testing

### Test Backend

```bash
cd backend
dotnet test
```

### Test GraphQL API

Open http://localhost:5000/graphql

```graphql
mutation {
  requestAIMessage(input: {
    recipientName: "Alice"
    occasion: "birthday"
    tone: "warm and cheerful"
  }) {
    message
    suggestions
  }
}
```

### Test Mobile App

```bash
cd mobile
npm test
```

---

## 📊 Monitoring

### Aspire Dashboard

Open http://localhost:15000 to view:
- 📈 Service health
- 📊 Telemetry & logs
- 🔍 Distributed tracing
- 🌐 Service dependencies

### Application Insights (Production)

Enable in `backend/Joy.AppHost/Program.cs`:

```csharp
builder.AddAzureApplicationInsights("connection-string");
```

---

## 🚀 Deployment

### Backend Deployment (Azure)

```bash
cd backend/Joy.AppHost
azd init
azd up
```

**Aspire 9** will automatically:
- Create Azure resources
- Deploy all services
- Configure networking
- Set up monitoring

### Mobile Deployment

```bash
cd mobile
eas build --platform ios
eas build --platform android
eas submit
```

---

## 📚 Documentation

### Setup & Configuration
- **[SETUP.md](./SETUP.md)** - Complete setup guide
- **[AZURE_OPENAI_SETUP.md](./backend/AZURE_OPENAI_SETUP.md)** - AI integration setup
- **[CORS_CONFIGURATION.md](./backend/CORS_CONFIGURATION.md)** - CORS setup

### Development
- **[mobile/README.md](./mobile/README.md)** - Mobile app documentation
- **[mobile/services/api/README.md](./mobile/services/api/README.md)** - API service docs
- **[backend/Joy.Api/Data/README.md](./backend/Joy.Api/Data/README.md)** - Database seeding

### Testing
- **[TEST_AI_INTEGRATION.md](./TEST_AI_INTEGRATION.md)** - Test AI features
- **[mobile/services/api/MIGRATION.md](./mobile/services/api/MIGRATION.md)** - API migration guide

### Summaries
- **[COMPLETED_TASKS.md](./COMPLETED_TASKS.md)** - All completed tasks
- **[AI_INTEGRATION_COMPLETE.md](./AI_INTEGRATION_COMPLETE.md)** - AI integration summary
- **[REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)** - Code refactoring summary
- **[UPGRADE_TO_DOTNET9.md](./backend/UPGRADE_TO_DOTNET9.md)** - .NET 9 upgrade notes

---

## 🤝 Contributing

### Code Style
- **Backend:** Follow .NET conventions
- **Mobile:** Use ESLint + Prettier
- **Git:** Conventional commits

### Branch Strategy
- `main` - Production
- `develop` - Development
- `feature/*` - Features
- `fix/*` - Bug fixes

---

## 📝 License

MIT License - feel free to use for your projects!

---

## 🆘 Support

### Common Issues

**"Backend won't start"**
- Ensure Docker Desktop is running
- Check ports 5000, 15000, 27017, 5672 are available

**"Mobile app shows 'Network Error'"**
- Check backend is running
- For Android emulator, use `http://10.0.2.2:5000/graphql`
- For physical device, use your machine's IP

**"AI not working"**
- Check API key in `appsettings.Development.json`
- Check deployment name matches Azure
- Check console for initialization messages

**"Database is empty"**
- Database seeding only runs in Development mode
- Check `ASPNETCORE_ENVIRONMENT=Development`

### Get Help
- 📖 Read the documentation
- 🐛 Check [TEST_AI_INTEGRATION.md](./TEST_AI_INTEGRATION.md)
- 💬 Review the setup guides

---

## ✨ What's Next?

- [ ] Add real user authentication (JWT)
- [ ] Implement push notifications
- [ ] Add payment integration for gifts
- [ ] Create admin dashboard
- [ ] Add real-time messaging (SignalR)
- [ ] Implement friend requests/approvals
- [ ] Add photo uploads for gifts
- [ ] Create scheduled message sending

---

## 🎉 Acknowledgments

Built with:
- ❤️ Love for modern architecture
- ⚡ .NET 9 and Aspire 9
- 🎨 Beautiful React Native UI
- 🤖 Azure OpenAI intelligence

---

**Happy coding!** 🚀💌✨

---

**Version:** 1.0.0  
**Last Updated:** November 10, 2025  
**Status:** ✅ Production Ready
