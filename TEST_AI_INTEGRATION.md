# 🧪 Test Azure OpenAI Integration

## Quick Test Guide

### ✅ Step 1: Verify Build

```bash
cd backend
dotnet build Joy.sln
```

**Expected:** `Build succeeded` ✅

---

### ✅ Step 2: Start Backend

```bash
cd Joy.AppHost
dotnet run
```

**Look for one of these messages:**

**With Azure OpenAI configured:**
```
✅ Azure OpenAI configured with deployment: gpt-35-turbo
```

**With OpenAI configured:**
```
✅ OpenAI configured with model: gpt-3.5-turbo
```

**Without configuration (Template mode):**
```
⚠️  AI API key not configured. Using template-based messages.
```

---

### ✅ Step 3: Test GraphQL Endpoint

**Open:** http://localhost:5000/graphql

**Run this mutation:**

```graphql
mutation TestAIMessage {
  requestAIMessage(input: {
    recipientName: "Alice"
    occasion: "birthday"
    tone: "warm and cheerful"
    additionalDetails: "She loves reading and traveling"
  }) {
    message
    suggestions
  }
}
```

**Expected Response:**

```json
{
  "data": {
    "requestAIMessage": {
      "message": "Happy Birthday, Alice! 🎉 ...",
      "suggestions": [
        "Short version 1...",
        "Short version 2..."
      ]
    }
  }
}
```

---

### ✅ Step 4: Test All Occasions

```graphql
# Birthday
mutation {
  requestAIMessage(input: {
    recipientName: "John"
    occasion: "birthday"
    tone: "fun and energetic"
  }) {
    message
  }
}

# Congratulations
mutation {
  requestAIMessage(input: {
    recipientName: "Sarah"
    occasion: "congratulations"
    tone: "professional"
    additionalDetails: "Got promoted to Senior Manager"
  }) {
    message
  }
}

# Thank You
mutation {
  requestAIMessage(input: {
    recipientName: "Mike"
    occasion: "thankyou"
    tone: "sincere and heartfelt"
  }) {
    message
  }
}

# Anniversary
mutation {
  requestAIMessage(input: {
    recipientName: "Emma & James"
    occasion: "anniversary"
    tone: "romantic"
    additionalDetails: "Celebrating 10 years together"
  }) {
    message
  }
}

# Get Well
mutation {
  requestAIMessage(input: {
    recipientName: "David"
    occasion: "getwell"
    tone: "caring and supportive"
  }) {
    message
  }
}
```

---

### ✅ Step 5: Test via Mobile App

1. **Start mobile app:**
   ```bash
   cd ../mobile
   npm start
   ```

2. **Login** with any email (e.g., `test@example.com`)

3. **Navigate to "Send Message"**

4. **Fill in the form:**
   - Recipient Name: Alice
   - Occasion: Birthday
   - Message: (leave empty)

5. **Tap "✨ Generate with AI"**

6. **Verify:** Message appears in the input field

---

## 🎯 Test Results Checklist

Mark these as you test:

- [ ] Backend builds successfully
- [ ] Backend starts without errors
- [ ] AI initialization message appears
- [ ] GraphQL playground loads
- [ ] Birthday message generates
- [ ] Congratulations message generates
- [ ] Thank you message generates
- [ ] Anniversary message generates
- [ ] Get well message generates
- [ ] Message variations are returned (if AI configured)
- [ ] Mobile app connects to backend
- [ ] Mobile app can generate messages
- [ ] Fallback templates work (if AI not configured)

---

## 🐛 Common Issues & Solutions

### Issue: "Connection refused"
**Solution:** Make sure backend is running on port 5000
```bash
cd backend/Joy.AppHost
dotnet run
```

### Issue: "AI not generating unique messages"
**Solution:** Add more details in `additionalDetails` field

### Issue: "GraphQL playground not loading"
**Solution:** Check http://localhost:5000/graphql (not https)

### Issue: "Mobile app shows 'Network Error'"
**Solution:** 
- Check backend is running
- Check mobile endpoint: `http://localhost:5000/graphql`
- For Android emulator, use `http://10.0.2.2:5000/graphql`

---

## 📊 Performance Benchmarks

### AI Mode (Azure OpenAI)
- **Response Time:** 2-4 seconds
- **Token Usage:** ~250 tokens per request
- **Cost:** ~$0.0003 per message

### Template Mode (Fallback)
- **Response Time:** <100ms
- **Token Usage:** 0
- **Cost:** $0

---

## ✅ Success Criteria

Your integration is working if:

1. ✅ Backend starts without errors
2. ✅ AI initialization message appears
3. ✅ GraphQL mutations return messages
4. ✅ Messages are contextual (mention recipient name, occasion)
5. ✅ Message variations are included (if AI configured)
6. ✅ Mobile app can generate messages
7. ✅ Fallback works when AI not configured

---

## 🎉 All Tests Passed?

**Congratulations!** 🚀

Your Joy backend now has:
- ✅ Full Azure OpenAI / OpenAI integration
- ✅ Intelligent fallback system
- ✅ Mobile app integration
- ✅ Production-ready error handling

**Next Steps:**
1. Configure your Azure OpenAI / OpenAI API key
2. Deploy to production
3. Monitor usage in Azure Portal
4. Enjoy AI-powered messaging! 💌

---

**Happy Testing!** 🧪✨

