#!/bin/bash

# Install Rust & wasm-pack if not already
curl https://sh.rustup.rs -sSf | sh -s -- -y
source $HOME/.cargo/env
cargo install wasm-pack

# Build WASM
cd rust-calc
wasm-pack build --target web
cd ..

# Run normal build
npm run build
