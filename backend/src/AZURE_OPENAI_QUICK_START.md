# Azure OpenAI Quick Start ⚡

## 🎯 5-Minute Setup

### Step 1: Get Azure OpenAI Access

**Option A: Create Azure OpenAI Resource**

1. Go to [Azure Portal](https://portal.azure.com)
2. Search for "Azure OpenAI" in the marketplace
3. Click "Create"
4. Fill in:
   - **Subscription**: Your subscription
   - **Resource Group**: Create new or use existing
   - **Region**: Choose closest (e.g., East US, West Europe)
   - **Name**: `joy-openai-dev`
   - **Pricing Tier**: Standard S0
5. Click "Review + Create" → "Create"
6. Wait 2-3 minutes for deployment

**Option B: Use OpenAI Directly (Easier)**

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up or log in
3. Go to "API Keys"
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)

---

### Step 2: Deploy a Model (Azure Only)

1. Go to your Azure OpenAI resource
2. Click "Model deployments" in the left menu
3. Click "Create new deployment"
4. Choose:
   - **Model**: `gpt-35-turbo` (recommended) or `gpt-4`
   - **Deployment name**: `gpt-35-turbo`
   - **Deployment type**: Standard
5. Click "Create"
6. Wait 1 minute

---

### Step 3: Get Your Credentials

**For Azure OpenAI:**

1. In your Azure OpenAI resource, click "Keys and Endpoint"
2. Copy:
   - **KEY 1** → This is your API Key
   - **Endpoint** → e.g., `https://joy-openai-dev.openai.azure.com/`

**For OpenAI:**

1. You already have your API key from Step 1
2. No endpoint needed!

---

### Step 4: Configure Joy Backend

Edit: `backend/Joy.Api/appsettings.Development.json`

**For Azure OpenAI:**

```json
{
  "AzureOpenAI": {
    "Endpoint": "https://joy-openai-dev.openai.azure.com/",
    "ApiKey": "1234567890abcdef1234567890abcdef",
    "DeploymentName": "gpt-35-turbo"
  }
}
```

**For OpenAI:**

```json
{
  "OpenAI": {
    "ApiKey": "sk-proj-abc123xyz789...",
    "Model": "gpt-3.5-turbo"
  }
}
```

---

### Step 5: Test It!

```bash
cd backend/Joy.AppHost
dotnet run
```

**Look for this message:**
```
✅ Azure OpenAI configured with deployment: gpt-35-turbo
```

**Or for OpenAI:**
```
✅ OpenAI configured with model: gpt-3.5-turbo
```

---

### Step 6: Generate Your First AI Message

Open http://localhost:5000/graphql and run:

```graphql
mutation {
  requestAIMessage(input: {
    recipientName: "Alice"
    occasion: "birthday"
    tone: "warm and friendly"
  }) {
    message
    suggestions
  }
}
```

**You should get an AI-generated message!** 🎉

---

## ⚡ Done!

Your Joy backend is now powered by AI! 

### What's Next?

- ✅ Send personalized birthday messages
- ✅ Generate congratulations messages
- ✅ Create thank you notes
- ✅ Get AI-powered message variations

### No API Key? No Problem!

If you don't configure any API keys, the system automatically uses **template-based messages** - still great quality, just not AI-generated.

---

## 💰 Costs

**Azure OpenAI / OpenAI (GPT-3.5-Turbo):**
- ~$0.0003 per message
- ~$0.30 per 1000 messages
- First $200 free credits for new Azure accounts!

**Template Mode:**
- FREE! No API costs

---

## 🆘 Need Help?

See the full guide: [AZURE_OPENAI_SETUP.md](./AZURE_OPENAI_SETUP.md)

**Common Issues:**

1. **"Failed to initialize AI client"**
   - Check your API key is correct
   - Check endpoint ends with `/`
   - Check deployment name matches

2. **"Deployment not found"**
   - Verify deployment name in Azure matches `appsettings.json`

3. **"Rate limit exceeded"**
   - Wait a few minutes
   - Increase quota in Azure Portal

---

**Happy messaging!** 💌✨

