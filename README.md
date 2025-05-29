# FluxKart Identity Service

<div align="center">

![FluxKart Logo](https://img.shields.io/badge/FluxKart-Identity%20Service-blue?style=for-the-badge&logo=node.js)

**Advanced Contact Reconciliation API for E-commerce Platforms**

[![Live API](https://img.shields.io/badge/Live%20API-Production-success?style=flat-square)](https://flux-identity-reconciliation-hnk2mssjf.vercel.app)
[![Documentation](https://img.shields.io/badge/Docs-Interactive-blue?style=flat-square)](https://flux-identity-reconciliation-hnk2mssjf.vercel.app/docs)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=flat-square&logo=github)](https://github.com/seetesh02/flux-identity-service)

*Intelligently links customer contacts to create unified customer profiles for seamless e-commerce experiences*

</div>

---

## 🌟 **Overview**

FluxKart Identity Service is a sophisticated contact reconciliation system designed for e-commerce platforms. It intelligently identifies and links customer contacts across different touchpoints, creating unified customer profiles while maintaining data integrity and hierarchy.

### ✨ **Key Features**

- 🔗 **Smart Contact Linking** - Automatically connects contacts based on shared email addresses or phone numbers
- 🏗️ **Hierarchy Management** - Maintains primary-secondary relationship based on contact creation timestamps
- 🔄 **Intelligent Merging** - Seamlessly merges separate primary contacts when cross-references are discovered
- 📊 **Real-time Processing** - Instant contact reconciliation with sub-second response times
- 🛡️ **Data Validation** - Comprehensive input validation using Joi schema validation
- 📈 **Health Monitoring** - Built-in health checks and system status monitoring
- 🎨 **Interactive Documentation** - Beautiful Bootstrap-based API documentation with live testing

---

## 🚀 **Live Deployment**

### 🌐 **Production URLs**

- **🏠 API Base**: `https://flux-identity-reconciliation-hnk2mssjf.vercel.app`
- **🩺 Health Check**: `https://flux-identity-reconciliation-hnk2mssjf.vercel.app/api/v1/health`
- **🔍 Identity Endpoint**: `https://flux-identity-reconciliation-hnk2mssjf.vercel.app/api/v1/identify`
- **📚 Documentation**: `https://flux-identity-reconciliation-hnk2mssjf.vercel.app/docs`

### 🧪 **Quick Test**

```bash
curl -X POST https://flux-identity-reconciliation-hnk2mssjf.vercel.app/api/v1/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@fluxkart.com", "phoneNumber": "555-0001"}'
```

---

## 🏗️ **Architecture & Technology Stack**

### **Backend Framework**

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Architecture**: Functional Programming with Modular Design
- **Database**: SQLite3 (In-memory for production, File-based for development)

### **Key Libraries**

- **Validation**: Joi 17.x - Schema-based validation
- **Security**: Helmet - Security headers
- **Logging**: Morgan - HTTP request logging
- **CORS**: Cross-origin resource sharing
- **UUID**: Unique identifier generation

### **Development Tools**

- **Process Manager**: Nodemon for development
- **Deployment**: Vercel Serverless Functions
- **Version Control**: Git with GitHub

---

## ⚡ **Quick Start**

### **Prerequisites**

- Node.js 16+ and npm
- Git

### **Installation**

```bash
# 1. Clone the repository
git clone https://github.com/seetesh02/flux-identity-service.git
cd flux-identity-reconciliation

# 2. Install dependencies
npm install

# 3. Run setup script (creates directories, configuration files)
npm run setup

# 4. Start development server
npm run dev

# 5. Test the API
curl http://localhost:4000/api/v1/health
```

### **Available Scripts**

```bash
npm start        # Start production server
npm run dev      # Start development server with hot reload
npm run setup    # Initialize project structure and configuration
```

---

## 📡 **API Reference**

### **Base URL**

- **Local**: `http://localhost:4000`
- **Production**: `https://flux-identity-reconciliation-hnk2mssjf.vercel.app`

### **Endpoints**

#### **POST /api/v1/identify**

Core endpoint for contact identification and reconciliation.

**Request Body:**

```json
{
  "email": "customer@fluxkart.com",      // Optional: Valid email address
  "phoneNumber": "1234567890"            // Optional: Phone number string
}
```

*Note: At least one of email or phoneNumber is required*

**Response:**

```json
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["customer@fluxkart.com", "alt@email.com"],
    "phoneNumbers": ["1234567890", "0987654321"],
    "secondaryContactIds": [2, 3]
  }
}
```

#### **GET /api/v1/health**

Health check endpoint for monitoring service status.

**Response:**

```json
{
  "status": "healthy",
  "service": "FluxKart Identity Service",
  "timestamp": "2024-05-28T12:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "version": "1.0.0"
}
```

#### **GET /api/v1/status**

Detailed system status and diagnostics.

#### **GET /docs**

Interactive API documentation with live testing capabilities.

---

## 🧪 **Testing Guide**

### **Local Testing**

```bash
# Start development server
npm run dev

# Basic functionality test
curl http://localhost:4000/api/v1/health

# Test contact creation
curl -X POST http://localhost:4000/api/v1/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "test@fluxkart.com", "phoneNumber": "555-TEST"}'

# Test contact linking
curl -X POST http://localhost:4000/api/v1/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "work@fluxkart.com", "phoneNumber": "555-TEST"}'
```

### **Production Testing**

```bash
# Health check
curl https://flux-identity-reconciliation-hnk2mssjf.vercel.app/api/v1/health

# Full identity workflow test
curl -X POST https://flux-identity-reconciliation-hnk2mssjf.vercel.app/api/v1/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@fluxkart.com", "phoneNumber": "555-PROD"}'
```

### **Interactive Testing**

Visit the **[Live Documentation](https://flux-identity-reconciliation-hnk2mssjf.vercel.app/docs)** for comprehensive interactive testing with a beautiful UI.

---

## 🔄 **Business Logic**

### **Contact Reconciliation Flow**

1. **New Contact**: Creates primary contact if no matches found
2. **Single Match**: Links new information to existing contact as secondary
3. **Multiple Matches**: Intelligently merges primary contacts based on creation timestamp
4. **Data Consolidation**: Returns unified contact profile with all linked information

### **Use Cases**

#### **Scenario 1: New Customer Registration**

```bash
# Request
{"email": "new@customer.com", "phoneNumber": "555-0001"}

# Result: Creates primary contact ID 1
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["new@customer.com"],
    "phoneNumbers": ["555-0001"],
    "secondaryContactIds": []
  }
}
```

#### **Scenario 2: Contact Linking**

```bash
# Existing: customer@email.com, 555-0001 (ID: 1)
# Request
{"email": "work@email.com", "phoneNumber": "555-0001"}

# Result: Links via shared phone number
{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["customer@email.com", "work@email.com"],
    "phoneNumbers": ["555-0001"],
    "secondaryContactIds": [2]
  }
}
```

#### **Scenario 3: Contact Merging**

```bash
# Existing: Two separate primary contacts
# john@email.com, 555-1001 (ID: 3)
# jane@email.com, 555-2002 (ID: 4)

# Request bridges them
{"email": "john@email.com", "phoneNumber": "555-2002"}

# Result: Merges into single primary contact
{
  "contact": {
    "primaryContatctId": 3,
    "emails": ["john@email.com", "jane@email.com"],
    "phoneNumbers": ["555-1001", "555-2002"],
    "secondaryContactIds": [4]
  }
}
```

---

## 🛡️ **Security & Validation**

- **Input Validation**: Joi schema validation for all inputs
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configurable cross-origin policies
- **Error Handling**: Comprehensive error responses without sensitive data exposure
- **SQL Injection Prevention**: Parameterized queries throughout

---

## 🚀 **Deployment**

### **Vercel Deployment** (Current)

```bash
# Deploy to production
vercel --prod

# Environment variables are configured in vercel.json
```

### **Alternative Deployment Options**

- **Railway**: Connect GitHub repository for auto-deployment
- **Heroku**: Use Procfile with npm start
- **DigitalOcean App Platform**: Direct GitHub integration
- **AWS Lambda**: Convert to serverless functions

---

## 📊 **Performance & Monitoring**

- **Response Time**: Sub-100ms for most operations
- **Database**: In-memory SQLite for production (fast, ephemeral)
- **Health Monitoring**: Built-in health checks and system diagnostics
- **Logging**: Comprehensive request/response logging
- **Error Tracking**: Structured error reporting

---

## 🔧 **Configuration**

### **Environment Variables**

```bash
NODE_ENV=production          # Environment mode
PORT=4000                    # Server port (development)
```

### **Database Configuration**

- **Development**: File-based SQLite (`data/contacts.db`)
- **Production**: In-memory SQLite (`:memory:`)

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 👨‍💻 **Author**

**Seetesh**

- GitHub: [@seetesh02](https://github.com/seetesh02)

---

## 🎯 **Assignment Details**

This project was built as part of a technical assessment, demonstrating:

- **Advanced backend development** with Node.js and Express
- **Database design** and contact reconciliation algorithms
- **API design** following RESTful principles
- **Production deployment** on modern serverless platforms
- **Comprehensive documentation** and testing strategies

---
