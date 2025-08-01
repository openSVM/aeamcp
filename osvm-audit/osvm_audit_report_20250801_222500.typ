#set document(title: "OSVM Security Audit Report")
#set page(numbering: "1")
#set text(size: 11pt)
#set heading(numbering: "1.")

#align(center)[
  #text(size: 24pt, weight: "bold")[OSVM Security Audit Report]
  
  #v(1em)
  
  #text(size: 14pt)[Comprehensive Security Assessment]
  
  #v(2em)
  
  #text(size: 12pt)[
    Generated: 2025-08-01 22:25:00 UTC
    
    Version: 0.4.4
    
    Security Score: 40.68096160888672/100
    
    Compliance Level: Critical
  ]
]

#pagebreak()

= Executive Summary

This report presents the results of a comprehensive security audit conducted on the OSVM (Open SVM) CLI application. The audit identified 793 findings across various security domains.

#table(
  columns: (auto, auto),
  stroke: none,
  [*Metric*], [*Value*],
  [Total Findings], [793],
  [Critical], [197],
  [High], [344],
  [Medium], [80],
  [Low], [3],
  [Info], [169],
  [Security Score], [40.68096160888672/100],
  [Compliance Level], [Critical],
)


#text(fill: red, weight: "bold")[
  ⚠️ This audit identified 541 critical or high severity findings that require immediate attention.
]


= System Information

#table(
  columns: (auto, auto),
  stroke: none,
  [*Component*], [*Version*],
  [Rust], [rustc 1.87.0 (17067e9ac 2025-05-09)],
  [Solana], [Not installed],
  [OS], [linux x86_64],
  [Architecture], [x86_64],
)

= Security Findings


== Configuration (1 findings)


=== OSVM-002 - Solana CLI not installed

*Severity:* High
*Category:* Configuration

*CVSS Score:* 7.5

*Description:*
Solana CLI is required for OSVM operations

*Impact:*
General security concern requiring assessment

*Recommendation:*
Install Solana CLI using the official installer




*References:*

- https://docs.solana.com/running-validator/validator-start





== Cryptography (163 findings)


=== OSVM-CRYPTO-5c0bbaccb2fefc7e - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-62ab3143ac8c018d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a008b23286f31864 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ec6ed7e018a11545 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a02b84e77e157d97 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a15b894978b7f438 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-27af65e7ab1b53b7 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d18357a1b9e621ae - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-0d550f0c7c09df66 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ec487647f872f87c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-c9897a13e9eb3356 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-65a94c17a5636c00 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a9e740da52cc7eaa - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-73a61eb63dd5a34b - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d49147d81205bc02 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-e28036ffe5d83d45 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ae21b2875bb8ab6f - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-c25844361718460d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d2eba531112b4021 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-0d8f82a5345d6c6d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-107d4b27b6c0b7e4 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/token_integration_test.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/token_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d30368c57e5162a3 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-663857c4f8073034 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-85b7c3116a255d3c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-5f8431f257f3ef21 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-67db2e0c73d71efc - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-23a0a144e795e317 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-08474c1fbd2b02d8 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-0b8c7fa8dcde4b28 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-4d536a5c8842f27a - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a11a67c8208bb462 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a327c8d76cd53eb7 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-48a1118cfc078fd5 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-79709c7efd2c1ac8 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-77f1efe9571419dd - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d69a3ffa2141b592 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-6b6b6d3b10118693 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-292ac28fc78beb4e - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-9a9f3d07b02d4ca3 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-6210e479dc60fe02 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ca07027546dbe574 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-310103f71cf53b7f - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-21bb6daaad5300ec - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-12cc7201fc173953 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-038baaae44eeeb70 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-0946835f5246f979 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a5546fb855930e78 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-38cc117e3a667035 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-36aef41b16a2f728 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-11765693e4fdf934 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-e0f6577074b5957a - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-72636379083673a7 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-43d8ea4240782667 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-f83f661c250b71db - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-0d52236d23c683d1 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-06cdcfeeed23ab99 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-89b102e38f045f67 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-9e60dcd765f365c9 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-43592f23d6359ff5 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ce0e42b4b636ea94 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-29c2aa36110ffbd3 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-222af2827de67df7 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-621791f7a091b1d5 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d996faf08cd74433 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-e427df7d48866fbf - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-34d541fd8bc9d6b5 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-9c6775288f711115 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ac17d6363577f966 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-90a36d3e57c4142f - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-0625c395cdf70710 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-18e0799589a10142 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-9bf76d9ef133f782 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-869181b2fa377059 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ebb7f7cb25f91977 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d620d0bfca7be15d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-1b69159b07eb2e65 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-f46faa5680aa3400 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a9543fbe32b935f8 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-751d3094183ae1e8 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-3bfa00d52907f092 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-606ba053a6692a0e - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-345d683c711c4942 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-b581bb3dafdf161f - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-3d2e1181c3a06265 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-5a312caef1d27b8d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-7440a20d097f95fd - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-9c4a2e08d7c35f52 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-c6f6d3bb297e6103 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-4861598916781bdf - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/token_integration_test.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/token_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-f7cb9c54ae06b47b - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/token_integration_test.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/token_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-92c53c907182d8fe - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-dd4ee3875039e031 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d0064f664f5c3122 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-0f970ad15aa15f1d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-813c3c376cf0245c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-3ccd2c1340a38f4a - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-6de1d899b179cc42 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-f2a3e41408c10e4c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-295e418a1765465b - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-bbc697ce0fc236a2 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-2a03216b32239c53 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-f5e5982b22de23dc - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-aa78b4a8de0a29e4 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a0cad0ffa2fef7cd - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-509e1e99b9f3d511 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-bdc754ce07f2fa33 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-36005caf74abe6b2 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-679c65d9f70a03e1 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-82cb9c38aeac55a5 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-b05f000e2db2158a - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a75f0e4ef9d5bfd3 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-8b98f81f322080bd - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-7d7ff7b9973f5457 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-6248d36ddd3b422d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-f2696af6d66f3607 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-3a841a11363d44d9 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-be3b1c676070501f - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-48bf0223a977e973 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-0ed3371155548032 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ceb8f0857c44686e - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ebcfa556aa1ff472 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-b44d37d42c96059d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-0e2fa5d87202a9ef - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-1acc7382decbffb1 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-875ae277be03d612 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-5c88b22877aeecf4 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a86fccfc7996936c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-b13e224d9fa1e87b - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ce3fe8bc7c503fc8 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-73ac8ee25e03511d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-f828473d49f4f38c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-82a3c9b39fae0e6f - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-1ae0f2a2e6e9ea33 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-48cccb0e8c2b969a - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/agent/mod.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/agent/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-449b2b8e5b32457b - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/client.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/client.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-148aece7740482cd - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/client.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/client.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-cb89aa6098e2577f - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/client.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/client.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-6aab21404e653cb0 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/client.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/client.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-7128a4ad4b2f414d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/client.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/client.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-33578ce7cc71162b - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ad6ce091cb7affa7 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-c1396dc4cc8f6eb2 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-17975ac728393e97 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-2a0fc66de38c6dfb - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-64deca042c1c536c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-598edde46c531312 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-8166e3eccaee38e0 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-1dd35f451d46667c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a81bdf47bc53ae51 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a4a53401897d22ed - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-2a8943e807a98c78 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ed8e94866f63fc7c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-2a4ede84b157adc4 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-17672e5a24b4756a - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-fef7662fbc124521 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-fa4474322cc5fb77 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/stream.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/stream.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-807c172f10dff6ed - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/stream.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/stream.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-9d9124cdf37c3ab8 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/stream.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/stream.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-7f0ec0434698ba44 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/prepay.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/prepay.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-e696125507beedb4 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/prepay.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/prepay.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-fce12a07deb1fe15 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/idl.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/idl.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-53a5ea792a0502a9 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/idl.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/idl.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-bf3bdb20e70b6b7c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/idl.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/idl.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html





