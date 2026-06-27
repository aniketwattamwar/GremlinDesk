with open('c:/Users/anike/Documents/GitHub/GremlinDesk/README.md', 'w', encoding='utf-8') as f:
    f.write('''<p align="center">
  <img src="GD.png" width="128" alt="GremlinDesk Logo">
</p>
<h1 align="center">GremlinDesk</h1>

<p align="center">
  <b>A modern, blazing fast desktop IDE for Apache TinkerPop Gremlin Graph Databases.</b>
</p>

GremlinDesk allows you to query your graph database using standard Gremlin traversal language and visualize the data in beautiful, interactive formats.

It features:
- Interactive Graph Visualizations via vis-network
- Tabular Cards for precise Vertex/Edge properties
- Direct JSON view for debugging GraphSON payloads
- Completely offline, native desktop application built in Rust (Tauri)

## Download and Install

We provide pre-compiled native desktop applications for **Windows** and **macOS**. 
You do not need to install Java, Rust, Node, or Python to use GremlinDesk!

**[Download the Latest Release Here](https://github.com/aniketwattamwar/GremlinDesk/releases/latest)**

1. **For Windows Users**: Download the \GremlinDesk_installer.msi\ file. Double-click to install it like any other Windows application.
2. **For macOS Users**: Download the \GremlinDesk.dmg\ file. Open it and drag the application to your Applications folder.

Once installed, just open the app, enter your Gremlin Server WebSocket URI (e.g., \ws://localhost:8182/gremlin\), and start querying!

## Building from Source

If you are a developer and want to build the distribution binaries yourself, GremlinDesk is built on Tauri (Rust).

### Prerequisites
1. Install [Rust](https://rustup.rs/)
2. Install cargo-tauri: \cargo install tauri-cli\

### Build the Installer
Open a terminal in the project directory:

\\\ash
cd tauri-client

# Run it locally in development mode
cargo run

# Build the native Desktop Application Installer
cargo tauri build
\\\

This will automatically compile the Rust backend and bundle the HTML/JS frontend into a standalone installer (\.msi\ on Windows, \.dmg\ on Mac). The installer will be located in \	arget/release/bundle/\.
''')
