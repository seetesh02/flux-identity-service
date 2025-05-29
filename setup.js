const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up FluxKart Identity Service...');

// Create necessary directories
const directories = [
  'data',
  'routes',
  'services', 
  'database',
  'public',
  'logs'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  } else {
    console.log(`✅ Directory exists: ${dir}`);
  }
});

// Create .gitignore
const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Database
data/
*.db
*.sqlite
*.sqlite3

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Build output
dist/
build/

# Operating System Files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Vercel
.vercel
`;

fs.writeFileSync('.gitignore', gitignoreContent);
console.log('📝 Created .gitignore file');

// Create README.md
const readmeContent = `# FluxKart Identity Service

Advanced contact reconciliation API for e-commerce platforms. Intelligently links customer contacts to create unified customer profiles.

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Run setup script
npm run setup

# Start development server
npm run dev

# Start production server
npm start
\`\`\`

## 📖 API Documentation

Visit \`/docs\` for comprehensive API documentation with interactive testing.

## 🧪 Testing

The service includes built-in test endpoints and interactive documentation for easy testing.

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3

## 📊 Features

- ✅ Contact identification and linking
- ✅ Primary/secondary contact hierarchy
- ✅ Intelligent contact merging
- ✅ Comprehensive API documentation
- ✅ Health monitoring
- ✅ Security headers
- ✅ Request logging

## 🌐 Deployment

Ready for deployment on Vercel, Railway, or any Node.js hosting platform.
`;

fs.writeFileSync('README.md', readmeContent);
console.log('📖 Created README.md file');

// Create vercel.json
const vercelConfig = {
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
};

fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
console.log('🔧 Created vercel.json configuration');

console.log('\n✅ Setup completed successfully!');
console.log('🎯 Next steps:');
console.log('   1. npm install');
console.log('   2. npm run dev');
console.log('   3. Visit http://localhost:4000/docs');
console.log('\n🚀 Happy coding!');