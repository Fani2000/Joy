# 🎯 Joy Backend

## 📁 Directory Structure

```
backend/
├── src/                              # Source code
│   ├── Joy.Api/                      # Main GraphQL API
│   ├── Joy.AppHost/                  # Aspire orchestration (for local dev)
│   ├── Joy.Modules.Shared/           # Shared models and utilities
│   ├── Joy.Modules.Gifts/            # Gifts module
│   ├── Joy.Modules.Messages/         # Messages module
│   ├── Joy.Modules.Friends/          # Friends module
│   ├── Joy.Modules.AI/               # AI message generation
│   ├── Joy.Modules.Communication/    # Email/SMS/WhatsApp
│   ├── Joy.sln                       # Solution file
│   └── *.md                          # Documentation
│
└── devops/                           # DevOps infrastructure
    ├── docker/
    │   ├── docker-compose.yml        # Docker orchestration
    │   ├── mongo-init.js             # MongoDB initialization
    │   └── env.template              # Environment variables
    │
    ├── scripts/
    │   ├── start.sh                  # Start all services
    │   ├── stop.sh                   # Stop all services
    │   ├── logs.sh                   # View logs
    │   └── clean.sh                  # Clean everything
    │
    ├── kubernetes/                   # K8s manifests (future)
    └── README.md                     # DevOps documentation
```

---

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
cd devops/scripts
./start.sh
```

This starts MongoDB, RabbitMQ, and Joy.Api in Docker containers.

**Access:**
- GraphQL API: http://localhost:5000/graphql
- RabbitMQ UI: http://localhost:15672 (guest/guest)
- MongoDB: mongodb://admin:admin123@localhost:27017

### Using Aspire (Local Development)

```bash
cd src/Joy.AppHost
dotnet run
```

This starts all services using .NET Aspire orchestration.

**Access:**
- Aspire Dashboard: http://localhost:15000
- GraphQL API: http://localhost:5000/graphql

---

## 🏗️ Architecture

### Modular Monolith

The backend follows a modular monolith architecture:

- **Joy.Api**: Main entry point, GraphQL endpoint
- **Joy.Modules.***: Independent modules with their own logic
- **Joy.Modules.Shared**: Cross-cutting concerns

### Technology Stack

- **.NET 9**: Latest .NET framework
- **Aspire 9**: Cloud-native orchestration
- **HotChocolate 14**: GraphQL server
- **MongoDB 2.30**: NoSQL database
- **RabbitMQ 6.8**: Message broker
- **Azure OpenAI 2.1**: AI integration (optional)
- **Docker**: Containerization

---

## 📦 Services

### 1. Joy.Api (Port 5000)
Main GraphQL API that exposes all functionality.

**Features:**
- GraphQL queries and mutations
- CORS enabled for mobile app
- Auto-seeding in development
- Health checks

### 2. MongoDB (Port 27017)
NoSQL database for storing gifts, messages, and friendships.

**Collections:**
- gifts
- messages
- friendships

### 3. RabbitMQ (Port 5672)
Message broker for asynchronous operations.

---

## 🔧 Development

### Prerequisites
- .NET 9 SDK
- Docker Desktop (for Docker mode)
- Git Bash (Windows) or Terminal (Mac/Linux)

### Build Solution

```bash
cd src
dotnet build Joy.sln
```

### Run Tests

```bash
cd src
dotnet test
```

### Run Locally (Aspire)

```bash
cd src/Joy.AppHost
dotnet run
```

### Run with Docker

```bash
cd devops/scripts
./start.sh
```

---

## 📝 Environment Variables

### Development

Copy `devops/docker/env.template` to `.env` and configure:

```bash
# MongoDB
MONGO_INITDB_ROOT_PASSWORD=admin123

# Database Seeding
DatabaseSeeding__Enabled=true

# Azure OpenAI (Optional)
AzureOpenAI__ApiKey=your-key-here
AzureOpenAI__Endpoint=https://your-resource.openai.azure.com/

# Email (Optional)
EmailSettings__SenderEmail=your-email@gmail.com
EmailSettings__SenderPassword=your-app-password

