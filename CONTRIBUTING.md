# Contributing to War of the Worlds

First off, thanks for taking the time to contribute! 🎉

## How Can I Contribute?

### Reporting Bugs
- Use the GitHub issue tracker
- Describe the bug in detail
- Include browser version and OS
- Add screenshots if applicable
- List steps to reproduce

### Suggesting Features
- Check existing issues first
- Explain the feature and its use case
- Be open to discussion

### Code Contributions

#### Getting Started
1. Fork the repo
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/war-of-worlds-game.git`
3. Create a branch: `git checkout -b feature/your-feature-name`

#### Making Changes
1. Edit `index.html` (everything is in this one file)
2. Test in multiple browsers:
   - Chrome/Edge (primary)
   - Firefox
   - Safari
3. Keep the code readable with comments
4. Don't add external dependencies

#### Testing Checklist
- [ ] Game loads without errors
- [ ] All controls work (WASD, Space, 1, 2, P)
- [ ] Vehicles respond correctly
- [ ] Tripods spawn and behave properly
- [ ] Heat ray visual effects work
- [ ] Win/lose conditions trigger correctly
- [ ] No console errors
- [ ] Performance is smooth (60fps on modern hardware)

#### Code Style
- Use 4-space indentation
- Clear variable names
- Comment complex Three.js logic
- Group related functions together
- Keep the single-file architecture

#### Commit Messages
Use clear, descriptive commit messages:
```
Add cannon vehicle with arc projectiles
Fix heat ray not disappearing on tripod death
Improve vehicle collision detection
Update README with new features
```

#### Submitting
1. Commit your changes: `git commit -m 'Add feature'`
2. Push to your fork: `git push origin feature/your-feature-name`
3. Open a Pull Request
4. Describe your changes clearly
5. Reference any related issues

### Documentation
- Update README.md for new features
- Add entries to CHANGELOG.md
- Update controls/stats if changed
- Add comments for complex code

## Development Setup

### Recommended Tools
- **VS Code** with Live Server extension
- **Chrome DevTools** for debugging
- **Git** for version control

### Local Testing
```bash
# Simple HTTP server
python -m http.server 8000

# Or use Node
npx serve

# Or VS Code Live Server
# Right-click index.html → "Open with Live Server"
```

### File Structure
```
Everything is in index.html:
├── HTML structure (minimal)
├── CSS styling
├── JavaScript
    ├── Three.js imports
    ├── Game state
    ├── Vehicle creation
    ├── Enemy AI
    ├── Combat system
    ├── UI updates
    └── Animation loop
```

## Feature Ideas

If you're looking for something to work on, check out:
- Issues labeled `good first issue`
- Issues labeled `help wanted`
- The roadmap in README.md

## Questions?

Feel free to:
- Open a discussion on GitHub
- Comment on existing issues
- Ask in pull requests

## Code of Conduct

- Be respectful and constructive
- Welcome newcomers
- Focus on the code, not the person
- Help each other learn

---

Thank you for contributing! 🚀
