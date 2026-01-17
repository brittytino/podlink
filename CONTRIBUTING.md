# Contributing to PodLink 🤝

First off, thank you for considering contributing to PodLink! It's people like you that make PodLink such a great tool for supporting mental health and personal growth.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [brittytino22@gmail.com](mailto:brittytino22@gmail.com).

## 🎯 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check the [existing issues](https://github.com/brittytino/podlink/issues) to avoid duplicates.

When creating a bug report, include:

- **Clear title**: Use a descriptive title
- **Steps to reproduce**: Detailed steps to reproduce the behavior
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Screenshots**: If applicable
- **Environment**: OS, browser, Node.js version
- **Additional context**: Any other relevant information

**Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g., Windows 11]
 - Browser: [e.g., Chrome 120]
 - Node.js: [e.g., 20.10.0]
 - Version: [e.g., 0.1.0]
```

### Suggesting Enhancements 💡

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear title**: Describe the enhancement
- **Detailed description**: Explain why this enhancement would be useful
- **Examples**: Provide examples of how it would work
- **Mockups**: If applicable, add mockups or diagrams

**Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Mockups, examples, or any other context.
```

### Your First Code Contribution 🎉

Unsure where to begin? Look for issues labeled:

- `good first issue` - Simple issues for beginners
- `help wanted` - Issues where we need community help
- `documentation` - Documentation improvements

### Pull Requests 🔄

We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`
2. Follow the [development setup](#development-setup)
3. Make your changes
4. Write/update tests if applicable
5. Ensure the test suite passes
6. Update documentation
7. Submit your pull request!

## 🛠️ Development Setup

### Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher
- Git
- PostgreSQL (or Neon account)

### Quick Start

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/podlink.git
   cd podlink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your credentials (see [README.md](README.md#environment-setup))

4. **Set up database**
   ```bash
   # Push schema to database
   npx prisma db push
   
   # (Optional) Seed with demo data
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```
   
   This starts:
   - Next.js dev server on http://localhost:3000
   - Socket.IO server on http://localhost:3001

6. **Open Prisma Studio (optional)**
   ```bash
   npm run db:studio
   ```

### Project Structure

```
podlink/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── (auth)/       # Authentication pages
│   │   ├── (protected)/  # Protected routes
│   │   ├── (public)/     # Public pages
│   │   └── api/          # API routes
│   ├── components/       # React components
│   │   ├── auth/         # Auth components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── pod/          # Pod & chat components
│   │   └── ui/           # shadcn/ui components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   │   ├── auth.ts       # Auth utilities
│   │   ├── prisma.ts     # Database client
│   │   ├── socket.ts     # Socket.IO setup
│   │   └── gemini.ts     # AI integration
│   └── types/            # TypeScript types
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── public/               # Static assets
└── scripts/              # Utility scripts
```

## 🔄 Development Workflow

### Branching Strategy

We use a simplified Git Flow:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features (e.g., `feature/crisis-toolkit-ui`)
- `bugfix/*` - Bug fixes (e.g., `bugfix/chat-typing-indicator`)
- `hotfix/*` - Urgent production fixes

### Creating a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push to your fork
git push origin feature/your-feature-name
```

### Keeping Your Branch Updated

```bash
# Fetch latest changes
git fetch origin main

# Rebase your branch
git rebase origin/main

# Force push (if needed)
git push --force-with-lease origin feature/your-feature-name
```

## 📏 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types (avoid `any`)
- Use interfaces for object shapes
- Export types when needed by other files

```typescript
// Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

const updateProfile = (profile: UserProfile): Promise<void> => {
  // Implementation
};

// Avoid
const updateProfile = (profile: any) => {
  // Implementation
};
```

### React Components

- Use functional components with hooks
- Prefer named exports
- Keep components focused and small
- Use proper TypeScript props typing

```typescript
// Good
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {children}
    </button>
  );
}
```

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use shadcn/ui components when possible
- Keep custom CSS minimal

```tsx
// Good - Mobile first with Tailwind
<div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600">
    Click me
  </button>
</div>
```

### File Naming

- Components: PascalCase (e.g., `UserProfile.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Hooks: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- API routes: kebab-case (e.g., `check-in/route.ts`)

### Code Organization

- One component per file
- Group related files in directories
- Keep utility functions in `src/lib/`
- Place types in `src/types/`
- API routes in `src/app/api/`

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, missing semi colons, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes

### Examples

```bash
# Feature
git commit -m "feat(chat): add message reactions with emoji picker"

# Bug fix
git commit -m "fix(auth): resolve Google OAuth redirect issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactor
git commit -m "refactor(pod): extract matching logic to separate service"

# Multiple changes
git commit -m "feat(dashboard): add streak visualization

- Add recharts for streak calendar
- Implement weekly progress view
- Add streak restoration UI

Closes #123"
```

### Best Practices

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- First line should be 50 characters or less
- Reference issues and pull requests in footer
- Explain what and why, not how

## 🔀 Pull Request Process

### Before Submitting

1. **Test your changes**
   ```bash
   npm run dev
   # Test manually in browser
   ```

2. **Check for TypeScript errors**
   ```bash
   npm run build
   ```

3. **Run linter**
   ```bash
   npm run lint
   ```

4. **Update documentation** if needed

### PR Title Format

Use conventional commit format:
```
feat(chat): add message reactions
fix(auth): resolve OAuth redirect issue
docs(contributing): update PR guidelines
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issues
Closes #123
Related to #456

## Changes Made
- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)
Add screenshots showing the changes.

## Testing
Describe how you tested these changes:
- [ ] Tested locally
- [ ] Tested with demo data
- [ ] Tested edge cases

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing tests pass locally with my changes
```

### Review Process

1. **Automated checks** must pass:
   - TypeScript compilation
   - Linting
   - Build process

2. **Code review** by maintainers:
   - Code quality
   - Functionality
   - Documentation
   - Tests

3. **Changes requested**: Address feedback and push updates

4. **Approval**: Once approved, a maintainer will merge your PR

### After Merge

- Your contribution will be included in the next release
- You'll be added to the contributors list
- Delete your feature branch

## 📋 Issue Guidelines

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `question` - Further information requested
- `wontfix` - This will not be worked on
- `duplicate` - This issue already exists
- `priority: high` - High priority
- `priority: medium` - Medium priority
- `priority: low` - Low priority

### Triaging Issues

Maintainers will:
1. Review new issues within 48 hours
2. Add appropriate labels
3. Ask for clarification if needed
4. Assign to milestones
5. Close duplicates or invalid issues

## 🌟 Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

## 💬 Community

- **GitHub Discussions**: For questions and discussions
- **GitHub Issues**: For bugs and feature requests
- **Email**: [brittytino22@gmail.com](mailto:brittytino22@gmail.com) for private matters

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## ❓ Questions?

Don't hesitate to ask questions by:
- Opening an issue with the `question` label
- Starting a discussion on GitHub Discussions
- Reaching out via email

Thank you for contributing to PodLink! Together, we're building a platform that helps people achieve their goals and support each other's mental health journey. 💙