== Dependencies (4 findings)


=== OSVM-001 - Update available: rust

*Severity:* Medium
*Category:* Dependencies

*CVSS Score:* 5

*Description:*
An update is available for rust

*Impact:*
General security concern requiring assessment

*Recommendation:*
Run system updates




*References:*

- https://rustsec.org/

- https://docs.rs/cargo-audit/




=== OSVM-100 - Dependency vulnerability scanning unavailable

*Severity:* Low
*Category:* Dependencies
*CWE ID:* CWE-1104
*CVSS Score:* 2

*Description:*
cargo-audit is not installed or failed to run, dependency vulnerabilities cannot be checked

*Impact:*
Unknown vulnerabilities in dependencies may exist

*Recommendation:*
Install cargo-audit with 'cargo install cargo-audit' and run regular dependency scans




*References:*

- https://crates.io/crates/cargo-audit

- https://rustsec.org/




=== OSVM-f67786cb8b5fbbd8 - External path dependency: aeamcp-common

*Severity:* Low
*Category:* Dependencies
*CWE ID:* CWE-426
*CVSS Score:* 3

*Description:*
Dependency 'aeamcp-common' references path outside project: ../common

*Impact:*
External path dependencies may not be version controlled

*Recommendation:*
Consider using published crate for dependency 'aeamcp-common'

*Code Location:* Cargo.toml


*References:*

- https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html#specifying-path-dependencies




=== OSVM-5a20771d051991ed - External path dependency: aeamcp-common

*Severity:* Low
*Category:* Dependencies
*CWE ID:* CWE-426
*CVSS Score:* 3

*Description:*
Dependency 'aeamcp-common' references path outside project: ../common

*Impact:*
External path dependencies may not be version controlled

*Recommendation:*
Consider using published crate for dependency 'aeamcp-common'

*Code Location:* Cargo.toml


*References:*

- https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html#specifying-path-dependencies





== Error Handling (11 findings)


=== OSVM-357a524937a7a96e - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/tests.rs contains 34 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/tests.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-1fb26bcbee65ad1f - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains 13 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-29bccf5a6fcb66cc - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/token_integration_test.rs contains 9 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/token_integration_test.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-9ba8b3894f18f42b - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains 46 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-b88a81885662e416 - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs contains 12 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/instruction.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-1c49b3ed492dfbbf - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs contains 12 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/events.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-fa42648e32dadc9a - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/serialization.rs contains 6 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/serialization.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-964b6a02aff455be - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains 13 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-800f18d5a10ed37c - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains 16 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-056f6f4e8d9beb2e - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/stream.rs contains 10 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/stream.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-ab4ff760bc23559c - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/idl.rs contains 7 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/idl.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html





== Memory Safety (1 findings)


=== OSVM-503c54cf393976ca - Unsafe code block detected

*Severity:* Medium
*Category:* Memory Safety
*CWE ID:* CWE-119
*CVSS Score:* 5.5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/idl.rs contains unsafe code blocks that bypass Rust's memory safety guarantees at line 1

*Impact:*
Potential memory safety violations and buffer overflows

*Recommendation:*
Review unsafe code blocks carefully, ensure proper bounds checking and memory management

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/idl.rs


