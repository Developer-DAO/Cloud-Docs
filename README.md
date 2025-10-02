# D_D Cloud RPC Documentation

> Comprehensive documentation for D_D Cloud's multichain RPC service

This repository contains the source code for the D_D Cloud RPC documentation, built with [mdBook](https://rust-lang.github.io/mdBook/).

## 🚀 Quick Start

### Prerequisites

- [Rust](https://rustup.rs/) (latest stable version)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Developer-DAO/Cloud-Docs/
   cd Cloud-Docs
   ```

2. **Install mdBook and dependencies**

   ```bash
   cargo install mdbook mdbook-tabs
   ```

### Running Locally

1. **Serve the book locally**
   ```bash
   mdbook serve
   ```
2. **Open in browser**

   - Navigate to `http://localhost:3000`
   - The book will auto-reload when you make changes

3. **Build book**
   ```bash
   mdbook build
   ```
   - Output will be in the `book/` directory

## 🚀 Deployment

### GitHub Pages

1. **Push changes** to the main branch
2. **GitHub Actions** will automatically build and deploy
3. **Site available** at your GitHub Pages URL

### Documentation Advice 

1. Introduce the relevant product or technology, assume little about the audience.
2. Show helpful examples. If it's code ensure it compiles.
3. Avoid lengthy and confusing explanations.
4. Thoroughly document API endpoints. This includes all information about the request and response, not just their types.

## 🤝 Support

- **Documentation**: [mdBook Guide](https://rust-lang.github.io/mdBook/)
- **Issues**: [GitHub Issues](https://github.com/Developer-DAO/Cloud-Docs/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Developer-DAO/Cloud-Docs/discussions)
- **Email**: support@futexlabs.io

---
