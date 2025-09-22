# PrivAudit Setup Guide

## 🔑 **Required API Keys**

### 1. Etherscan API Key (Free)
- **Get it here**: https://etherscan.io/myapikey
- **Steps**:
  1. Sign up at https://etherscan.io/
  2. Verify your email
  3. Go to https://etherscan.io/myapikey
  4. Click "Add" to create new API key
  5. Copy your API key

### 2. Claude AI API Key
- **Get it here**: https://console.anthropic.com/
- **Steps**:
  1. Sign up at https://console.anthropic.com/
  2. Go to API Keys section
  3. Create new API key
  4. Copy your API key (starts with `sk-ant-`)

## 🚀 **Quick Setup**

1. **Create environment file**:
   ```bash
   cp apps/web/env.example apps/web/.env.local
   ```

2. **Edit `.env.local`** with your API keys:
   ```bash
   # Etherscan API Key (for fetching real blockchain data)
   NEXT_PUBLIC_ETHERSCAN_API_KEY=YourEtherscanAPIKey

   # Claude AI API Key (for real AI report generation)
   NEXT_PUBLIC_CLAUDE_API_KEY=sk-ant-your-claude-api-key
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the app**:
   ```bash
   npm run dev
   ```

5. **Open in browser**: http://localhost:3000

## 🎯 **How to Use**

1. **Connect Wallet**: Click "Connect Wallet" in the header
2. **Select DAO**: Choose from popular DAOs or enter custom address
3. **Generate Report**: Click "Generate Report" to analyze treasury
4. **View Results**: See real-time blockchain data, zkSNARK proofs, and AI analysis

## 📊 **What You'll Get**

- **Real blockchain data** from Etherscan API
- **zkSNARK proofs** proving solvency without exposing data
- **Claude AI analysis** with intelligent recommendations
- **Beautiful dashboard** with charts and metrics
- **Privacy-preserving** - no sensitive data exposed

## 🔧 **Troubleshooting**

### Etherscan API Issues
- Make sure your API key is valid
- Check you're not exceeding rate limits (5 calls/second)
- Verify the DAO address is correct

### Claude AI Issues
- Ensure your API key starts with `sk-ant-`
- Check you have sufficient credits
- Verify the model name is correct

### Wallet Connection Issues
- Make sure MetaMask is installed
- Check you're on the correct network (Ethereum Mainnet)
- Try refreshing the page

## 🎉 **Demo DAOs to Try**

- **Uniswap DAO**: `0x1f9840a85d5af5bf1d1762f925bdaddc4201f984`
- **MakerDAO**: `0x6b175474e89094c44da98b954eedeac495271d0f`
- **Aave DAO**: `0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9`
- **Chainlink DAO**: `0x514910771af9ca656af840dff83e8264ecf986ca`

Happy analyzing! 🚀