*References:*

- https://doc.rust-lang.org/book/ch19-01-unsafe-rust.html

- https://cwe.mitre.org/data/definitions/119.html





== Network Security (13 findings)


=== OSVM-NET-011f7f0a4cebcf83 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/validation.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/validation.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-16aac154b12e840c - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/validation.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/validation.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-15be331d6a00da84 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/validation.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/validation.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-9a73de6102605711 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-a2a7255234a2181f - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-b32640b3f1d58c9e - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-0a35d4b01de84c47 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-67272fbadaf93cd0 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-2633ca3a5419a095 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-cbdac532aef4649a - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/agent/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/agent/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-d573c3127231d61f - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/agent/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/agent/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-c5b2319a83393bd8 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/agent/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/agent/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-f2f5d5741c891133 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/agent/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/agent/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/





== Security (169 findings)


=== OSVM-101 - Dependency lock file present

*Severity:* Info
*Category:* Security



*Description:*
Project uses Cargo.lock for reproducible builds

*Impact:*
Good practice: Lock files ensure reproducible builds and prevent supply chain attacks

*Recommendation:*
Keep Cargo.lock in version control for reproducible builds

*Code Location:* Cargo.lock


*References:*

- https://doc.rust-lang.org/cargo/guide/cargo-toml-vs-cargo-lock.html




=== OSVM-102 - Comprehensive testing infrastructure

*Severity:* Info
*Category:* Security



*Description:*
Project includes testing infrastructure

*Impact:*
Good practice: Comprehensive testing reduces security vulnerabilities

*Recommendation:*
Continue maintaining comprehensive test coverage

*Code Location:* tests/


*References:*

- https://doc.rust-lang.org/book/ch11-00-testing.html




=== OSVM-103 - Project documentation present

*Severity:* Info
*Category:* Security



*Description:*
Project includes comprehensive documentation

*Impact:*
Good practice: Good documentation helps users understand security implications

*Recommendation:*
Keep documentation up to date with security considerations

*Code Location:* README.md


*References:*

- https://owasp.org/www-project-application-security-verification-standard/




=== OSVM-104 - Automated CI/CD pipeline

*Severity:* Info
*Category:* Security



*Description:*
Project uses automated CI/CD with GitHub Actions

*Impact:*
Good practice: Automated CI/CD improves security through consistent builds and testing

*Recommendation:*
Continue using automated CI/CD for security and quality assurance

*Code Location:* .github/workflows/


*References:*

- https://owasp.org/www-project-devsecops-toolkit/




=== OSVM-105 - Comprehensive .gitignore configuration

*Severity:* Info
*Category:* Security



*Description:*
Project properly excludes sensitive files from version control

*Impact:*
Good practice: Proper .gitignore prevents accidental secret commits

*Recommendation:*
Continue maintaining comprehensive .gitignore patterns

*Code Location:* .gitignore


*References:*

- https://git-scm.com/docs/gitignore




=== OSVM-106 - Security documentation present

*Severity:* Info
*Category:* Security



*Description:*
Project includes security-related documentation: rust_security_audit_2025.pdf

*Impact:*
Good practice: Security documentation helps maintain secure development practices

*Recommendation:*
Keep security documentation up to date

*Code Location:* rust_security_audit_2025.pdf


*References:*

- https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/




=== OSVM-107 - Professional project structure: tests directory

*Severity:* Info
*Category:* Security



*Description:*
Project includes tests directory for comprehensive development

*Impact:*
Good practice: Complete project structure supports secure development lifecycle

*Recommendation:*
Continue maintaining professional project organization

*Code Location:* tests/


*References:*

- https://doc.rust-lang.org/cargo/guide/project-layout.html




=== OSVM-108 - Professional project structure: docs directory

*Severity:* Info
*Category:* Security



*Description:*
Project includes docs directory for comprehensive development

*Impact:*
Good practice: Complete project structure supports secure development lifecycle

*Recommendation:*
Continue maintaining professional project organization

*Code Location:* docs/


*References:*

- https://doc.rust-lang.org/cargo/guide/project-layout.html




=== OSVM-109 - Explicit dependency versioning

*Severity:* Info
*Category:* Security



*Description:*
Project explicitly versions 9 dependencies

*Impact:*
Good practice: Explicit versioning prevents supply chain attacks and ensures reproducible builds

*Recommendation:*
Continue explicitly versioning all dependencies

*Code Location:* Cargo.toml


*References:*

- https://doc.rust-lang.org/cargo/reference/specifying-dependencies.html




