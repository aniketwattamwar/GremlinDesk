# GremlinDesk

GremlinDesk is a modern, blazing fast desktop IDE for Apache TinkerPop™ Gremlin Graph Databases. It allows you to query your graph database using standard Gremlin traversal language and visualize the data in beautiful, interactive formats.

It features:
- Interactive Graph Visualizations via is-network
- Tabular Cards for precise Vertex/Edge properties
- Direct JSON view for debugging GraphSON payloads
- Completely offline, native desktop application

## Download and Install

We provide pre-compiled native desktop applications for **Windows** and **macOS**. 
You do not need to install Java, Rust, Node, or Python to use GremlinDesk!

1. Go to the Releases page of this repository.
2. **For Windows Users**: Download the GremlinDesk_installer.msi file. Double-click to install it like any other Windows application.
3. **For macOS Users**: Download the GremlinDesk.dmg file. Open it and drag the application to your Applications folder.

Once installed, just open the app, enter your Gremlin Server WebSocket URI (e.g., ws://localhost:8182/gremlin), and start querying!

## Building from Source

If you are a developer and want to build the distribution binaries yourself, GremlinDesk is built on Tauri (Rust).

### Prerequisites
1. Install Rust (rustup.rs)
2. Install cargo-tauri: cargo install tauri-cli

### Build the Installer
Open a terminal in the project directory:

`ash
cd tauri-client

# Run it locally in development mode
cargo run

# Build the native Desktop Application Installer
cargo tauri build
`

This will automatically compile the Rust backend and bundle the HTML/JS frontend into a standalone installer (.msi on Windows, .dmg on Mac). The installer will be located in 	arget/release/bundle/.
