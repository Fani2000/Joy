# 🐳 Docker Configuration

This directory contains Docker Compose configuration for running Joy backend locally.

---

## 🚀 Quick Start

### 1. Create Environment File

```bash
# Copy template to .env
cp env.template .env

# Or use the start script (it does this automatically)
cd ../scripts
./start.sh
```

### 2. Start Services

```bash
cd ../scripts
./start.sh
```

---

## 📦 Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Service orchestration |
| `env.template` | Environment variables template |
| `.env` | Your environment variables (create from template) |
| `mongo-init.js` | MongoDB initialization script |

---

## 🔧 Configuration

### Environment Variables

The `.env` file contains configuration for:

**MongoDB:**
- `MONGO_INITDB_ROOT_USERNAME=admin`
- `MONGO_INITDB_ROOT_PASSWORD=admin123`
- `MONGO_INITDB_DATABASE=joy`

**RabbitMQ:**
- `RABBITMQ_DEFAULT_USER=guest`
- `RABBITMQ_DEFAULT_PASS=guest`

**API:**
- `ASPNETCORE_ENVIRONMENT=Development`
- `DatabaseSeeding__Enabled=true`
- Connection strings for MongoDB and RabbitMQ

**Optional Services:**
- Azure OpenAI credentials
- Email (SMTP) settings
- Twilio (SMS/WhatsApp) settings

---

## 📊 Services

### MongoDB (Port 27017)
- Database: `joy`
- Username: `admin`
- Password: `admin123`
- Collections: gifts, messages, friendships

### RabbitMQ (Port 5672, 15672)
- AMQP: 5672
- Management UI: 15672
- Username: `guest`
- Password: `guest`

### Joy.Api (Port 5000)
- GraphQL endpoint: `/graphql`
- Health check: `/health`

---

## 🔧 Manual Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

### Rebuild API
```bash
docker-compose build joy-api
docker-compose up -d joy-api
```

### Clean Everything
```bash
docker-compose down -v
```

---

## 🐛 Troubleshooting

### .env File Not Found

```bash
cp env.template .env
```

### Build Fails

Check build context:
```bash
# Should be: ../../src
# Dockerfile should be: Joy.Api/Dockerfile
```

### MongoDB Connection Issues

```bash
# Check logs
docker-compose logs mongodb

# Test connection
docker exec -it joy-mongodb mongosh -u admin -p admin123
```

### API Won't Start

```bash
# Check logs
docker-compose logs joy-api

# Rebuild
docker-compose build joy-api
docker-compose up -d
```

---

## 📝 Notes

- `.env` is gitignored (contains secrets)
- `env.template` is committed (no secrets)
- Always copy `env.template` to `.env` before first use
- Update `.env` with your own credentials for production

---

**For complete guide, see:** `../README.md`

