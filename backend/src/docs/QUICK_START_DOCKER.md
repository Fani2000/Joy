# 🐳 Quick Start - Docker

## ⚡ TL;DR

```bash
cd backend/devops/scripts
./start.sh
```

Then open: http://localhost:5000/graphql

---

## 📦 What You Get

Running `./start.sh` starts:

1. ✅ **MongoDB** (port 27017) - Database with auto-seeding
2. ✅ **RabbitMQ** (port 5672) - Message broker + Management UI
3. ✅ **Joy.Api** (port 5000) - GraphQL API

---

## 🎯 Quick Commands

| Action | Command |
|--------|---------|
| **Start all** | `./devops/scripts/start.sh` |
| **Stop all** | `./devops/scripts/stop.sh` |
| **View logs** | `./devops/scripts/logs.sh` |
| **Clean data** | `./devops/scripts/clean.sh` |

---

## 🌐 Access URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| GraphQL API | http://localhost:5000/graphql | - |
| RabbitMQ UI | http://localhost:15672 | guest / guest |
| MongoDB | mongodb://localhost:27017 | admin / admin123 |

---

## 🧪 Test Query

Open http://localhost:5000/graphql and run:

```graphql
query {
  gifts(userEmail: "john.doe@example.com") {
    id
    title
    recipientName
  }
}
```

---

## 📱 Mobile App

The mobile app will automatically connect to:
- **Android Emulator:** `http://10.0.2.2:5000/graphql`
- **iOS Simulator:** `http://localhost:5000/graphql`

Just restart your mobile app after starting Docker services!

---

## 🛑 Stop Everything

```bash
cd backend/devops/scripts
./stop.sh
```

---

## 📚 Full Documentation

See: `backend/devops/README.md`

---

**That's it! Your entire backend is now running in Docker!** 🎉

