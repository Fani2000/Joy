# 🐳 Docker Setup Complete!

## ✅ What's Been Created

### 1. **Docker Infrastructure** 📦

```
backend/
├── devops/
│   ├── docker/
│   │   ├── docker-compose.yml      # Multi-service orchestration
│   │   ├── mongo-init.js           # MongoDB initialization
│   │   └── env.template            # Environment variables template
│   │
│   ├── scripts/
│   │   ├── start.sh                # 🚀 Start all services
│   │   ├── stop.sh                 # 🛑 Stop all services
│   │   ├── logs.sh                 # 📋 View logs
│   │   └── clean.sh                # 🗑️  Clean everything
│   │
│   └── README.md                   # Complete documentation
│
└── Joy.Api/
    ├── Dockerfile                  # API container definition
    └── .dockerignore               # Files to exclude from build
```

---

## 🚀 Quick Start

### Option 1: Using Scripts (Recommended)

```bash
cd backend/devops/scripts
./start.sh
```

**This will:**
- ✅ Pull MongoDB and RabbitMQ images
- ✅ Build Joy.Api Docker image
- ✅ Start all services with health checks
- ✅ Wait until everything is ready
- ✅ Display service URLs

### Option 2: Using Docker Compose Directly

```bash
cd backend/devops/docker
docker-compose up -d
```

---

## 📊 Services Included

| Service | Port | Description | Management UI |
|---------|------|-------------|---------------|
| **MongoDB** | 27017 | NoSQL database | - |
| **RabbitMQ** | 5672 | Message broker | http://localhost:15672 |
| **Joy.Api** | 5000 | GraphQL API | http://localhost:5000/graphql |

---

## 🔧 Management

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
```

### Clean Everything (⚠️  Deletes all data)
```bash
./devops/scripts/clean.sh
```

---

## 📝 Configuration

### Environment Variables

**File:** `backend/devops/docker/env.template`

Copy to `.env` and customize:

```bash
cd backend/devops/docker
cp env.template .env
```

**Key Variables:**
- `MONGO_INITDB_ROOT_PASSWORD` - MongoDB admin password
- `RABBITMQ_DEFAULT_PASS` - RabbitMQ password
- `DatabaseSeeding__Enabled` - Auto-seed database (default: true)
- `AzureOpenAI__ApiKey` - Optional AI integration

---

## 🎯 Access Points

After starting services, access:

### GraphQL Playground
```
http://localhost:5000/graphql
```

Test query:
```graphql
query {
  gifts(userEmail: "john.doe@example.com") {
    id
    title
    recipientName
  }
}
```

### RabbitMQ Management
```
http://localhost:15672
Username: guest
Password: guest
```

### MongoDB
```bash
# Using mongosh
docker exec -it joy-mongodb mongosh -u admin -p admin123

# Connection string
mongodb://admin:admin123@localhost:27017/joy?authSource=admin
```

---

## 🔍 Health Checks

All services include health checks for reliable startup:

### Check Service Status
```bash
cd backend/devops/docker
docker-compose ps
```

**Expected output:**
```
NAME         STATUS                    PORTS
joy-api      Up (healthy)              0.0.0.0:5000->5000/tcp
joy-mongodb  Up (healthy)              0.0.0.0:27017->27017/tcp
joy-rabbitmq Up (healthy)              0.0.0.0:5672->5672/tcp
```

---

## 📦 What Docker Compose Does

```yaml
1. MongoDB
   - Creates 'joy' database
   - Sets up collections: gifts, messages, friendships
   - Creates indexes for performance
   - Persistent volume for data

2. RabbitMQ
   - Message broker for async operations
   - Management UI enabled
   - Default credentials configured

3. Joy.Api
   - Built from source
   - Waits for MongoDB & RabbitMQ to be healthy
   - Auto-seeds database in development
   - Exposes GraphQL endpoint
```

---

## 🐛 Troubleshooting

### Services Won't Start

**1. Check Docker is running:**
```bash
docker ps
```

**2. Check logs:**
```bash
cd backend/devops/docker
docker-compose logs
```

**3. Check ports are available:**
```bash
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :27017
netstat -ano | findstr :5672

# Mac/Linux
lsof -i :5000
lsof -i :27017
lsof -i :5672
```

### MongoDB Connection Issues

```bash
# Test connection
docker exec -it joy-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin

