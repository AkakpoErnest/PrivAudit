# Contributing to PrivAudit

Thank you for your interest in contributing to PrivAudit! This document provides guidelines for contributing to our privacy-preserving DAO treasury reporting platform.

## 🏗️ Project Structure

### Monorepo Architecture
PrivAudit uses a monorepo structure with separate packages for different functionalities:

```
PrivAudit/
├── packages/
│   ├── proofs/          # Zero-Knowledge Proof Generation
│   │   ├── circuits/    # Circom circuits
│   │   ├── src/         # TypeScript proof logic
│   │   └── artifacts/   # Compiled circuit artifacts
│   ├── core/            # Blockchain Integration
│   │   ├── src/services/# API services (Etherscan, etc.)
│   │   ├── src/adapters/# Midnight.js adapters
│   │   └── src/types/   # Shared type definitions
│   └── ai/              # AI Report Generation
│       ├── src/generators/ # AI report generators
│       ├── src/utils/   # Metrics calculators
│       └── src/types/   # AI-specific types
├── apps/
│   └── web/             # Next.js Frontend
│       ├── src/pages/   # App pages and API routes
│       ├── src/components/ # React components
│       └── public/      # Static assets
└── demo-data/           # Sample data for development
```

## 🔧 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Local Development

1. **Clone and install**
```bash
git clone https://github.com/your-username/PrivAudit.git
cd PrivAudit
npm install
```

2. **Build packages**
```bash
npm run build
```

3. **Start development**
```bash
cd apps/web
npm run dev
```

4. **Environment setup**
Copy `apps/web/env.example` to `apps/web/.env.local` and configure:
```env
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_etherscan_api_key
NEXT_PUBLIC_AI_API_KEY=your_ai_api_key
```

## 🎯 How to Contribute

### Areas for Contribution

#### 1. Zero-Knowledge Circuits
- **Location**: `packages/proofs/circuits/`
- **Tech**: Circom, zkSNARKs
- **Examples**:
  - Add new financial metrics circuits
  - Optimize existing solvency proofs
  - Create multi-DAO comparison circuits

#### 2. Blockchain Integration
- **Location**: `packages/core/src/services/`
- **Tech**: TypeScript, Ethers.js, APIs
- **Examples**:
  - Add support for new blockchains
  - Integrate additional DeFi protocols
  - Improve data fetching efficiency

#### 3. AI Analytics
- **Location**: `packages/ai/src/generators/`
- **Tech**: TypeScript, AI APIs
- **Examples**:
  - Enhance report generation algorithms
  - Add new risk assessment metrics
  - Improve recommendation quality

#### 4. Frontend Development
- **Location**: `apps/web/src/`
- **Tech**: Next.js, React, TypeScript, Tailwind CSS
- **Examples**:
  - Add new dashboard components
  - Improve user experience
  - Implement responsive design

### Development Guidelines

#### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow provided configuration
- **Prettier**: Auto-formatting on save
- **Naming**: Use descriptive, camelCase names

#### Component Structure
```typescript
// React components
interface ComponentProps {
  // Type all props
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    <div className="tailwind-classes">
      {/* JSX */}
    </div>
  );
};
```

#### Service Classes
```typescript
// Service classes
export class ServiceName {
  private privateProperty: string;

  constructor(config: ServiceConfig) {
    this.privateProperty = config.value;
  }

  public async publicMethod(param: ParamType): Promise<ReturnType> {
    // Implementation
  }

  private privateHelper(): void {
    // Helper logic
  }
}
```

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run specific package tests
cd packages/proofs && npm test
cd packages/core && npm test
cd packages/ai && npm test
```

### Test Categories

#### Unit Tests
- Individual function testing
- Mock external dependencies
- Fast execution

#### Integration Tests
- API integration testing
- Database connectivity
- Cross-package functionality

#### E2E Tests
- Full user flow testing
- Browser automation
- Real API integration

### Writing Tests
```typescript
// Jest test example
import { describe, it, expect, beforeEach } from '@jest/globals';
import { ServiceClass } from '../src/service';

describe('ServiceClass', () => {
  let service: ServiceClass;

  beforeEach(() => {
    service = new ServiceClass({ config: 'test' });
  });

  it('should perform expected operation', async () => {
    const result = await service.operation('input');
    expect(result).toBe('expected');
  });
});
```

## 🔐 Security Guidelines

### Zero-Knowledge Proofs
- Never expose private inputs in logs
- Validate all circuit inputs
- Use secure randomness for nonces
- Test circuits thoroughly

### API Security
- Validate all external API responses
- Rate limit API calls
- Secure API key storage
- Handle errors gracefully

### Frontend Security
- Sanitize user inputs
- Validate wallet connections
- Secure environment variables
- Implement CSP headers

## 📝 Documentation

### Code Documentation
```typescript
/**
 * Generates a zero-knowledge proof for DAO solvency
 * @param treasuryData - The DAO's financial data
 * @param nonce - Random value for privacy
 * @returns Promise resolving to proof artifact
 */
export async function generateSolvencyProof(
  treasuryData: TreasuryData,
  nonce: bigint
): Promise<ProofArtifact> {
  // Implementation
}
```

### README Updates
- Keep README.md current with changes
- Update setup instructions
- Document new features
- Include troubleshooting tips

## 🚀 Deployment

### Production Build
```bash
# Build all packages
npm run build

# Build web app
cd apps/web && npm run build
```

### Environment Variables
Production requires:
- `NEXT_PUBLIC_ETHERSCAN_API_KEY`
- `NEXT_PUBLIC_AI_API_KEY`
- Additional service keys as needed

## 🐛 Issue Reporting

### Bug Reports
Include:
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

### Feature Requests
Include:
- Use case description
- Proposed implementation
- Potential challenges
- Community benefit

## 🎉 Hackathon Context

This project is built for the **Midnight Blockchain Hackathon 2024**. Contributions should align with:

### Hackathon Goals
- Privacy-preserving technologies
- Real-world blockchain integration
- User-friendly interfaces
- Innovation in DeFi/DAO space

### Evaluation Criteria
- **Technical Innovation**: Novel use of ZK proofs and privacy tech
- **Real-world Utility**: Practical value for DAO treasury management
- **Code Quality**: Clean, maintainable, well-documented code
- **User Experience**: Intuitive, professional interface

## 📞 Getting Help

### Development Questions
- Check existing issues and discussions
- Ask in project Discord (when available)
- Create detailed GitHub issues

### Code Review
- All contributions require code review
- Address feedback promptly
- Follow up on requested changes

## 🙏 Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Hackathon submission materials
- Future presentations

Thank you for helping make PrivAudit a success! 🚀
