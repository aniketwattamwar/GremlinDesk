<p align="center">
  <img src="GD.png" width="128" alt="GremlinDesk Logo">
</p>
<h1 align="center">GremlinDesk</h1>

<p align="center">
  <b>The modern, blazing-fast desktop IDE for Apache TinkerPop Gremlin Graph Databases.</b>
</p>

GremlinDesk empowers you to query your graph databases using standard Gremlin traversal language and instantly visualize your data through beautiful, interactive UI elements. Built from the ground up for speed and usability, it provides a premium developer experience entirely offline.

---

<p align="center">
  <img src="UI_1.png" width="800" alt="GremlinDesk Interface">
</p>

## ✨ Features

- 🕸️ **Interactive Graph Visualizations**: Watch your vertices and edges come to life via `vis-network`. Drag, drop, and inspect nodes in a beautiful interactive canvas.
- 🗂️ **Multi-Connection Manager**: Seamlessly switch between local development clusters and remote Kubernetes pods. Your connections are securely saved and maintain active WebSockets in the background.
  <br><img src="connection.png" width="400" alt="Connection Manager">
- 💾 **Saved Queries**: Write it once, use it forever. Save your most complex Gremlin queries directly to the built-in library for instant execution.
  <br><img src="saved_queries.png" width="400" alt="Saved Queries Panel">
- 🃏 **Tabular Cards**: View precise Vertex and Edge properties in a clean, readable card format.
- 👩‍💻 **Direct JSON View**: Debug raw GraphSON payloads exactly as they are returned from the server.
- ⚡ **Native Performance**: A completely offline, standalone desktop application built in Rust (Tauri), ensuring lightning-fast load times and minimal memory footprint.

## 🚀 Download and Install

We provide pre-compiled, native desktop applications for **Windows**, **macOS**, and **Linux**. You do **not** need to install Java, Rust, Node, or Python to use GremlinDesk!

**[Download the Latest Release Here](https://github.com/aniketwattamwar/GremlinDesk/releases/latest)**

1. **For Windows Users**: Download the `GremlinDesk_..._x64-setup.exe` or `.msi` file. Double-click to install it like any other Windows application.
2. **For macOS Users**: Download the `GremlinDesk.dmg` or `.app.tar.gz`. Open it and drag the application to your Applications folder.
3. **For Linux Users**: Download the `.deb` or `AppImage` for your platform.

Once installed, simply open the app, manage your connections, and start querying your graphs!

## 🛠️ Building from Source

If you are a developer and want to build the distribution binaries yourself, GremlinDesk is powered by Tauri (Rust) and standard web technologies.

### Prerequisites
1. Install [Rust](https://rustup.rs/)
2. Install `cargo-tauri`: 
   ```bash
   cargo install tauri-cli
   ```

### Build the Installer
Open a terminal in the project directory:

```bash
cd tauri-client

# Run it locally in development mode
cargo tauri dev

# Build the native Desktop Application Installer
cargo tauri build
```
This will automatically compile the Rust backend and bundle the HTML/JS frontend into a standalone installer (`.msi` on Windows, `.dmg` on Mac, `.deb` on Linux). The installer will be located in `src-tauri/target/release/bundle/`.