# Check logs
docker logs joy-mongodb
```

### RabbitMQ Issues

```bash
# Check status
docker exec -it joy-rabbitmq rabbitmq-diagnostics status

# Check logs
docker logs joy-rabbitmq
```

### API Won't Start

```bash
# Check API logs
docker logs joy-api

# Rebuild API image
cd backend
docker build -t joy-api:latest -f Joy.Api/Dockerfile .
```

---

## 🔄 Development Workflow

### 1. Code Changes

After making code changes to Joy.Api:

```bash
cd backend/devops/docker
docker-compose down
docker-compose build joy-api
docker-compose up -d
```

### 2. Clean State

For testing with fresh database:

```bash
./devops/scripts/clean.sh
./devops/scripts/start.sh
```

### 3. Database Inspection

```bash
# Connect to MongoDB
docker exec -it joy-mongodb mongosh -u admin -p admin123

# Use joy database
use joy

# Check collections
show collections

# Query data
db.gifts.find().pretty()
db.messages.find().pretty()
```

---

## 📱 Mobile App Connection

### For Mobile App Testing

**Android Emulator:**
- Endpoint: `http://10.0.2.2:5000/graphql`
- Already configured in mobile app

**iOS Simulator:**
- Endpoint: `http://localhost:5000/graphql`
- Already configured in mobile app

**Physical Device:**
- Use your PC's IP: `http://YOUR_PC_IP:5000/graphql`
- Update `mobile/config/api.ts`

---

## 🎯 Production Considerations

### Security

**For Production:**
1. ✅ Change all default passwords
2. ✅ Use environment variables for secrets
3. ✅ Disable database seeding
4. ✅ Enable HTTPS
5. ✅ Use Docker Secrets or Azure Key Vault
6. ✅ Implement authentication & authorization
7. ✅ Set up firewalls and network policies

### Deployment Options

**Cloud Platforms:**
- Azure Container Apps
- AWS ECS/Fargate
- Google Cloud Run
- Kubernetes (AKS, EKS, GKE)

**Orchestration:**
- Docker Swarm
- Kubernetes
- Azure Container Apps
- AWS ECS

---

## 📊 Resource Usage

| Service | CPU | Memory | Disk |
|---------|-----|--------|------|
| MongoDB | ~10% | ~100MB | ~50MB + data |
| RabbitMQ | ~5% | ~150MB | ~20MB |
| Joy.Api | ~15% | ~200MB | ~100MB |
| **Total** | ~30% | ~450MB | ~170MB + data |

**Recommended Docker Desktop Settings:**
- CPUs: 4
- Memory: 4GB
- Swap: 1GB
- Disk: 20GB

---

## ✅ Success Checklist

After running `./start.sh`, verify:

- [ ] MongoDB is running (port 27017)
- [ ] RabbitMQ is running (port 5672)
- [ ] Joy.Api is running (port 5000)
- [ ] GraphQL playground loads: http://localhost:5000/graphql
- [ ] RabbitMQ UI loads: http://localhost:15672
- [ ] Database has seeded data
- [ ] Mobile app can connect
- [ ] All health checks pass

---

## 🎉 Summary

**Docker setup is complete and ready to use!**

✅ **Services:** MongoDB, RabbitMQ, Joy.Api  
✅ **Scripts:** Start, Stop, Logs, Clean  
✅ **Health Checks:** Automatic readiness detection  
✅ **Auto-Seeding:** Sample data created on startup  
✅ **Documentation:** Complete guide included  
✅ **Mobile Compatible:** Endpoints configured  

**To start everything:**
```bash
cd backend/devops/scripts
./start.sh
```

**Access GraphQL:**
```
http://localhost:5000/graphql
```

---

## 📚 Documentation

- **[devops/README.md](backend/devops/README.md)** - Complete Docker guide
- **[devops/docker/docker-compose.yml](backend/devops/docker/docker-compose.yml)** - Service definitions
- **[Joy.Api/Dockerfile](backend/Joy.Api/Dockerfile)** - API container build

---

**Date:** November 10, 2025  
**Status:** ✅ READY TO USE  
**Services:** 3 (MongoDB, RabbitMQ, Joy.Api)  
**Scripts:** 4 (start, stop, logs, clean)

