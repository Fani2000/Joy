# 🐳 Joy Backend - Docker & DevOps

## 📁 Directory Structure

```
devops/
├── docker/
│   ├── docker-compose.yml    # Main Docker Compose configuration
│   ├── mongo-init.js          # MongoDB initialization script
│   └── env.template           # Environment variables template
│
└── scripts/
    ├── start.sh               # Start all services
    ├── stop.sh                # Stop all services
    ├── logs.sh                # View service logs
    └── clean.sh               # Clean up all data
```

---

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git Bash (Windows) or Terminal (Mac/Linux)

### 1. Start All Services

```bash
cd backend/devops/scripts
./start.sh
```

This will:
- Pull required Docker images (MongoDB, RabbitMQ)
- Build the Joy.Api image
- Start all services
- Wait for health checks
- Display service URLs

### 2. Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| **GraphQL API** | http://localhost:5000/graphql | - |
| **RabbitMQ Management** | http://localhost:15672 | guest / guest |
| **MongoDB** | mongodb://localhost:27017 | admin / admin123 |

---

## 📦 Services

### 1. MongoDB
- **Port:** 27017
- **Database:** joy
- **Collections:** gifts, messages, friendships
- **Indexes:** Automatically created for optimal performance

### 2. RabbitMQ
- **Port:** 5672 (AMQP)
- **Management UI:** 15672
- **User:** guest / guest

### 3. Joy.Api
- **Port:** 5000 (HTTP)
- **GraphQL Endpoint:** /graphql
- **Auto-seeding:** Enabled in development
- **Health Check:** Available at /health

---

## 🔧 Management Scripts

### Start Services
```bash
./devops/scripts/start.sh
```

### Stop Services
```bash
./devops/scripts/stop.sh
```

### View Logs
```bash
# All services
./devops/scripts/logs.sh

# Specific service
./devops/scripts/logs.sh joy-api
./devops/scripts/logs.sh mongodb
./devops/scripts/logs.sh rabbitmq
```

### Clean Everything
```bash
./devops/scripts/clean.sh
```
⚠️ This deletes all data!

---

## 🔨 Manual Docker Commands

### Build API Image
```bash
cd backend
docker build -t joy-api:latest -f Joy.Api/Dockerfile .
```

### Start Services
```bash
cd backend/devops/docker
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f joy-api
```

### Restart a Service
```bash
docker-compose restart joy-api
```

### Remove Volumes
```bash
docker-compose down -v
```

---

## 🐛 Troubleshooting

### Services Won't Start

**Check Docker is running:**
```bash
docker ps
```

**Check logs:**
```bash
cd backend/devops/docker
docker-compose logs
```

### MongoDB Connection Issues

**Test connection:**
```bash
docker exec -it joy-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
```

### RabbitMQ Connection Issues

**Check RabbitMQ status:**
```bash
docker exec -it joy-rabbitmq rabbitmq-diagnostics status
```

### API Won't Start

**Check API logs:**
```bash
docker-compose logs joy-api
```

**Common issues:**
- MongoDB not ready → Wait for health check
- RabbitMQ not ready → Wait for health check
- Port 5000 already in use → Stop other processes using port 5000

---

## 📝 Environment Variables

Copy `env.template` to `.env` and customize:

```bash
cd backend/devops/docker
cp env.template .env
```

**Important variables:**

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB admin username | admin |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB admin password | admin123 |
| `RABBITMQ_DEFAULT_USER` | RabbitMQ username | guest |
| `RABBITMQ_DEFAULT_PASS` | RabbitMQ password | guest |
| `DatabaseSeeding__Enabled` | Enable auto-seeding | true |

---

## 🔐 Security Notes

### Development
- Default credentials are used (fine for local development)
- Seeding is enabled by default

### Production
- **Change all default passwords!**
- Use environment variables or secrets management
- Disable database seeding
- Enable HTTPS
- Use proper authentication

---

## 📊 Monitoring

### Health Checks

All services have health checks:

**MongoDB:**
```bash
docker-compose exec mongodb mongosh --eval "db.runCommand('ping')"
```

**RabbitMQ:**
```bash
docker-compose exec rabbitmq rabbitmq-diagnostics ping
```

**Joy.Api:**
```bash
curl http://localhost:5000/graphql
```

### View Service Status
```bash
docker-compose ps
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Start services
      run: |
        cd backend/devops/docker
        docker-compose up -d
        
    - name: Wait for services
      run: |
        cd backend/devops/scripts
        ./wait-for-services.sh
        
    - name: Run tests
      run: |
        cd backend
        dotnet test
        
    - name: Stop services
      run: |
        cd backend/devops/docker
        docker-compose down
```

---

## 🐳 Docker Compose Services

```yaml
services:
  mongodb:
    - Database storage
    - Automatic initialization
    - Health checks
    
  rabbitmq:
    - Message broker
    - Management UI
    - Health checks
    
  joy-api:
    - GraphQL API
    - Auto-seeding
    - Health checks
    - Depends on MongoDB & RabbitMQ
```

---

## 📈 Performance

### Resource Usage

| Service | CPU | Memory | Disk |
|---------|-----|--------|------|
| MongoDB | ~10% | ~100MB | ~50MB |
| RabbitMQ | ~5% | ~150MB | ~20MB |
| Joy.Api | ~15% | ~200MB | ~100MB |

### Optimization Tips

1. **Increase Docker resources** in Docker Desktop settings
2. **Use volumes** for persistent data
3. **Enable caching** for faster builds
4. **Use health checks** to ensure services are ready

---

## ✅ Success Criteria

After running `./start.sh`, you should see:

```
✅ MongoDB is ready
✅ RabbitMQ is ready
✅ Joy.Api is ready

🎉 All services are up and running!

📊 Service URLs:
  - GraphQL API:         http://localhost:5000/graphql
  - RabbitMQ Management: http://localhost:15672
  - MongoDB:             mongodb://admin:admin123@localhost:27017
```

---

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [RabbitMQ Docker Image](https://hub.docker.com/_/rabbitmq)
- [.NET Docker Images](https://hub.docker.com/_/microsoft-dotnet)

---

**Last Updated:** November 10, 2025  
**Docker Compose Version:** 3.8  
**Status:** ✅ Ready for use

