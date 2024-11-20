# Solana CRUD Program

Smart contract (program) built with Anchor framework for performing CRUD operations on the Solana blockchain.

## 🛠 Prerequisites

- [Rust](https://rustup.rs/)
- [Solana Tool Suite](https://docs.solana.com/cli/install-solana-cli-tools) v1.17.0 or later
- [Anchor Framework](https://www.anchor-lang.com/docs/installation) v0.28.0 or later
- [Node.js](https://nodejs.org/) v16.0.0 or later

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Install project dependencies
npm install
```

### 2. Configure Solana CLI

```bash
# Set your Solana configuration to localhost
solana config set --url localhost

# Generate a new keypair if you don't have one
solana-keygen new

# Start the local validator
solana-test-validator
```

### 3. Build and Deploy

```bash
# Build the program
anchor build

# Get the program ID
solana address -k target/deploy/crud_program-keypair.json

# Deploy the program
anchor deploy

# Update the program ID in Anchor.toml and lib.rs
anchor keys sync
```

## 📝 Testing

```bash
# Run all tests
anchor test

# Run specific test
anchor test test_create_post
```

## 🏗 Program Structure

```
├── programs/
│   └── crud-program/
│       ├── src/
│       │   ├── lib.rs          # Program entry point
│       │
│       └── Cargo.toml
├── tests/                      # Program integration tests
├── Anchor.toml                 # Anchor configuration
└── package.json
```

## ⚡️ Available Instructions

1. `Create Entry` - Create a new record
2. `Update Entry` - Update an existing record
3. `Delete Entry` - Delete an existing record

## 🐛 Common Issues & Solutions

1. **Build Failures**

   ```bash
   anchor clean
   anchor build
   ```

2. **Test Validator Issues**

   ```bash
   solana-test-validator --reset
   ```

3. **Program ID Mismatch**
   - Ensure program ID is updated in both `Anchor.toml` and `lib.rs`
   - Rebuild and redeploy after updating