=== OSVM-110 - Security best practice indicator #1

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-111 - Security best practice indicator #2

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-112 - Security best practice indicator #3

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-113 - Security best practice indicator #4

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-114 - Security best practice indicator #5

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-115 - Security best practice indicator #6

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-116 - Security best practice indicator #7

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-117 - Security best practice indicator #8

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-118 - Security best practice indicator #9

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-119 - Security best practice indicator #10

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-120 - Security best practice indicator #11

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-121 - Security best practice indicator #12

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-122 - Security best practice indicator #13

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-123 - Security best practice indicator #14

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-124 - Security best practice indicator #15

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-125 - Security best practice indicator #16

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-126 - Security best practice indicator #17

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-127 - Security best practice indicator #18

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-128 - Security best practice indicator #19

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-129 - Security best practice indicator #20

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-130 - Security best practice indicator #21

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-131 - Security best practice indicator #22

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-132 - Security best practice indicator #23

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-133 - Security best practice indicator #24

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-134 - Security best practice indicator #25

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-135 - Security best practice indicator #26

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-136 - Security best practice indicator #27

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-137 - Security best practice indicator #28

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-138 - Security best practice indicator #29

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-139 - Security best practice indicator #30

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-140 - Security best practice indicator #31

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-141 - Security best practice indicator #32

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-142 - Security best practice indicator #33

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-143 - Security best practice indicator #34

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-144 - Security best practice indicator #35

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-145 - Security best practice indicator #36

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-146 - Security best practice indicator #37

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-147 - Security best practice indicator #38

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-148 - Security best practice indicator #39

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-149 - Security best practice indicator #40

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-150 - Security best practice indicator #41

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-151 - Security best practice indicator #42

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-152 - Security best practice indicator #43

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-153 - Security best practice indicator #44

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-154 - Security best practice indicator #45

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-155 - Security best practice indicator #46

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-156 - Security best practice indicator #47

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-157 - Security best practice indicator #48

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-158 - Security best practice indicator #49

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-159 - Security best practice indicator #50

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-160 - Security best practice indicator #51

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-161 - Security best practice indicator #52

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-162 - Security best practice indicator #53

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-163 - Security best practice indicator #54

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-164 - Security best practice indicator #55

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-165 - Security best practice indicator #56

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-166 - Security best practice indicator #57

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-167 - Security best practice indicator #58

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-168 - Security best practice indicator #59

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-169 - Security best practice indicator #60

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-170 - Security best practice indicator #61

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-171 - Security best practice indicator #62

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-172 - Security best practice indicator #63

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-173 - Security best practice indicator #64

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-174 - Security best practice indicator #65

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-175 - Security best practice indicator #66

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-176 - Security best practice indicator #67

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-177 - Security best practice indicator #68

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-178 - Security best practice indicator #69

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-179 - Security best practice indicator #70

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-180 - Security best practice indicator #71

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-181 - Security best practice indicator #72

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-182 - Security best practice indicator #73

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-183 - Security best practice indicator #74

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-184 - Security best practice indicator #75

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-185 - Security best practice indicator #76

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-186 - Security best practice indicator #77

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-187 - Security best practice indicator #78

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-188 - Security best practice indicator #79

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-189 - Security best practice indicator #80

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-190 - Security best practice indicator #81

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-191 - Security best practice indicator #82

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-192 - Security best practice indicator #83

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-193 - Security best practice indicator #84

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-194 - Security best practice indicator #85

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-195 - Security best practice indicator #86

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-196 - Security best practice indicator #87

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-197 - Security best practice indicator #88

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-198 - Security best practice indicator #89

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-199 - Security best practice indicator #90

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-200 - Security best practice indicator #91

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-201 - Security best practice indicator #92

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-202 - Security best practice indicator #93

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-203 - Security best practice indicator #94

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-204 - Security best practice indicator #95

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-205 - Security best practice indicator #96

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-206 - Security best practice indicator #97

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-207 - Security best practice indicator #98

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-208 - Security best practice indicator #99

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-209 - Security best practice indicator #100

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-210 - Security best practice indicator #101

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-211 - Security best practice indicator #102

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-212 - Security best practice indicator #103

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-213 - Security best practice indicator #104

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-214 - Security best practice indicator #105

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-215 - Security best practice indicator #106

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-216 - Security best practice indicator #107

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-217 - Security best practice indicator #108

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-218 - Security best practice indicator #109

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-219 - Security best practice indicator #110

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-220 - Security best practice indicator #111

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-221 - Security best practice indicator #112

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-222 - Security best practice indicator #113

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-223 - Security best practice indicator #114

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-224 - Security best practice indicator #115

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-225 - Security best practice indicator #116

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-226 - Security best practice indicator #117

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-227 - Security best practice indicator #118

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-228 - Security best practice indicator #119

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-229 - Security best practice indicator #120

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-230 - Security best practice indicator #121

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-231 - Security best practice indicator #122

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-232 - Security best practice indicator #123

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-233 - Security best practice indicator #124

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-234 - Security best practice indicator #125

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-235 - Security best practice indicator #126

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-236 - Security best practice indicator #127

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-237 - Security best practice indicator #128

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-238 - Security best practice indicator #129

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-239 - Security best practice indicator #130

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-240 - Security best practice indicator #131

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-241 - Security best practice indicator #132

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-242 - Security best practice indicator #133

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-243 - Security best practice indicator #134

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-244 - Security best practice indicator #135

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-245 - Security best practice indicator #136

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-246 - Security best practice indicator #137

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-247 - Security best practice indicator #138

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-248 - Security best practice indicator #139

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-249 - Security best practice indicator #140

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-250 - Security best practice indicator #141

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-251 - Security best practice indicator #142

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-252 - Security best practice indicator #143

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-253 - Security best practice indicator #144

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-254 - Security best practice indicator #145

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-255 - Security best practice indicator #146

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-256 - Security best practice indicator #147

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-257 - Security best practice indicator #148

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-258 - Security best practice indicator #149

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-259 - Security best practice indicator #150

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-260 - Security best practice indicator #151

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-261 - Security best practice indicator #152

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-262 - Security best practice indicator #153

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-263 - Security best practice indicator #154

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-264 - Security best practice indicator #155

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-265 - Security best practice indicator #156

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-266 - Security best practice indicator #157

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-267 - Security best practice indicator #158

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-268 - Security best practice indicator #159

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code




=== OSVM-269 - Security best practice indicator #160

*Severity:* Info
*Category:* Security



*Description:*
Project demonstrates adherence to Rust security best practices

*Impact:*
Good practice: Consistent application of security best practices throughout codebase

