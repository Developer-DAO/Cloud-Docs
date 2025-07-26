# D_D Cloud RPC Documentation

> Comprehensive documentation for D_D Cloud's multi-chain RPC service

This repository contains the source code for the D_D Cloud RPC documentation, built with [mdBook](https://rust-lang.github.io/mdBook/).

## 🚀 Quick Start

### Prerequisites

- [Rust](https://rustup.rs/) (latest stable version)
- [mdBook](https://rust-lang.github.io/mdBook/guide/installation.html)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/jamiebones/rpc-doc-sample
   cd rpc-doc-sample
   ```

2. **Install mdBook**

   ```bash
   cargo install mdbook
   ```

3. **Install mdBook plugins** (optional but recommended)
   ```bash
   cargo install mdbook-linkcheck
   cargo install mdbook-toc
   ```

### Running Locally

1. **Serve the book locally**
   ```bash
   mdbook serve
   ```
2. **Open in browser**

   - Navigate to `http://localhost:3000`
   - The book will auto-reload when you make changes

3. **Build static files**
   ```bash
   mdbook build
   ```
   - Output will be in the `book/` directory

## 📁 Project Structure

```
rpc-docs/
├── book.toml              # mdBook configuration
├── src/                   # Documentation source files
│   ├── SUMMARY.md         # Table of contents
│   ├── introduction.md    # Introduction page
│   ├── getting-started/   # Getting started guides
│   ├── api-reference/     # API documentation
│   ├── methods/           # RPC method documentation
│   │   ├── evm/          # Ethereum-compatible chains
│   │   ├── solana/       # Solana methods
│   │   ├── cosmos/       # Cosmos ecosystem
│   │   ├── near/         # NEAR Protocol
│   │   ├── sui/          # Sui Network
│   │   └── tron/         # TRON Network
│   ├── networks/         # Supported networks
│   ├── examples/         # Code examples
│   │   ├── javascript/   # JavaScript/Node.js
│   │   ├── python/       # Python examples
│   │   ├── go/           # Go examples
│   │   ├── rust/         # Rust examples
│   │   └── curl/         # cURL examples
│   ├── websockets/       # WebSocket documentation
│   ├── advanced/         # Advanced topics
│   ├── troubleshooting/  # Common issues and solutions
│   └── resources/        # Additional resources
├── theme/                # Custom styling
│   ├── custom.css        # Custom CSS styles
│   └── custom.js         # Custom JavaScript
└── book/                 # Generated output (auto-created)
```

## ✏️ Contributing

### Adding New Content

1. **Create new markdown files** in the appropriate `src/` subdirectory
2. **Update `src/SUMMARY.md`** to include your new pages in the navigation
3. **Follow the existing structure** and formatting conventions

### Editing Existing Content

1. **Find the relevant `.md` file** in the `src/` directory
2. **Make your changes** using standard Markdown syntax
3. **Test locally** with `mdbook serve`

### Markdown Guidelines

- Use **clear, descriptive headings**
- Include **code examples** with proper syntax highlighting
- Add **links** to related sections
- Use **callout boxes** for important information:

  ```markdown
  > **Note:** This is an important note

  > **Warning:** This is a warning
  ```

### Code Examples

When adding code examples, use appropriate language tags:

````markdown
```javascript
// JavaScript example
const provider = new ethers.JsonRpcProvider("https://rpc.ddcloud.io/eth");
```

```python
# Python example
from web3 import Web3
w3 = Web3(Web3.HTTPProvider('https://rpc.ddcloud.io/eth'))
```

```bash
# cURL example
curl -X POST https://rpc.ddcloud.io/eth \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```
````

## 🎨 Theming

The documentation uses a custom theme with both light and dark modes:

- **Default**: Light theme
- **Dark mode**: Available via theme toggle
- **Custom styles**: Located in `theme/custom.css`
- **Custom scripts**: Located in `theme/custom.js`

### Customizing Styles

To modify the appearance:

1. **Edit `theme/custom.css`** for styling changes
2. **Modify CSS variables** for color scheme adjustments
3. **Test changes** with `mdbook serve`

## 🔧 Configuration

The main configuration is in `book.toml`:

```toml
[book]
title = "D_D Cloud RPC Documentation"
authors = ["D_D Cloud Team"]
description = "Comprehensive documentation for D_D Cloud's multi-chain RPC service"

[output.html]
additional-css = ["theme/custom.css"]
additional-js = ["theme/custom.js"]
default-theme = "navy"
```

### Key Features Enabled

- **Search**: Full-text search functionality
- **Code playground**: Interactive code examples
- **Folding**: Collapsible sections
- **Git integration**: Edit links and repository info

## 🚀 Deployment

### GitHub Pages

1. **Push changes** to the main branch
2. **GitHub Actions** will automatically build and deploy
3. **Site available** at your GitHub Pages URL

### Manual Deployment

1. **Build the book**

   ```bash
   mdbook build
   ```

2. **Deploy the `book/` directory** to your web server

### Docker Deployment

```dockerfile
FROM nginx:alpine
COPY book/ /usr/share/nginx/html/
EXPOSE 80
```

## 🛠️ Development Commands

| Command        | Description              |
| -------------- | ------------------------ |
| `mdbook serve` | Start development server |
| `mdbook build` | Build static files       |
| `mdbook test`  | Test code examples       |
| `mdbook clean` | Clean build artifacts    |
| `mdbook watch` | Watch for changes        |

## 📝 Writing Guidelines

### Content Structure

1. **Start with overview** - Brief introduction to the topic
2. **Provide examples** - Show practical usage
3. **Include parameters** - Document all parameters and responses
4. **Add troubleshooting** - Common issues and solutions

### API Documentation Format

````markdown
## method_name

Brief description of what this method does.

### Parameters

| Parameter | Type     | Required | Description              |
| --------- | -------- | -------- | ------------------------ |
| `param1`  | `string` | Yes      | Description of parameter |
| `param2`  | `number` | No       | Optional parameter       |

### Example Request

\```javascript
// Example code here
\```

### Example Response

\```json
{
"jsonrpc": "2.0",
"id": 1,
"result": "0x..."
}
\```

### Error Codes

| Code   | Message         | Description                                 |
| ------ | --------------- | ------------------------------------------- |
| -32600 | Invalid Request | The JSON sent is not a valid Request object |
````

## 🐛 Troubleshooting

### Common Issues

**mdBook not found**

```bash
cargo install mdbook
```

**Port already in use**

```bash
mdbook serve --port 3001
```

**Build fails**

- Check `book.toml` syntax
- Verify all links in `SUMMARY.md` point to existing files
- Run `mdbook test` to check code examples

### Getting Help

- **Documentation**: [mdBook Guide](https://rust-lang.github.io/mdBook/)
- **Issues**: Create an issue in this repository
- **Community**: Join our Discord/Telegram for support

## 📄 License

This documentation is licensed under [MIT License](LICENSE).

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/your-org/rpc-docs/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/rpc-docs/discussions)
- **Email**: support@ddcloud.io
- **Discord**: [Join our community](https://discord.gg/ddcloud)

---

**Happy documenting!** 📚✨
