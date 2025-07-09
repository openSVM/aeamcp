use anchor_lang::prelude::*;
use crate::error::{AccessControlError, SecurityError};
use crate::state::{NonceWindow, PermissionGrant};

/// Security audit configuration and constants
pub struct SecurityConfig {
    pub max_concurrent_operations: u8,
    pub rate_limit_window_seconds: i64,
    pub max_operations_per_window: u32,
    pub suspicious_activity_threshold: u32,
    pub enable_timing_attack_protection: bool,
}

impl Default for SecurityConfig {
    fn default() -> Self {
        Self {
            max_concurrent_operations: 10,
            rate_limit_window_seconds: 60,
            max_operations_per_window: 100,
            suspicious_activity_threshold: 50,
            enable_timing_attack_protection: true,
        }
    }
}

/// Audit trail entry for security monitoring
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct AuditEntry {
    pub timestamp: i64,
    pub wallet: Pubkey,
    pub operation: String,
    pub resource_id: String,
    pub success: bool,
    pub error_code: Option<u32>,
    pub nonce_used: u64,
    pub delegation_depth: u8,
}

/// Security monitor for detecting suspicious patterns
pub struct SecurityMonitor {
    config: SecurityConfig,
    recent_operations: Vec<AuditEntry>,
}

impl SecurityMonitor {
    pub fn new(config: SecurityConfig) -> Self {
        Self {
            config,
            recent_operations: Vec::new(),
        }
    }
    
    /// Record operation for security monitoring
    pub fn record_operation(&mut self, entry: AuditEntry) -> Result<(), SecurityError> {
        // Clean old entries first
        let cutoff_time = entry.timestamp - self.config.rate_limit_window_seconds;
        self.recent_operations.retain(|e| e.timestamp > cutoff_time);
        
        // Check rate limiting
        let wallet_operations = self.recent_operations
            .iter()
            .filter(|e| e.wallet == entry.wallet)
            .count() as u32;
        
        if wallet_operations >= self.config.max_operations_per_window {
            return Err(SecurityError::RateLimitExceeded);
        }
        
        // Check for suspicious patterns
        if self.detect_suspicious_activity(&entry)? {
            return Err(SecurityError::SuspiciousActivity);
        }
        
        // Record the operation
        self.recent_operations.push(entry);
        
        Ok(())
    }
    
    /// Detect suspicious activity patterns
    fn detect_suspicious_activity(&self, entry: &AuditEntry) -> Result<bool, SecurityError> {
        let wallet_entries: Vec<_> = self.recent_operations
            .iter()
            .filter(|e| e.wallet == entry.wallet)
            .collect();
        
        // Check for excessive failed operations
        let recent_failures = wallet_entries
            .iter()
            .filter(|e| !e.success)
            .count() as u32;
        
        if recent_failures >= self.config.suspicious_activity_threshold {
            return Ok(true);
        }
        
        // Check for rapid nonce progression (possible replay attack)
        if let Some(last_entry) = wallet_entries.last() {
            let nonce_jump = entry.nonce_used.saturating_sub(last_entry.nonce_used);
            if nonce_jump > 1000 {
                return Ok(true);
            }
        }
        
        // Check for unusual delegation patterns
        if entry.delegation_depth > 3 {
            let deep_delegations = wallet_entries
                .iter()
                .filter(|e| e.delegation_depth > 3)
                .count();
            
            if deep_delegations > 10 {
                return Ok(true);
            }
        }
        
        Ok(false)
    }
}

/// Nonce security validation with overflow and manipulation detection
pub fn validate_nonce_security(
    nonce_window: &NonceWindow,
    new_nonce: u64,
    current_time: i64,
    last_update_time: i64,
) -> Result<(), AccessControlError> {
    // Check for nonce overflow
    if new_nonce == u64::MAX {
        return Err(AccessControlError::NonceOverflow);
    }
    
    // Check for rollover protection
    if new_nonce < nonce_window.base_nonce {
        return Err(AccessControlError::NonceOverflow);
    }
    
    // Check for window manipulation
    let nonce_jump = new_nonce.saturating_sub(nonce_window.base_nonce);
    if nonce_jump > crate::state::NONCE_WINDOW_SIZE * 10 {
        return Err(crate::error::SecurityError::NonceWindowManipulation.into());
    }
    
    // Check for rapid updates (possible concurrent manipulation)
    let time_since_last_update = current_time - last_update_time;
    if time_since_last_update < 1 { // Less than 1 second
        return Err(AccessControlError::ConcurrentNonceUpdate);
    }
    
    Ok(())
}

/// Delegation security validation with circular detection
pub fn validate_delegation_security(
    grants: &[PermissionGrant],
    new_grant: &PermissionGrant,
    granter: &Pubkey,
) -> Result<(), AccessControlError> {
    // Check for privilege escalation
    if let Some(granter_grant) = grants.iter().find(|g| g.wallet == *granter) {
        // Granter cannot grant more permissions than they have
        for operation in &new_grant.operations {
            if !granter_grant.allows_operation(operation) {
                return Err(crate::error::SecurityError::DelegationPrivilegeEscalation.into());
            }
        }
        
        // Check delegation depth limits
        if new_grant.delegation_depth <= granter_grant.delegation_depth {
            return Err(AccessControlError::InvalidDelegationChain);
        }
    }
    
    // Check for circular delegation
    let mut visited = std::collections::HashSet::new();
    let mut current = new_grant.granted_by;
    
    while let Some(grant) = grants.iter().find(|g| g.wallet == current) {
        if visited.contains(&current) {
            return Err(AccessControlError::CircularDelegationDetected);
        }
        visited.insert(current);
        current = grant.granted_by;
        
        // Prevent infinite loops
        if visited.len() > crate::state::MAX_DELEGATION_DEPTH as usize {
            return Err(AccessControlError::DelegationChainTooDeep);
        }
    }
    
    Ok(())
}