*Recommendation:*
Continue following Rust security best practices and guidelines

*Code Location:* Project-wide


*References:*

- https://www.rust-lang.org/governance/wgs/wg-secure-code





== Solana Authority Management (3 findings)


=== OSVM-SOL-1c1e3df8f3c4ed32 - Unsafe authority transfer pattern

*Severity:* High
*Category:* Solana Authority Management
*CWE ID:* CWE-269
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains authority transfer operations without two-step verification

*Impact:*
Authority could be transferred to incorrect or malicious addresses

*Recommendation:*
Implement two-step authority transfer with pending/accept pattern and proper validation

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html#authority-transfer

- https://docs.solana.com/developing/programming-model/accounts#ownership




=== OSVM-SOL-b5dad3e778db551c - Unsafe authority transfer pattern

*Severity:* High
*Category:* Solana Authority Management
*CWE ID:* CWE-269
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/utils.rs contains authority transfer operations without two-step verification

*Impact:*
Authority could be transferred to incorrect or malicious addresses

*Recommendation:*
Implement two-step authority transfer with pending/accept pattern and proper validation

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/utils.rs


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html#authority-transfer

- https://docs.solana.com/developing/programming-model/accounts#ownership




=== OSVM-SOL-7ffb2700e4763b49 - Unsafe authority transfer pattern

*Severity:* High
*Category:* Solana Authority Management
*CWE ID:* CWE-269
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains authority transfer operations without two-step verification

*Impact:*
Authority could be transferred to incorrect or malicious addresses

*Recommendation:*
Implement two-step authority transfer with pending/accept pattern and proper validation

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html#authority-transfer

- https://docs.solana.com/developing/programming-model/accounts#ownership





== Solana CPI Safety (3 findings)


=== OSVM-SOL-c550f27a95a8bd83 - Missing account reload after CPI

*Severity:* High
*Category:* Solana CPI Safety
*CWE ID:* CWE-362
*CVSS Score:* 7

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains CPI operations without subsequent account reloading

*Impact:*
Account data may be stale after CPI, leading to incorrect program behavior and potential race conditions

*Recommendation:*
Always reload account data after CPI operations to ensure data consistency and prevent race conditions. Use account.reload() or fetch fresh account data.

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html#account-reloading

- https://docs.solana.com/developing/programming-model/calling-between-programs#reentrancy




=== OSVM-SOL-11696b97554a8a21 - Missing account reload after CPI

*Severity:* High
*Category:* Solana CPI Safety
*CWE ID:* CWE-362
*CVSS Score:* 7

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs contains CPI operations without subsequent account reloading

*Impact:*
Account data may be stale after CPI, leading to incorrect program behavior and potential race conditions

*Recommendation:*
Always reload account data after CPI operations to ensure data consistency and prevent race conditions. Use account.reload() or fetch fresh account data.

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html#account-reloading

- https://docs.solana.com/developing/programming-model/calling-between-programs#reentrancy




=== OSVM-SOL-7e58531497e3ed3e - Missing account reload after CPI

*Severity:* High
*Category:* Solana CPI Safety
*CWE ID:* CWE-362
*CVSS Score:* 7

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains CPI operations without subsequent account reloading

*Impact:*
Account data may be stale after CPI, leading to incorrect program behavior and potential race conditions

*Recommendation:*
Always reload account data after CPI operations to ensure data consistency and prevent race conditions. Use account.reload() or fetch fresh account data.

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html#account-reloading

- https://docs.solana.com/developing/programming-model/calling-between-programs#reentrancy





== Solana Security (425 findings)


=== OSVM-SOL-22647c1066258c3d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/tests.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/tests.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-e3b84458cc53c34d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/tests.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754087079/programs/svmai-token/src/tests.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-ae08072a848d41ea - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-06ba9a271b924d53 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-94599ebcefcf55db - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-73da6a2b9ce8c954 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-90669a9291d38fe9 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-699421341c24b0e1 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-a1cfaee1c9abc87c - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-2d3ae748e8d7e943 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-de0c78158859474e - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-af99eabba8a9aede - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-ca003b4ea5756aeb - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-99c166a5e31fd831 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-34e4acca938ffb0f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-ecfd52319cab932b - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-025b701db0d3873a - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-080b0a8328c4b896 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-641c6458a29ca902 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-5f69e0a4c25015a3 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c861f4ce4172ab7f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-2906d16753bad05b - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-2876b8178177fd38 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-b3d2b651fce6f654 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-b5c89f592fed04e2 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-29261f6d96cc2203 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-6f85342a01e885eb - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-333e6aa7c5f69c47 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-0c605012aa6f8e65 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-0a186055b981c6a7 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-dfff3853aef3dfa2 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-f90004bf3da8d69b - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-477462b88fe30018 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-a83d1c0348d14e21 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-38fbca06fa616883 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-447bce8ccecd07fc - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-3f5efa87584c2f73 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-0f8fb12924e0b337 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-d3d8ddb60000fc84 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-e379b2e1457ac015 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-352b8ec7683d3bea - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7e3787531e52f225 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-3ed5569b2aa7967d - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-f6a7cb616f03cf12 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-18e0e081c2f8e445 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-24e3d8c2463e73db - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-b8f414f140389d6a - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-b6da33e4c47d8166 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-4dae995a9225ad11 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-543d745237f4af06 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-f82ecd451b074f24 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-306a3902cdba926b - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-a28025488b35473e - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-b82dcb151f16ab70 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-10343ba5a5731b26 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-300384390a2259f8 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/token_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/token_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-dfdec39236b5c2a9 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/token_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/token_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-e08e19415812a8ec - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-c837586bdc9df4bd - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-520c041726957019 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-b15126cfad825fc2 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-ce56feb198324be0 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-da2634e18948c50c - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-fce5367e4e923e28 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7a131d98f360536e - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c9711eef96047022 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-09584935d5bde087 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-d84b5f5e61b32acb - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-1f3f5b5401414786 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-5c30a1399ed4d9fe - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8b9aa627e1696b2d - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-5f2597e7eb1b2032 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-967f875254bdab82 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-b82b495f947345a5 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-971bcba0bb851ed6 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-53d153b511f8f452 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-55c107fe1d6510d5 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-919b1deb32812bd7 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-0440b709d916a008 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-ab7e1d8855ead60e - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-c255615471f074ab - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-3ba128d0841a6269 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-6682827ab58816d2 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-7a31589a343c4156 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-63a98dfc1965681b - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-1753deb13a7904bd - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-b55bb1c696d0ca5c - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-3a150cec2c14ffb7 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-dc5079f89cca9b15 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-cdeef3310e751b00 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-526725cb3a8d9ba9 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-e41e2f706f74b097 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-ab6e36a17e61c101 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-61567799b8840014 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-1ff6f1326d71fc2c - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7803bdacd34faf78 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c9a6a82627478021 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-93ce6c84b268d327 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3542f79b1fb5c56b - Missing program ID validation before CPI

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-20
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Cross-Program Invocation without program ID validation at line 1

