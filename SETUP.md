# Setup Instructions

## CI/CD Pipeline Setup

### 1. Enable GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "GitHub Actions"
4. Save the settings

### 2. Configure Environments

#### Staging Environment
1. Go to repository settings
2. Navigate to "Environments"
3. Create new environment called "staging"
4. Add protection rules if needed

#### Production Environment
1. Go to repository settings
2. Navigate to "Environments"
3. Create new environment called "production"
4. Add protection rules (recommended)
5. Add required reviewers if needed

### 3. Enable Branch Protection

1. Go to repository settings
2. Navigate to "Branches"
3. Add rule for `main` branch:
   - Require status checks to pass
   - Require branches to be up to date
   - Require pull request reviews
   - Include administrators

### 4. Configure Secrets (if needed)

For advanced deployments, you might need to add secrets:
1. Go to repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Add any required secrets

### 5. Test the Pipeline

1. Make a small change to your code
2. Commit and push to main branch
3. Check the Actions tab to see the pipeline running
4. Verify deployment to GitHub Pages

## Workflow Features

### Automated Tasks
- ✅ Code quality checks (ESLint, Prettier)
- ✅ Unit tests with coverage
- ✅ Security audits
- ✅ Build verification
- ✅ Automatic staging deployment
- ✅ Manual production deployment

### Manual Triggers
- Production deployment
- Dependency checks
- Security audits

### Scheduled Tasks
- Weekly dependency security checks (Mondays 9 AM UTC)

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
- Environment configurations