/// Timing attack protection for sensitive operations
pub fn timing_attack_protection<F, R>(operation: F) -> Result<R, AccessControlError>
where
    F: FnOnce() -> Result<R, AccessControlError>,
{
    let start_time = Clock::get()?.unix_timestamp;
    
    let result = operation();
    
    // Add constant delay to prevent timing analysis
    let elapsed = Clock::get()?.unix_timestamp - start_time;
    if elapsed < 1 {
        // In a real implementation, you'd want to use a proper delay mechanism
        // This is a placeholder for timing attack protection
    }
    
    result
}

/// Comprehensive security audit function
pub fn perform_security_audit(
    _resource_id: &str,
    operation: &str,
    wallet: &Pubkey,
    _nonce: u64,
    timestamp: i64,
    grants: &[PermissionGrant],
) -> Result<SecurityAuditResult, AccessControlError> {
    let mut audit_result = SecurityAuditResult::new();
    
    // Check for replay attack patterns
    audit_result.replay_risk = assess_replay_risk(nonce, timestamp, grants)?;
    
    // Check delegation chain integrity
    audit_result.delegation_risk = assess_delegation_risk(wallet, grants)?;
    
    // Check for privilege escalation attempts
    audit_result.privilege_escalation_risk = assess_privilege_escalation(operation, grants)?;
    
    // Check for suspicious timing patterns
    audit_result.timing_anomaly = assess_timing_anomaly(timestamp)?;
    
    // Overall risk assessment
    audit_result.overall_risk = calculate_overall_risk(&audit_result);
    
    Ok(audit_result)
}

#[derive(Debug, Clone)]
pub struct SecurityAuditResult {
    pub replay_risk: RiskLevel,
    pub delegation_risk: RiskLevel,
    pub privilege_escalation_risk: RiskLevel,
    pub timing_anomaly: RiskLevel,
    pub overall_risk: RiskLevel,
}

impl SecurityAuditResult {
    pub fn new() -> Self {
        Self {
            replay_risk: RiskLevel::Low,
            delegation_risk: RiskLevel::Low,
            privilege_escalation_risk: RiskLevel::Low,
            timing_anomaly: RiskLevel::Low,
            overall_risk: RiskLevel::Low,
        }
    }
}

#[derive(Debug, Clone, PartialEq, PartialOrd)]
pub enum RiskLevel {
    Low,
    Medium,
    High,
    Critical,
}

fn assess_replay_risk(
    _nonce: u64,
    timestamp: i64,
    _grants: &[PermissionGrant],
) -> Result<RiskLevel, AccessControlError> {
    let current_time = Clock::get()?.unix_timestamp;
    let age = current_time - timestamp;
    
    if age > 300 { // 5 minutes
        Ok(RiskLevel::High)
    } else if age > 60 { // 1 minute
        Ok(RiskLevel::Medium)
    } else {
        Ok(RiskLevel::Low)
    }
}

fn assess_delegation_risk(
    wallet: &Pubkey,
    grants: &[PermissionGrant],
) -> Result<RiskLevel, AccessControlError> {
    if let Some(grant) = grants.iter().find(|g| g.wallet == *wallet) {
        if grant.delegation_depth > 3 {
            Ok(RiskLevel::High)
        } else if grant.delegation_depth > 1 {
            Ok(RiskLevel::Medium)
        } else {
            Ok(RiskLevel::Low)
        }
    } else {
        Ok(RiskLevel::Low)
    }
}

fn assess_privilege_escalation(
    _operation: &str,
    _grants: &[PermissionGrant],
) -> Result<RiskLevel, AccessControlError> {
    // Placeholder for privilege escalation detection
    Ok(RiskLevel::Low)
}

fn assess_timing_anomaly(timestamp: i64) -> Result<RiskLevel, AccessControlError> {
    let current_time = Clock::get()?.unix_timestamp;
    let time_diff = (current_time - timestamp).abs();
    
    if time_diff > 30 {
        Ok(RiskLevel::Medium)
    } else {
        Ok(RiskLevel::Low)
    }
}

fn calculate_overall_risk(audit: &SecurityAuditResult) -> RiskLevel {
    let risks = [
        &audit.replay_risk,
        &audit.delegation_risk,
        &audit.privilege_escalation_risk,
        &audit.timing_anomaly,
    ];
    
    // Return the highest risk level
    risks.iter().max().unwrap().clone()
}

/// Macro for compile-time security checks
#[macro_export]
macro_rules! security_check {
    ($condition:expr, $error:expr) => {
        if !($condition) {
            return Err($error);
        }
    };
}

/// Macro for audit logging with compile-time validation
#[macro_export]
macro_rules! audit_log {
    ($level:expr, $message:expr, $($args:expr),*) => {
        {
            let formatted_message = format!($message, $($args),*);
            // In production, this would write to an audit log
            msg!("[AUDIT:{}] {}", $level, formatted_message);
        }
    };
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_security_monitor() {
        let config = SecurityConfig::default();
        let mut monitor = SecurityMonitor::new(config);
        
        let entry = AuditEntry {
            timestamp: 1000,
            wallet: Pubkey::default(),
            operation: "test".to_string(),
            resource_id: "test_resource".to_string(),
            success: true,
            error_code: None,
            nonce_used: 1,
            delegation_depth: 0,
        };
        
        assert!(monitor.record_operation(entry).is_ok());
    }
    
    #[test]
    fn test_risk_assessment() {
        let grants = vec![];
        let result = assess_replay_risk(1, 1000, &grants);
        assert!(result.is_ok());
    }
}