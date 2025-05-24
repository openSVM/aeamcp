FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    pkg-config \
    libudev-dev \
    llvm \
    libclang-dev \
    git

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Solana CLI
RUN sh -c "$(curl -sSfL https://release.solana.com/v1.18.18/install)"
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

WORKDIR /workspace
COPY . .

# Install cargo-build-sbf
RUN cargo install --git https://github.com/solana-labs/solana.git cargo-build-sbf --tag v1.18.18

# Build the programs
RUN cargo build-sbf --manifest-path programs/agent-registry/Cargo.toml
RUN cargo build-sbf --manifest-path programs/mcp-server-registry/Cargo.toml