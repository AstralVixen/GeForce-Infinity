# Contributing to GeForce Infinity

First off, thank you for taking the time to contribute! This document outlines how to get started with contributing to **GeForce Infinity**, along with the standards and approval process required.

---

## 📦 Project Setup

If this is your first time contributing:

1. **Fork** the repository to your own GitHub account:  
   https://github.com/AstralVixen/GeForce-Infinity/fork

2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/GeForce-Infinity.git
   cd GeForce-Infinity
   ```

3. Set the **original repository** as an upstream remote:
    ```bash
    git remote add upstream https://github.com/AstralVixen/GeForce-Infinity.git
    ```

## 🌿 Branching & Workflow
1. Always create a new branch for your work:
    ```bash
    git checkout -b your-feature-name
    ```
2. If your branch is a small fix simply name it. But if it's a major bugfix or new feature you must name it as fix/your-feature-name or feature/your-feature-name

3. Keep your fork up to date:
    ```bash
    git fetch upstream
    git rebase upstream/main
    ```
4. Push your changes 
    ```
    git push origin your-feature-name
    ````

## 🧹 Code Style & Formatting
We use **Prettier** for formatting. You **must format your code** before submitting a PR.

**Prettier Settings:**
- Mostly default but indentation **must** be set to 4 spaces.

## 🧠 Code Quality Guidelines
1. ✅ Write clean, modular, and dynamic code

2. 🧼 Avoid hardcoding whenever possible

3. 💬 Use comments for non-trivial logic or important context

3. 🚫 Avoid huge PRs – break things into smaller changes where possible

4. 🧪 If applicable, add test coverage or usage examples

## ✅ Pull Request Process
1. Push your branch to your fork

2. Open a Pull Request to the master branch of our repo.

3. Include a clear title and description of the changes made.

4. **PR Review Requirements:**
- Your PR must be approved by **both**:
    - @AstralVixen
    - @t0msk

## 💬 Questions or Help?
If you’re unsure or want feedback before writing code:
- Write to us on Discord (linked in [README](https://github.com/AstralVixen/GeForce-Infinity#readme)) or start a [discussion](https://github.com/AstralVixen/GeForce-Infinity/discussions)

## We’re glad to have you here — happy coding! 💻