*Impact:*
Arbitrary program execution vulnerability - attacker can invoke malicious programs

*Recommendation:*
Always validate the program ID before making cross-program invocations

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/calling-between-programs

- https://github.com/coral-xyz/sealevel-attacks/tree/master/programs/0-arbitrary-cpi




=== OSVM-SOL-c3abc01abf302ceb - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-a710525a22a46418 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-6b7ea1cb95a4251a - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-27f3e56319d8dbad - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-a20159afb9535ad1 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8785b6fe978683b2 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-b16123c71f905ded - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6fcbd76637d25590 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-dfece1beb9c36620 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-4361f9add3f41549 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-5cc5d31fe15fbb3a - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-39f9bd4464dbdc20 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-f23baa676d93c7ad - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8c87ba35314a5dcb - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c5dfe2677bd71367 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-a48f4b245ae00ae2 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-3e3525cb217f4d36 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-580dc0aeb72d8923 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-115d02eca0f1fedc - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8b8dd4bc38c1f505 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-231c551952b7066d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3797523475655a9f - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-2ee3c4211a5b7cc9 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-83da900fc6a77ca1 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-87856f98c6cb52bf - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3801bae99b57cb27 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c3a22acf6bfc23d1 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8b9cb9285f2511bc - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-400f7e6f83d42034 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-1b94a231bc77ffc9 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-4af55a86c71bbffc - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-aadd23db79eab6f8 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-140d0242eaa5384b - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-cda7c6db2c715ea3 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-10865e0d09d73f7f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-92c5c991b143593f - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-3ae36dd45b901f0f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7661459da9ab334d - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-25f1ff2e683fce65 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-1adf516415f7c817 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-1df07bd4e15814e2 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-0167d6a3f016a7d2 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-68dd712d0b2cac5a - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-f2b7edf2a6f0d9f5 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-4272cf12b5364339 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7645d9e918334175 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-f2ade064762914ce - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-9dd67b880de4ae44 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-ec33d3f5b5c7e2dc - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-9939109b675863f8 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-e26de77a379063a7 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-37dc8696217051bd - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-92ab0108b3594f3e - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-04922118273c3d6a - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-d36c96db4ecea4ed - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-fb7a9afa1f4f4178 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-336c5f9a7e2754a3 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-13b4fbe6e8cbc222 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-2a3c5deeb5e50200 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-f1a1b50c20bc77ed - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-a1f3521a1a9428e9 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-94df0e2078f291b7 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-6802dd5c85981dc1 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-36ef36b4a622b150 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-e43c5b0b17dcc715 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-a1d09d31179a8539 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-dec8dd0a879b7bcc - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-139fdc056a198fd5 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-3ce8f78fdfc3f1b7 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-5673b6d9425db711 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-23c84a37b698880e - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6aadf71e1f7e4428 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-8feb2b86eaa63c18 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-494d26f85edb61b3 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-211c80e2cee85b8d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-4c6edc4432c44d7e - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-1c155332c4225d40 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8c398c9ae35327f8 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-6c6bedf7146d426c - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-4918a9b88f01bdea - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-5f58511ff28bea52 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-f8029f1ca84bf94b - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-fda31c9168516c91 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-1970d52240f1d6db - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-6e669768f45640f7 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3b65f613849a8aeb - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-0fe6fd0ae05c4183 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-70e78b8a5aa03cde - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-1da3fb33dafbe068 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-695d36cbabc69da1 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-597e7f4b291c4b59 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-75bf4c6685748b4a - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-8347c392adbd3add - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-fa821094a3f3dd47 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-45d8ee78f89c1767 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-73c8957e90d35037 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-53bfac54d7b9fa92 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-582cebbd31f21f5f - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-98f1088439aa413e - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-beaff77e84c9cd38 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-426edaad22b4aca3 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-4e32f4fa623405cf - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c7d0122db3d2d476 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7ecb5c9d133d72a2 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754087079/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-a7a3fa7117777788 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/utils.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/utils.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-f6aecfba4e20b854 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/utils.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/utils.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-98d2577298c2e10d - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs contains what appears to be a hardcoded base58-encoded public key at line 1: 'Cpzvdx6pppc9'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-77649ef6067150cc - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs contains what appears to be a hardcoded base58-encoded public key at line 1: 'A2AMPLyncKHw'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-ef72fa92e67d2049 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-76efda96922f9bb8 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/constants.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-f27d2206a8a19323 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-4a4dbb7c0467563a - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-35a40e1e08c94142 - Missing program ID validation before CPI

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-20
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs contains Cross-Program Invocation without program ID validation at line 1

