# CI/CD Workflows

This repository uses GitHub Actions for continuous integration and deployment.

## Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)
Main workflow that runs on every push and pull request.

**Jobs:**
- **Quality Check**: Linting, formatting, unit tests, coverage
- **Build & Security**: Security audit, application build
- **Performance Analysis**: Bundle size analysis (main branch only)
- **Deploy Staging**: Automatic deployment to staging (main branch only)
- **Deploy Production**: Manual deployment to production

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### 2. Pull Request Check (`pr-check.yml`)
Validates pull requests before merging.

**Features:**
- Code quality checks
- Automated PR comments with status
- Build verification

### 3. Dependency Check (`dependency-check.yml`)
Weekly security and dependency monitoring.

**Features:**
- Automated security audits
- Outdated package detection
- Automatic issue creation for vulnerabilities
- Runs every Monday at 9 AM UTC

### 4. GitHub Pages Deployment (`deploy.yml`)
Simplified deployment to GitHub Pages.

**Features:**
- Automatic deployment on push to main
- Manual deployment trigger
- Uses Angular 18 application builder

## Environments

### Staging
- **URL**: `https://[username].github.io/[repo]/staging/`
- **Deployment**: Automatic on push to main
- **Purpose**: Testing and preview

### Production
- **URL**: `https://[username].github.io/[repo]/`
- **Deployment**: Manual trigger
- **Purpose**: Live application

## Security Features

- Automated security audits
- Dependency vulnerability scanning
- Issue creation for security problems
- Weekly scheduled checks

## Performance Monitoring

- Bundle size analysis
- Build optimization
- Performance metrics tracking

## Manual Triggers

### Deploy to Production
1. Go to Actions tab
2. Select "Deploy to Production" workflow
3. Click "Run workflow"
4. Select branch and confirm

### Dependency Check
1. Go to Actions tab
2. Select "Dependency Check" workflow
3. Click "Run workflow"

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review linting errors

2. **Deployment Fails**
   - Ensure GitHub Pages is enabled
   - Check repository permissions
   - Verify build artifacts

3. **Security Audit Fails**
   - Review vulnerability details
   - Update affected packages
   - Test thoroughly after updates

### Support

For workflow issues, check:
- GitHub Actions logs
- Repository settings
- Branch protection rules
