//! Payment system modules for Solana AI Registries
//!
//! This module provides payment functionality for the registries,
//! including different payment flows based on feature flags.

// Conditional module exports based on feature flags
#[cfg(feature = "prepay")]
pub mod prepay;

#[cfg(feature = "pyg")]
pub mod pyg;

#[cfg(feature = "stream")]
pub mod stream;

// Common payment types and utilities
pub mod common;

// Re-export common types
pub use common::*;

// Re-export feature-specific modules
#[cfg(feature = "prepay")]
pub use prepay::*;

#[cfg(feature = "pyg")]
pub use pyg::*;

#[cfg(feature = "stream")]
pub use stream::*;