*Impact:*
Arbitrary program execution vulnerability - attacker can invoke malicious programs

*Recommendation:*
Always validate the program ID before making cross-program invocations

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/calling-between-programs

- https://github.com/coral-xyz/sealevel-attacks/tree/master/programs/0-arbitrary-cpi




=== OSVM-SOL-61475b7f73c10835 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-5874a8b1953e51fb - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-b21c162ac59bf7f5 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-ebda2bc3a2fa7daf - Missing program ID validation before CPI

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-20
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs contains Cross-Program Invocation without program ID validation at line 1

*Impact:*
Arbitrary program execution vulnerability - attacker can invoke malicious programs

*Recommendation:*
Always validate the program ID before making cross-program invocations

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/calling-between-programs

- https://github.com/coral-xyz/sealevel-attacks/tree/master/programs/0-arbitrary-cpi




=== OSVM-SOL-b0ac188320766eab - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* common:common//tmp/osvm-audit-1754087079/programs/common/src/token_utils.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-9004025649941153 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-2f60e4912fb60db7 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-7e9a15d26a3aba88 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-203f32bdf012d135 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-70adbfe8352481a6 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-4483677cc419f034 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-69ac7bac8de7457d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-c98f552764df88fc - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-1190b4284f2543b1 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-aa106398cff0bf52 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-81b4ccf7e7b5d012 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-2b1e75f2f1c803ea - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-4ed04cf5350216c6 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-9fc6d391aaa0df2a - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-f2bcda1958f3838d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-42d30e557b4e5732 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-533c9e05e54a3065 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-18598954c6b5c8aa - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-43dc2bbe48ed4170 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-10dbfad9e6d5d48b - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-3fa6ede38c90f91d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-31de8e28846004f2 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-4d3f5a661309763a - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-160ebe7d20612402 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-2942e729013a676f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-27a1d2bb01fa5285 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-40019d71b18eae5b - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-2338ea8120d29cd3 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-426c6d19d29b1740 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3827a55b97bfbfbf - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-bc4cb6b68ff9d2a6 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-9f974605564bb228 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-aedf485c984a804f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3d03bc7cfd08f628 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-2d84a6387ecf04d4 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-691a8aeb2e819ca3 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-535b2106ff5353c7 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8bf4eb7619a7b749 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-9486b956569362f5 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-5a4821443fadc27d - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-bc0f44521b168752 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-6969687636edd456 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-58f06a7080e2065f - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-45d8b85dd830ff8b - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-9e1d789942f2dc84 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-edded3a9e1a032c6 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-2e02be110c53c2e9 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-a93e9c03bf5ba774 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-671d1a1dc0c65d06 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-dff9fdbad11fdf22 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-38296629714e9e77 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-0a071580154fc71d - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-d5a349a6c89dee11 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-2ab8f49237adc875 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-e433a324ddbd7d73 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-4104095269ae3ed2 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-9071288bb81074c3 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-0ca50b8c68e4550d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-2947e331fd400f10 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-a54f9da62a5f673a - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-c9a095517b3ceefb - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c76fe573517c5afa - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3ed51daa562c5280 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-8647d4c853d6deae - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-095013e116d8c8d8 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-eec953d7625d909b - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-d871e3f7b0453f4c - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-e3bf5afeee576ed2 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-d8729264ca667507 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-602a5caceb325f50 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-43ed0eac0a5b84ef - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6e6bf21bb595a51b - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-ce1c64e2627b7644 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7dba23af9092559c - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-19f4aac7391dac76 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3606d2032e309d07 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-4a87ba060108311d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-c6de42a7f47bb140 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-d54c857c2be02f47 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-38511d421ce01075 - Missing program ID validation before CPI

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-20
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Cross-Program Invocation without program ID validation at line 1

*Impact:*
Arbitrary program execution vulnerability - attacker can invoke malicious programs

*Recommendation:*
Always validate the program ID before making cross-program invocations

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/calling-between-programs

- https://github.com/coral-xyz/sealevel-attacks/tree/master/programs/0-arbitrary-cpi




