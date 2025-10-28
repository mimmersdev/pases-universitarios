# Pases Universitarios

A Node.js TypeScript application for managing university passes.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation
```bash
npm install
```

### Development
```bash
# Run in development mode
npm run dev

# Run with auto-reload on file changes
npm run dev:watch
```

### Production
```bash
# Build the project
npm run build

# Start the production server
npm start
```

### Other Commands
```bash
# Clean build directory
npm run clean
```

## Project Structure
```
├── src/           # TypeScript source files
├── dist/          # Compiled JavaScript files
├── package.json   # Project dependencies and scripts
└── tsconfig.json  # TypeScript configuration
```

## Scripts
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Run the compiled application
- `npm run dev` - Run in development mode with ts-node
- `npm run dev:watch` - Run in development mode with auto-reload
- `npm run clean` - Remove the dist directory

