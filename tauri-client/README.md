# GremlinDesk - Tauri Minimalist Wrapper

This is the Option 2 implementation of GremlinDesk, using a native Tauri shell with a pure HTML/CSS/JS frontend (no React or Node modules). 

## Pre-requisites
- [Rust](https://rustup.rs/) (Cargo)
- Tauri CLI (optional, you can just use cargo)

## Setup and Run

1. **Start JanusGraph (if you haven't already)**
   If you have Docker, run `docker compose up -d` in the root `GremlinDesk` folder.

2. **Run Tauri App**
   Navigate to the `src-tauri` directory and use Cargo to run it:
   ```bash
   cd src-tauri
   cargo run
   ```

3. **How it works**
   - The Tauri backend creates the native window.
   - The UI is served from `ui/index.html`.
   - The vanilla `main.js` connects directly to `ws://localhost:8182/gremlin` using standard browser WebSockets and formats the requests/responses in GraphSON.

## Build for Distribution
To build a standalone executable:
```bash
cargo build --release
```
