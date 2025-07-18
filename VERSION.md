# FocusFlow Version

## Current Version: 1.1.0

### Version Format
This project follows [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH):

- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

### Version History
- **1.1.0** (2025-07-18) - PWA auto-updates, app name fixes, repository cleanup, versioning system
- **1.0.0** (2025-07-11) - Initial release with core Pomodoro functionality

### How to Update Version

When making changes, update the version in these files:

1. **VERSION.md** (this file) - Update the version number
2. **package.json** - Update the "version" field
3. **sw.js** - Update the CACHE_NAME (e.g., `focusflow-cache-v1.1.1`)
4. **CHANGELOG.md** - Add a new version section with changes

### Example Version Update
```bash
# Update VERSION.md
Current Version: 1.1.1

# Update package.json
"version": "1.1.1"

# Update sw.js
const CACHE_NAME = 'focusflow-cache-v1.1.1';

# Update CHANGELOG.md
## [1.1.1] - 2025-01-XX
### Added
- New feature description
```

### Release Process
1. Update version numbers in all files
2. Update CHANGELOG.md with new changes
3. Commit changes with version bump
4. Create a git tag for the release
5. Push to repository

```bash
git add .
git commit -m "Bump version to 1.1.1"
git tag v1.1.1
git push origin main --tags
``` 