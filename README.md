# Product Inventory Application

A modern Angular application for managing product inventory with a clean, responsive UI.

## 🚀 Features

- **Product Management**: Add, view, and delete products
- **Responsive Design**: Built with Bootstrap for mobile-friendly experience
- **Modern Angular**: Built with Angular 18 and latest best practices
- **Code Quality**: ESLint and Prettier for consistent code style

## 🛠️ Development

### Prerequisites

- Node.js v20.19+ (use NVM: `nvm use 20.19.4`)
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

```bash
npm run build
```

### Code Quality

This project uses ESLint and Prettier to maintain high code quality:

```bash
# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check if code is properly formatted
npm run format:check

# Run both linting and format checking
npm run code-quality
```

### Testing

This project includes comprehensive unit tests with excellent coverage:

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

**Test Coverage:**
- **Statements**: 100% (40/40)
- **Branches**: 91.66% (11/12)
- **Functions**: 100% (12/12)
- **Lines**: 100% (35/35)

**Test Structure:**
- **Component Tests**: Test component behavior, user interactions, and template rendering
- **Service Tests**: Test business logic, data manipulation, and error handling
- **Model Tests**: Test data structures and validation
- **Integration Tests**: Test component-service interactions

## 📁 Project Structure

```
src/
├── app/
│   ├── add-product/          # Add product component
│   ├── product-list/         # Product list component
│   ├── app.component.*       # Main app component
│   ├── app.module.ts         # App module
│   └── app-routing.module.ts # Routing configuration
├── assets/                   # Static assets
└── styles.scss              # Global styles
```

## 🎯 Code Quality Standards

- **ESLint**: Enforces Angular best practices and TypeScript rules
- **Prettier**: Ensures consistent code formatting
- **Modern Angular**: Uses inject() function instead of constructor injection
- **Accessibility**: Proper label associations and semantic HTML
- **Testing**: Comprehensive unit tests with 100% statement and line coverage

## 🔧 Configuration Files

- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier formatting rules
- `.prettierignore` - Files to exclude from formatting

## 📦 Dependencies

- **Angular 18** - Latest LTS version
- **Bootstrap 5** - UI framework
- **ng-bootstrap** - Angular Bootstrap components
- **ESLint** - Code linting
- **Prettier** - Code formatting
