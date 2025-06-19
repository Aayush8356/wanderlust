# Contributing to WanderLog

We love your input! We want to make contributing to WanderLog as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issues](https://github.com/yourusername/wanderlog/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/wanderlog/issues/new); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People *love* thorough bug reports.

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wanderlog.git
   cd wanderlog
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` in both `client` and `server` directories
   - Fill in the required values

4. **Start development servers**
   ```bash
   npm run dev
   ```

## Code Style

### General Guidelines
- Use TypeScript for all new code
- Follow the existing code style and conventions
- Use meaningful variable and function names
- Write comments for complex logic
- Keep functions small and focused

### Frontend (React/TypeScript)
- Use functional components with hooks
- Follow React best practices
- Use proper TypeScript types
- Implement responsive design
- Follow the existing component structure

### Backend (Node.js/TypeScript)
- Use async/await for asynchronous operations
- Implement proper error handling
- Follow RESTful API conventions
- Use middleware for common functionality
- Validate input data

### CSS/Styling
- Use TailwindCSS utility classes
- Follow the existing design system
- Implement mobile-first responsive design
- Use CSS custom properties for theming
- Maintain consistent spacing and typography

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Example:
```
feat: add weather widget to destination cards
fix: resolve carousel loop gap issue
docs: update API documentation
```

## Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Test on multiple screen sizes and devices
- Test API endpoints using Postman or similar tools

### Running Tests

```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test
```

## Documentation

- Update README.md if you change functionality
- Update API documentation for endpoint changes
- Add JSDoc comments for complex functions
- Update TypeScript types as needed

## Feature Requests

We welcome feature requests! Please:

1. Check if the feature has already been requested
2. Open a new issue with the "feature request" label
3. Provide detailed description and use cases
4. Include mockups or wireframes if applicable

## Code Review Process

1. All submissions require review before merging
2. Maintainers will review your PR within 48 hours
3. Address any feedback or requested changes
4. Once approved, your PR will be merged

## Community Guidelines

- Be respectful and inclusive
- Help newcomers get started
- Provide constructive feedback
- Follow the code of conduct

## Getting Help

- 📧 Email: dev@wanderlog.com
- 💬 Discord: [WanderLog Community](https://discord.gg/wanderlog)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/wanderlog/issues)

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special contributor badges

Thank you for contributing to WanderLog! 🌍✈️