# Twilio (Optional)
Twilio__AccountSid=your-account-sid
Twilio__AuthToken=your-auth-token
```

---

## 🐳 Docker

### Build Image

```bash
cd src
docker build -t joy-api:latest -f Joy.Api/Dockerfile .
```

### Start Services

```bash
cd devops/docker
docker-compose up -d
```

### View Logs

```bash
docker-compose logs -f joy-api
```

### Stop Services

```bash
docker-compose down
```

---

## 📊 Database

### Seed Data

Database seeding runs automatically in development mode.

**Sample data includes:**
- 5 gifts
- 6 messages
- 10 friendships
- 4 demo users

### Access MongoDB

```bash
# Using Docker
docker exec -it joy-mongodb mongosh -u admin -p admin123

# Connection string
mongodb://admin:admin123@localhost:27017/joy?authSource=admin
```

---

## 🧪 Testing

### GraphQL Playground

Open: http://localhost:5000/graphql

**Example query:**
```graphql
query {
  gifts(userEmail: "john.doe@example.com") {
    id
    title
    recipientName
  }
}
```

**Example mutation:**
```graphql
mutation {
  sendGift(input: {
    title: "Birthday Gift"
    description: "Special present"
    recipientEmail: "friend@example.com"
    recipientName: "Friend Name"
  }) {
    id
    title
  }
}
```

---

## 🔒 Security

### Development
- Default credentials are used
- CORS allows all origins
- Database seeding is enabled
- HTTP is used (not HTTPS)

### Production
- ⚠️  Change all default passwords
- ⚠️  Restrict CORS origins
- ⚠️  Disable database seeding
- ⚠️  Enable HTTPS
- ⚠️  Use Azure Key Vault for secrets
- ⚠️  Implement authentication & authorization

---

## 📚 Documentation

### Source Code
- **[src/Joy.Api/](src/Joy.Api/)** - Main API documentation
- **[src/Joy.Modules.*/](src/)** - Module-specific docs

### DevOps
- **[devops/README.md](devops/README.md)** - Complete DevOps guide
- **[devops/docker/](devops/docker/)** - Docker configuration

### Guides
- **[src/AZURE_OPENAI_SETUP.md](src/AZURE_OPENAI_SETUP.md)** - AI integration
- **[src/DATABASE_SEEDING.md](src/DATABASE_SEEDING.md)** - Database seeding
- **[src/CORS_CONFIGURATION.md](src/CORS_CONFIGURATION.md)** - CORS setup

---

## 🚢 Deployment

### Azure Container Apps

```bash
cd devops/docker
az containerapp up --name joy-api --resource-group joy-rg
```

### Kubernetes

```bash
# Coming soon
cd devops/kubernetes
kubectl apply -f .
```

### Docker Swarm

```bash
cd devops/docker
docker stack deploy -c docker-compose.yml joy
```

---

## 🐛 Troubleshooting

### Build Errors

```bash
cd src
dotnet clean
dotnet restore
dotnet build
```

### Docker Issues

```bash
cd devops/scripts
./clean.sh
./start.sh
```

### Database Connection

```bash
# Check MongoDB is running
docker ps | grep mongodb

# Test connection
docker exec -it joy-mongodb mongosh --eval "db.runCommand('ping')"
```

---

## 🤝 Contributing

1. Create a feature branch
2. Make changes in `src/`
3. Test with Docker: `./devops/scripts/start.sh`
4. Commit changes
5. Create pull request

---

## 📊 Monitoring

### Health Checks

- API: http://localhost:5000/health
- MongoDB: `docker exec joy-mongodb mongosh --eval "db.runCommand('ping')"`
- RabbitMQ: http://localhost:15672

### Logs

```bash
# All services
./devops/scripts/logs.sh

# Specific service
./devops/scripts/logs.sh joy-api
```

---

## ✅ Summary

- **Architecture:** Modular Monolith
- **Language:** C# (.NET 9)
- **API:** GraphQL (HotChocolate 14)
- **Database:** MongoDB
- **Message Broker:** RabbitMQ
- **Orchestration:** Docker Compose / Aspire
- **Containerization:** Docker

**Quick Start:**
```bash
cd devops/scripts
./start.sh
```

**Access:**
```
http://localhost:5000/graphql
```

---

**Last Updated:** November 10, 2025  
**Status:** ✅ Ready for Development