=== OSVM-SOL-20e9979724a4abc3 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-ff176a9b407d8d26 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-eed75045486a916b - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6174080980c1368e - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-6d0761f7446a4cb0 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-cead8194028e9954 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-90524ade9853c13b - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-86ffb73679f94eb4 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-24646f9ac808c079 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-c686cfd3ba5d3c35 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-771a66f857d409e9 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-b6046783e3c88548 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-2465d92f2e06477c - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-bf28aa7dd20d734a - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-5090680a54e2c28d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-dcc126107e91048d - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c890668ae17cc50b - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8f535e7c6f268437 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-6044d8374972b114 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-04778eb896604f21 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-3d0baec953e17fa6 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-01c76a642e83d12d - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-ded9a6fc84c97dc7 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-32980507c792a25d - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-943c3ed6c42cb04e - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7145e61013d0e61c - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-5ec80ad5ffd6a12e - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-c9db01c040f73c2b - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-79356f7e9d064f14 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6c3858cab363d489 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-ab1d7468b5dc03ba - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-2f514f6f02f6b2fe - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-69140f5ca8d89ef7 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8c1fc1da7bf05dfc - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-0098893324d0095f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6db6e7bebaee0333 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-3474b5bd88fb3ae7 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-5e914601ce72dbf2 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-e6f63c8f4a7c3832 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-599b82d0fb6632c6 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-5d26d4aaa6fc3bb2 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-58e4599a9ddd292e - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-16838926972128b0 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6b91c6e208ef6635 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-438b71358aafeeaf - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-33f8818fc7d7e560 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-582bcad9f86b709f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-db1c1f9abd5789d9 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-e9746bdb00bca891 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-145038f62e87a813 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-935d5cff4be0a0f8 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-61f9b6a7fefba51c - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-2c324a225574dffa - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6ded5b277b64c6ca - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-7f6bf873af7e0b8b - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-cfe28c06e185e375 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-ed83384d5e0287b2 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-ed9934a47b1975ff - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-d4d8badf6390f70b - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-5b7f17db3032ff7a - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-1779f073b7ff76fa - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-0a1df46573a4802f - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-0fe7553133380b00 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-df2cd730c9d56959 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-e144aae3969b2f9f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-c27bf01bf9f051d2 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-e2b1385be05af604 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-246f650d789891b4 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-3e7db47b254dac91 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7f685cdb458d1bbe - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-d56efd6cd745661b - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-bb95ef4f1b68799c - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-1c35e39769ff8f40 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-82b364d9e8d21d77 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-6f4429af3c22a43d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-53eca2971ef51833 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-ad002526512781e7 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-109adba13a5ff83c - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-b76bf1f82ba905e5 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-b4627929ab0d136c - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-9d53973cfb8e9e86 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3ba277e5e2dba50f - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-78c31fecf83aa865 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-5070ef2617d3bbf2 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-3bd1c61a60f3d0ad - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-fead212f817bb2ea - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-e7167644b574fd98 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-bc14a94ecd3d9d61 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-28237730a9f997fd - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-a98bee0efc432ade - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c6c674cea754e6b2 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-d119036bbd87a022 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-e48b9e453919a4b8 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-07e19259ddb176f4 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-6a52efc0eb9d08f9 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-b196af398f7b4ac4 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-23634b544dc0fe84 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-0362587c8262f322 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754087079/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-87ff8fa6b578e371 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-db08bdc26a51b929 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/mcp/mod.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-3680f1fd1aae21fc - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/agent/mod.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/agent/mod.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-4697fdbf9d79758a - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/agent/mod.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/agent/mod.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-250b4c32779c1dc1 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/client.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/client.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-b4d2ead7818010b2 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/client.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/client.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-f40743e412c684a2 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/client.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/client.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6dcb611815db520f - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/client.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/client.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-825167d23a89f703 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/client.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/client.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-610e68862577f7d7 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/client.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/client.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-325f28d4849ec546 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs contains what appears to be a hardcoded base58-encoded public key at line 1: 'Cpzvdx6pppc9'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-fa5b550c6045da39 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs contains what appears to be a hardcoded base58-encoded public key at line 1: 'A2AMPLyncKHw'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/common.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-1db9c1ec7a8aa875 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-142a9a59ae09bd9d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8e03c0d56a692f52 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-66d7c658efe32548 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-47170aa2a87a93c7 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-0536b9211695d884 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-f6b3c79135455038 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-f14563e6384d7065 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-b32a83ce0e94994a - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-0b464651ef536328 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-4cf8cceda0fdf911 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/stream.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/stream.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-93f370ad94eb79e7 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/stream.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/stream.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-2bc62a582133535e - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/stream.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/stream.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-1ea1d6a605b226c9 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/stream.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/stream.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-f144e101b7c4d88c - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/prepay.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/prepay.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-5e59d0c347f23172 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/prepay.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/prepay.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-c39a6044160aeb97 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/prepay.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/prepay.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-feba161abb53f23f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754087079/rust/src/payments/prepay.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754087079/rust/src/payments/prepay.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html






= Security Recommendations


1. Implement regular security audits and penetration testing


2. Keep all dependencies up to date and monitor for security advisories


3. Use proper secret management and avoid hardcoding sensitive information


4. Implement comprehensive logging and monitoring


5. Follow the principle of least privilege for all system components



= Compliance Notes


- This audit report follows industry security standards and best practices

- Findings are categorized using the Common Weakness Enumeration (CWE) framework

- CVSS scores are provided where applicable to help prioritize remediation efforts

- Critical vulnerabilities require immediate attention and remediation

- Regular security assessments are recommended to maintain security posture


= Statistics

#table(
  columns: (auto, auto),
  stroke: none,
  [*Metric*], [*Value*],
  [Total Findings], [793],
  [Findings with CWE], [622],
  [Findings with CVSS], [793],
  [Findings with Location], [790],
  [Unique Categories], [10],
  [Average CVSS Score], [6.1],
  [Coverage Percentage], [99.6%],
)

= Conclusion

This security audit provides a comprehensive assessment of the OSVM CLI application's security posture. All identified findings should be addressed according to their severity level, with critical and high-severity issues taking priority.


#text(fill: red, weight: "bold")[
  ⚠️ CRITICAL: 197 critical findings require immediate remediation.
]



#text(fill: orange, weight: "bold")[
  ⚠️ HIGH: 344 high-severity findings should be addressed promptly.
]


Regular security assessments and continuous monitoring are recommended to maintain a strong security stance.

#align(center)[
  #text(size: 10pt, style: "italic")[
    Generated by OSVM Security Audit System
    
    End of Report
  ]
]