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
    Generated: 2025-08-02 00:48:56 UTC
    
    Version: 0.4.5
    
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


=== OSVM-CRYPTO-2433f10e93501ec1 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a06e92c7c5f1e490 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ec8a66ca807f9578 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-27b9e19d4b72b54c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-58a24a2b43373231 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-2c13d196560a38a9 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ea8571e0d3477bb7 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-c7cd4c7e50973fbb - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-64139c5adf5c5ad0 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ead551e1aade7919 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-fb6aa863536f0bc8 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-55d4128e1d773e1b - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-22f3812743acb3c2 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-93892da530e3dbb4 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-dbfc37bb568d0a92 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ebf18fc3a91bce01 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-e761344100c5903d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-486b39403e0a4622 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d906f9128ecea203 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-50d936243f81344b - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-95e54fb3f25a59c8 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/token_integration_test.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/token_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-644f54263cb39db3 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-49a7df7aaa2d667b - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-54aa07adab5a18cc - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-f53cf588032784a1 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-4afc21f491652a23 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-85e6b5f4713c093f - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-b291f4123ffe07a8 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-b76c754e9e022787 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-3c4aaf0063133d13 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-441d21f75e9bcfec - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-10cc9bae879df62f - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-fc143ef9509b30d8 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-fc54ba149ba3fe2a - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-824462d241100392 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-9b103cd92a5c1a83 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-0e7451446f2671ca - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-63a2f6e25b3d0e75 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-79b499d69b1faadd - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-1fc64184d41b3056 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-23287dbc2932fe4f - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-7b6c2392763f8e10 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-1a1ad4b684ecddf8 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-eee20f3c1608f511 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-552983678745b34b - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-87cf706cb429c3f3 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-db8b18c41a6ebc5c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-53bce3fc75cb1e66 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-fc8a7b2abf2177a1 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-dac36301e2bc45e2 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-8ed9aa0ffb3ab23d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-2d8ac4aa9c08ac04 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-0a405be9d314918b - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-899806c976893ec1 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-c9fa17e1949740e1 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-b54989a62d23b765 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-fe839c9edfed6e9c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-028bb288b1350a52 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-93cefcc0cd458be3 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-f47ce1d1e9171347 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-3094c385afb0b095 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d149da150d8e449e - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-dba3c2969620ef5f - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a4899f168e4c44ec - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-173f7c220b5a811f - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a1072ed91f732229 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-b8e645730ff4d15e - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-70751e37bf708599 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-74cce20218e82e93 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-8c4cd2f2fde9e464 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-80b9726e003a2ba3 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-dca68f39fa73cbbc - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-43bd1cc2519f396e - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-7753fdeed89f69e1 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-6516ebce7c6b1476 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-bf550e31b24c02af - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-7cd766b78d242c5c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-3bc2277da9d79cfd - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-8ddea4ab7b664a3a - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-823a9b8662e79c9e - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-3299d85b0690b9c5 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-701a729df0257f9f - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-bc4c4fd2790a8cef - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d3ffc6c40f4790ea - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d82d03d790927b1d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-2d8268fa77689716 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-4866a2a71d2e85a2 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a8ae6bec0aeed516 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-9e49578da28ced83 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/token_integration_test.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/token_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-891d6703a7bb81d2 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/token_integration_test.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/token_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-efecc6a47c6f8f21 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-bd3a61a57b424a6f - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-be9396cd98d54e47 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-4cde9fc9325fdc7f - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-271803e0a23787b5 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-df9c54b955844172 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-37c0497754d1904b - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-9291b520ede1ddea - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-54297395b31a2aa5 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-beca5a3e0ef4b54c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-dbc2be230dea4d1c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-481534cf1bab06dd - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-eafe35432fcf1c21 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-7ee4a2648434af08 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-fbefe4a6306c2ae8 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-447e4e17d380756a - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-3a890daa0698dd1b - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-e9c576caa0dae3f5 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-10e1437b06edb759 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-089541d008ff02a4 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-34be4bc4a309e2e2 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-75bd61b6a64d1040 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d842ebf2d1643863 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-11a5ae012f144e6c - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-9eb434e4a2191894 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d4c7823d9916e150 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/instruction.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-87f2458db53983d9 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-3058762d1c17954d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-714bd3e792a8dba3 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-5732212c420d0505 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-0c3f932a1918c79b - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-66eb8f7a22aa097d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-48c3f55ba29c4587 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/state.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/state.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-7bcfc59e805c32aa - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-6539099f2a3b7e49 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-3e7c2754650dbd65 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-04260f2278682ff4 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/events.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/events.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-6cd0a3f4b9bb3110 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-0fe1ecd64b6c4601 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d36b28ccf98b1155 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-9ed66117c848e6ea - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d88bab084b2b9d21 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-fa84d92bc1aa07d5 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/lib.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/lib.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-3e6976f431307075 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/agent/mod.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/agent/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a211494a3f7edc9b - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/client.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/client.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-222e02b0723092d0 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/client.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/client.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-a646086ecf16f892 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/client.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/client.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-744571c0311b81a2 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/client.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/client.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-ac9b85b73fdce755 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/client.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/client.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-900dbb23ca9b8be6 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-6a75e627ecbd40b2 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-4577c63ff19a4bc1 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-92f7dfd83a803862 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-b63fefd416cb281d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-28759abe854d039e - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-9d558b36ef58001f - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-dbe427c9c4e3c365 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-bc6bce3e6384da5b - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-5d452d342686a3c4 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d06a3ed8967ad753 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-9db228dddbcedf7e - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-869a9a716a22ef3d - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-f0ee57a80c40fbbd - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-c49997fdeb32efe5 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-d87905ccbd8413ca - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-90f7e8bf1e290dd7 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/stream.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/stream.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-1e4ecc13f5b6e2dd - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/stream.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/stream.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-aba7fa8843a32f37 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/stream.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/stream.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-4580e77bf93b0623 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/prepay.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/prepay.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-3f621a24fac49af9 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/prepay.rs contains a hardcoded generic_secret at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/prepay.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-edf4d09e12aff3b9 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/idl.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/idl.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-af9e83d584214661 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/idl.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/idl.rs


*References:*

- https://cwe.mitre.org/data/definitions/798.html




=== OSVM-CRYPTO-757f0e545d4dd965 - Hardcoded secret detected

*Severity:* High
*Category:* Cryptography
*CWE ID:* CWE-798
*CVSS Score:* 8

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/idl.rs contains a hardcoded base64_encoded at line 1

*Impact:*
Exposed secrets could lead to unauthorized access

*Recommendation:*
Remove hardcoded secrets and use environment variables or secure key management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/idl.rs


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




=== OSVM-093d0f337075eba7 - External path dependency: aeamcp-common

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




=== OSVM-8455ace6c1c2a85c - External path dependency: aeamcp-common

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


=== OSVM-789bb4fbe50cf476 - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/tests.rs contains 34 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/tests.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-cccf25ec326412d0 - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains 13 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-1f860814303489f1 - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/token_integration_test.rs contains 9 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/token_integration_test.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-3f8b0c2e1e6ce186 - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains 46 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-c0cae02c3a9acb15 - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs contains 12 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/instruction.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-be38ee2e0f72d168 - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs contains 12 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/events.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-032fd8487a225dd6 - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/serialization.rs contains 6 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/serialization.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-387a8576f484d99b - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains 13 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-1544b0fac991f0c7 - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains 16 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-519944f5d6cb0819 - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/stream.rs contains 10 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/stream.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html




=== OSVM-98d19cf4fb6dfa57 - Excessive unwrap/expect usage

*Severity:* Medium
*Category:* Error Handling
*CWE ID:* CWE-248
*CVSS Score:* 4

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/idl.rs contains 7 instances of unwrap/expect which can cause panics

*Impact:*
Application crashes due to unhandled panics, potential denial of service

*Recommendation:*
Replace unwrap/expect with proper error handling using match or if let patterns

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/idl.rs


*References:*

- https://doc.rust-lang.org/book/ch09-00-error-handling.html

- https://cwe.mitre.org/data/definitions/248.html





== Memory Safety (1 findings)


=== OSVM-9d551e6c7053a603 - Unsafe code block detected

*Severity:* Medium
*Category:* Memory Safety
*CWE ID:* CWE-119
*CVSS Score:* 5.5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/idl.rs contains unsafe code blocks that bypass Rust's memory safety guarantees at line 1

*Impact:*
Potential memory safety violations and buffer overflows

*Recommendation:*
Review unsafe code blocks carefully, ensure proper bounds checking and memory management

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/idl.rs


*References:*

- https://doc.rust-lang.org/book/ch19-01-unsafe-rust.html

- https://cwe.mitre.org/data/definitions/119.html





== Network Security (13 findings)


=== OSVM-NET-a0ee23a2c49d6a06 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/validation.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/validation.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-df5c5c61c137dd94 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/validation.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/validation.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-b7ae359c6e5f4a33 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/validation.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/validation.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-978ba12a80a3b951 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-3714ae8afdf514bb - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-644256b265016bb5 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-91dfe8642cee525a - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-e406f695654a15c2 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-ed594778fe54e9b2 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-a6ffd6879a961113 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/agent/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/agent/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-e2d5fb1f880ee896 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/agent/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/agent/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-92f141f8402a9702 - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/agent/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/agent/mod.rs


*References:*

- https://cwe.mitre.org/data/definitions/319.html

- https://owasp.org/Top10/A02_2021-Cryptographic_Failures/




=== OSVM-NET-3ae02220fe1e438f - Insecure HTTP usage detected

*Severity:* Medium
*Category:* Network Security
*CWE ID:* CWE-319
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/agent/mod.rs uses HTTP instead of HTTPS at line 1

*Impact:*
Data transmitted in plain text, susceptible to interception

*Recommendation:*
Use HTTPS for all external network communications

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/agent/mod.rs


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


=== OSVM-SOL-a190be0a60942b53 - Unsafe authority transfer pattern

*Severity:* High
*Category:* Solana Authority Management
*CWE ID:* CWE-269
*CVSS Score:* 8

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains authority transfer operations without two-step verification

*Impact:*
Authority could be transferred to incorrect or malicious addresses

*Recommendation:*
Implement two-step authority transfer with pending/accept pattern and proper validation

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html#authority-transfer

- https://docs.solana.com/developing/programming-model/accounts#ownership




=== OSVM-SOL-fd139254837a78dc - Unsafe authority transfer pattern

*Severity:* High
*Category:* Solana Authority Management
*CWE ID:* CWE-269
*CVSS Score:* 8

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/utils.rs contains authority transfer operations without two-step verification

*Impact:*
Authority could be transferred to incorrect or malicious addresses

*Recommendation:*
Implement two-step authority transfer with pending/accept pattern and proper validation

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/utils.rs


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html#authority-transfer

- https://docs.solana.com/developing/programming-model/accounts#ownership




=== OSVM-SOL-c77eb3f8da426946 - Unsafe authority transfer pattern

*Severity:* High
*Category:* Solana Authority Management
*CWE ID:* CWE-269
*CVSS Score:* 8

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains authority transfer operations without two-step verification

*Impact:*
Authority could be transferred to incorrect or malicious addresses

*Recommendation:*
Implement two-step authority transfer with pending/accept pattern and proper validation

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html#authority-transfer

- https://docs.solana.com/developing/programming-model/accounts#ownership





== Solana CPI Safety (3 findings)


=== OSVM-SOL-683e585409c7941f - Missing account reload after CPI

*Severity:* High
*Category:* Solana CPI Safety
*CWE ID:* CWE-362
*CVSS Score:* 7

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains CPI operations without subsequent account reloading

*Impact:*
Account data may be stale after CPI, leading to incorrect program behavior and potential race conditions

*Recommendation:*
Always reload account data after CPI operations to ensure data consistency and prevent race conditions. Use account.reload() or fetch fresh account data.

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html#account-reloading

- https://docs.solana.com/developing/programming-model/calling-between-programs#reentrancy




=== OSVM-SOL-333b89611580a81d - Missing account reload after CPI

*Severity:* High
*Category:* Solana CPI Safety
*CWE ID:* CWE-362
*CVSS Score:* 7

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs contains CPI operations without subsequent account reloading

*Impact:*
Account data may be stale after CPI, leading to incorrect program behavior and potential race conditions

*Recommendation:*
Always reload account data after CPI operations to ensure data consistency and prevent race conditions. Use account.reload() or fetch fresh account data.

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html#account-reloading

- https://docs.solana.com/developing/programming-model/calling-between-programs#reentrancy




=== OSVM-SOL-e55954a9cd0ec222 - Missing account reload after CPI

*Severity:* High
*Category:* Solana CPI Safety
*CWE ID:* CWE-362
*CVSS Score:* 7

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains CPI operations without subsequent account reloading

*Impact:*
Account data may be stale after CPI, leading to incorrect program behavior and potential race conditions

*Recommendation:*
Always reload account data after CPI operations to ensure data consistency and prevent race conditions. Use account.reload() or fetch fresh account data.

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html#account-reloading

- https://docs.solana.com/developing/programming-model/calling-between-programs#reentrancy





== Solana Security (425 findings)


=== OSVM-SOL-983ac3d85c089358 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/tests.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/tests.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6847d2edf3fbd964 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/tests.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* svmai-token:svmai-token//tmp/osvm-audit-1754095715/programs/svmai-token/src/tests.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-0b8ffd1b5f1b6c9e - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-5c5f4fdfafc3b597 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c57fb1b3069e635f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-fd228c6bfd139ad9 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-0c9245ff1c6e264c - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-40f19cd847a763cf - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-09b0f931ff93924a - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-ed448c9c921e6aa2 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-76946ca785bca0d5 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-c24286172a7af5f0 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-a7b6cc4f86f47adc - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-03e7420fbf277cf2 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-23a3b00fd20687b3 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6a905fef4544da0a - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-195abfd9b7e9a27d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-b49126d7882216a4 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-ebc9b5e553875c19 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-df44281b88aaaeb5 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-4871988888b282a0 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-30028c9929988afd - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-b80c918307f6e432 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-f099d8c9573d07da - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-bee329562f44643b - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-04876bab6a850ffa - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-58cb507533dd055c - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-57371337e4806251 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-1a4ecd2c86293a82 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-d328ad4f2b1bcf04 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-a5ed9211fc7e18bb - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-ccc09b4ea5905ac7 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-07bf060f1a808b54 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-73dc6816002931ae - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-224f025f8673f339 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3cc7d6bcb394a283 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-d8d04c600ffb119a - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-23f3efcd8e6efc81 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-5a37088e96aa1715 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-e8a1426d52616232 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-1f23cb4b5cb69274 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6433f2f1d94b8d73 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-3007b956d635cd87 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-9d9cfe0efbbffadb - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-eaac996217d0a7c8 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-b02eb6db754d9e59 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-3cff15e46ceec5ab - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-32c1a30faedc69b0 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-5007cd3216569e1a - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-b1ba729c7079390d - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-a36435bfe1969ba3 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-b0c6546a3752c663 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-8ae139989ab355d7 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-702f2d4f29e36319 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-360a02aa05904e82 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-ca9a8c9455ddb802 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/token_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/token_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-242c35cb261b6a5a - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/token_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/token_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-f041fbaefe3a1452 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8f9cc36f997d625a - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-58c8407aa5d8826e - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-09fcf69e1a872b63 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-475168cadfed4052 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8ab6f0306b830188 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-1fac7404f3036a19 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-feefcc9f5b6f0970 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-14a5e14c5bd413a5 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6d00b6a4b3f442df - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-daf02d95e35f02ac - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-216b2552feaf564f - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-32fcf72e9b3afb9f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-4d6ba168988e8a96 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-a2f7c2a1ae650b85 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-e8f75db1820e430c - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-7fa29362a1c00442 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-9c5d06b2659396a7 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-e7eddba792851633 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-bf246bc49dda476a - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-3f79ec778d45a7ad - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-1bf4d983e6811f6a - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-a67d5c2b482fa438 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-33f653fdd0ea8f4d - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-8a0371b1518fa003 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-fcfdf19cbfc6f21b - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-5da3ccc6eb2e1f1e - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-2015a17302593f80 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-42fea75b5d521b24 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-b2ed0af124628faf - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-48e0dc6670727bc2 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-07c4ef033f2daf77 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-60a766c2677cd43d - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-66e26562f78c1cda - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-d378393cb83a8df5 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-7322e6e8555f446f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6d4da57defa8bc2c - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-02becd364774943b - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3dc9daf80883a751 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-beafb929ca87c3fb - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-4792881cd03c3485 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-811b242d6beed83c - Missing program ID validation before CPI

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-20
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Cross-Program Invocation without program ID validation at line 1

*Impact:*
Arbitrary program execution vulnerability - attacker can invoke malicious programs

*Recommendation:*
Always validate the program ID before making cross-program invocations

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/calling-between-programs

- https://github.com/coral-xyz/sealevel-attacks/tree/master/programs/0-arbitrary-cpi




=== OSVM-SOL-0b17f2660731852e - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-d6d079f22e155705 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-631dc8abddc52cf2 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-f8b0564a263f72b9 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-fa244802ef1b91d0 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-df986ca2961815b2 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-ba81cb0f215acbb1 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-e6a39ce518b98d4b - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-dc5c9a4f45050590 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-79f979ecb8751d3d - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c889c1207e690c38 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-b96069392da1b019 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-b696e050c53687d9 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-36b14dbfa090f9cf - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-06cc713ff9d34032 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-24135cc404f4d14c - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-9de63d4ce5022ff1 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-380c5f4f7cd6d033 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-049d437eaf3eadb0 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-05fe382f8b575c33 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-d2bfe0990026a6d9 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-775f94242228115c - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-360fbc7c04f17a73 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3a500229fd558005 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-e04f22dde0044fa0 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-2a7067199743ba7a - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-fb85dd026dd9b11c - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7012ffbb0083b53b - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-e23837da788445fb - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-082a7296f2598cc1 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-d1a444aced054d50 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-58eea1ff863001e6 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-226881f1b61d9cd6 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-2298f08a91fd4226 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-0394ef62b2bdf54d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-525e152ed4dda164 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-30412150a995fc20 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-89f85d512cfb4ea1 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c46f270b87ef3fae - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-e0929d24ac4794d6 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-b838461b21f1a7b3 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-b114a63d5c520655 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-6e936a818ac2655b - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-cf16b03d8aef0188 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-79ac6211b29267a3 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-d4a5a5f990f85af3 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-b8dfc8e79f70b317 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-ac1c718ac0ec93e3 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-1aa0587973393491 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-fb2ce87987d71559 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-efe9238e737697c5 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-c078fb06b0ab81bd - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-0c11c3e7ae45b841 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7f105de2012af659 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-5195fed078e642d9 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3f31d082a5be3863 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-6d33244d8aaf2a1b - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-e496daf83d4cb579 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-9b78e0ffc3fcc3b4 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-c7c95eac31126ada - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-f6336e513b780430 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-082108a861eda9fb - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-78f588b79c2457dc - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-0cb0e13329802cad - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-eae8ca713eade546 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-cf481366b64f76ec - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-b52cbcabecdea250 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-834886baf4d101b8 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-fcc77e3084c96275 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6d707b8df63c911e - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-4b62245257d017a3 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-56978b66125c02eb - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-38d25ceaea630dd7 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-ec3517f67794c6de - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-d928f8700e98717a - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-d71fd9070223b7b7 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-cfcfbc7f9fa0f295 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-c5431c21d39c1d06 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-fcf952d51623a3c8 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-47eaab550575e933 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-9646b5e0d379efcb - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7ae77a87c52ed535 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-a6e9845ea3c4008f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-0b57ebea75a4a09c - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-60f568e7c70189b1 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7937b793a9379da5 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-3253d949a591a6d8 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-d69d58790c41692c - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-930d8fa2caec863d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-40275edb29e7ee87 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-d5bb53826ec0ce8c - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8219076659d6292d - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-ff42f74ec76a0b42 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-5174ad28b11b4049 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-7abec126c1169cb1 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-095d48a1a6c10fa5 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-326cbc16592c5aa5 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-1b7cd9545bd411e2 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-da543b98b295bdfc - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-5735fa7c88f6faae - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-62151a5b9a4e2945 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-beec2b93603ff8ab - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-a6b6a57ba2e5e9cf - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-4efe3095d0e65195 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* agent-registry:agent-registry//tmp/osvm-audit-1754095715/programs/agent-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-afa5127c6e41387e - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/utils.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/utils.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-dd9f8eeba53ba3a1 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/utils.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/utils.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-6cb1a99b454c0659 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs contains what appears to be a hardcoded base58-encoded public key at line 1: 'Cpzvdx6pppc9'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-ded01f80fd92ec5e - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs contains what appears to be a hardcoded base58-encoded public key at line 1: 'A2AMPLyncKHw'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-82c43f6a035b3dc4 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-4b64c999f4a2cc1c - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/constants.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-916892ab70304098 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-ffad4cafa9d38613 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-4849682750c47632 - Missing program ID validation before CPI

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-20
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs contains Cross-Program Invocation without program ID validation at line 1

*Impact:*
Arbitrary program execution vulnerability - attacker can invoke malicious programs

*Recommendation:*
Always validate the program ID before making cross-program invocations

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/calling-between-programs

- https://github.com/coral-xyz/sealevel-attacks/tree/master/programs/0-arbitrary-cpi




=== OSVM-SOL-1fe28655989158ce - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-de1306851ba268c9 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-ef4e1cfae858d488 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-b5bd723c30ec44ba - Missing program ID validation before CPI

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-20
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs contains Cross-Program Invocation without program ID validation at line 1

*Impact:*
Arbitrary program execution vulnerability - attacker can invoke malicious programs

*Recommendation:*
Always validate the program ID before making cross-program invocations

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/calling-between-programs

- https://github.com/coral-xyz/sealevel-attacks/tree/master/programs/0-arbitrary-cpi




=== OSVM-SOL-53f125e981564eac - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* common:common//tmp/osvm-audit-1754095715/programs/common/src/token_utils.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-26afe0333effbb14 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-b3fa9200d63ecc27 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-31450dbce0677ebc - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-e4ea7e445078afd2 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-490162f647aa04f7 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-c86f8751e2981604 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-beb644ca2487e7d6 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-ff38557f2c94b7cb - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-ef29539fed95804f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-230304a95303eb0b - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-9ae9af3b74eac7bc - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-a4904cebf2fc5a1e - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-2f2038019775afed - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3b0be238eedcd4cf - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-4f46f3d9501bdbe2 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-bde20651fa9ccca8 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-6a41be52820c8e1a - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-cfd85b10e5659cf6 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-2a65362d529e6eb0 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-71f9cb161c783e34 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-36da91ad8ac6c246 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-a1809254fc9cf5c6 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-b98e04920afeb187 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-80804a069263577d - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-d35265977946e1bd - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-1a5cbaaf187194b6 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-f0b3ede501415051 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7b07895ec5c0f5f8 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-a140f5f9a70bae0e - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-396ca656c8066d19 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-fcfe39f1d00a28d0 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8dd988d195688e17 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-25b7805611461dd2 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3f11d13bdb3f3ee5 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-f4c582b8b9e8b014 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-b8e42f41573f2fcf - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-f71ed2624508cfb9 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-1d47dcafa6d02356 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-d69ecba054fdc24f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-85a28a119f684144 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-d769a3f42dd6b324 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-d13d30063a7f823b - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-38bbe2a90cf81580 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-04e4557e3effdc1e - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-6d96ba2d7bafc248 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-bcc2d9562cde127f - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-5cdd00285fa1a4b9 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-4d44bd37b70d3433 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-521b6f6ba9bfed28 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-71050f094123290c - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-17d15945a9cd4acd - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-dd0c4300d5ccf2d8 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-162221f5664ea162 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/authority_verification_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-28d59889dcf86b3c - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-81531e73dca805ec - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-504d263602d4fba4 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-11b90f450d947961 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-1161dc5a2ba5609b - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-44dad2867d6962e9 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-6f0c8c02c14556af - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-0e3df81f5877256f - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-e1e5ee818f7f1fa1 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7dc605e374539be3 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-a48a5aaa4392978b - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-f704046cf9f3bdb2 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-110c72f46a7dd134 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-a2f2aafa8294fc03 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-772a340ebc6ab5bc - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-eb8e024b01b43ec5 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-8b37a8c758d08cad - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/_tests_disabled/security_integration_test.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-d1b56e1be2757ad6 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-0bba557620d2e895 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-93a6635cd72d24af - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-9b60eb8bd2413f29 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-5417682f54270756 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-1e954dd989d2c01c - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-ce4025fc3e8420f0 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-73848ecfa661f70b - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-91a1062569eced45 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-bcb6e1783a5edc93 - Missing program ID validation before CPI

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-20
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Cross-Program Invocation without program ID validation at line 1

*Impact:*
Arbitrary program execution vulnerability - attacker can invoke malicious programs

*Recommendation:*
Always validate the program ID before making cross-program invocations

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/calling-between-programs

- https://github.com/coral-xyz/sealevel-attacks/tree/master/programs/0-arbitrary-cpi




=== OSVM-SOL-a04f27be5058de11 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-ab4d10bf0fad07c6 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-50fbdb391855c514 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-688cebf308782558 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-b8308521a1e722a3 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-c9eaa61414f5d50a - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-4ed2f05a13571564 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-cd1b4a0b197768a1 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-9e0b806a71eee739 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7c032059bec9dcaa - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-f696920860349a16 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-ddbee0b47156f662 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-1fb39fb0bc0857d5 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-bc9e59f251d718ca - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-82fa217b00d1a834 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-f1994b4d29772e69 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-b47ff0cec4a65dcc - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6ed60af52a9d47f5 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-9ba2f15509000802 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-1d0d6b6f4e52fb66 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-e0b0948dfaa44a8f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-fb8128317792262a - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c8e8e6dde5d23ad5 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-91268b94658cb7f1 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-df188a251f6bae28 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-bed8f2f2e32106fd - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-e668f41d5f7082c8 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-b0037d1fa2b64993 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-019828b40b795598 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-5ba3297802bcd930 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-9f0de5ef9e4cb3eb - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8db909d4b868eb4a - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c0fc1d055ee975a4 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-518ce51af7a09a49 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-5885619cfdacbc00 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3c5e4027af404089 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-6389d97e60f0468b - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-224a4ceccbd6d8b0 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c549c529d928d06f - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-a8cf45e3f3749618 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-29b29142d95575ca - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-33506f219b3f2d00 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-dbd19723c6a8727a - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-49321560fe063d1e - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-9b64bac8bc7d8b19 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-09262790ec9f78f2 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c6a1c3e5795fad1a - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-9377847f90e2691b - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-54071746f508a0bc - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-303b90b30fa90700 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-aabcbdf5550fb901 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-77e9a68c22d05c44 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-b7d1071087b722d0 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-54340c065c5d55a8 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-aaab79f2c2c53858 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3c190580da1a600c - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-2be812a6f7729ba4 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-e9f8e44489624735 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-49954f72c56e6303 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-febcfd48f2bcd8c5 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-a50d25392598f748 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-bd2e1a25775aca95 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-6666f0c9d76c287e - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-2e1cddf6bb494ce5 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-920fa132d4b4838a - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-a3d17aa63dbf5c4a - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-0bbf37cfb621f047 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-ebdfdecad64018dc - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-31216e2d21de1422 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-3162b6adfc87e4f8 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-216183db2e9defdb - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-aea29fa3fc343646 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-775c969f1f38ad2d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-e6ed8cab979cb668 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-aa5fa0d88c308df2 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-e4d40c166cd91ce6 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-f3018dfc2d362ecd - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-df400af8a322f7fb - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-2666f919ab069797 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-e1be0cd001d43e74 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-f53c6ecaf08bf2ed - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-f17f4a206e5f3ae3 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-ee3d31a42e369396 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-194433e56b0b048d - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-58e03387910f064a - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-df5207aeea66b9f9 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-16dd090a852476f9 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-4b6378e32618d740 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-a94d2fa9130cce52 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6d1a790c083d1207 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-48426709cead11c6 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-aaa305a26eff31c7 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-66cd4da75c74ae1c - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-88fe45d9a0f55d04 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-a567e6082a0253b7 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8f4243cab8b232c6 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-f3b6d7391ba92572 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-8ec32aac1601f807 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* mcp-server-registry:mcp-server-registry//tmp/osvm-audit-1754095715/programs/mcp-server-registry/src/processor.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-fe0af456a3814d3b - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-a4d43cf50047cf85 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/mcp/mod.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-e867c3d4a1f1f6f6 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/agent/mod.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/agent/mod.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-9e0e65e262ef8afb - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/agent/mod.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/agent/mod.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-20b46ee551362e67 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/client.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/client.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-6b3cd9feebf3f912 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/client.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/client.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-4673d1595a463973 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/client.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/client.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-cba452a9e74db889 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/client.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/client.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-fb816a8ca2564f45 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/client.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/client.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-ec7d1f534229a163 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/client.rs contains what appears to be a hardcoded base58-encoded public key at line 1: '111111111111'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/client.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-abbc759ee745df84 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs contains what appears to be a hardcoded base58-encoded public key at line 1: 'Cpzvdx6pppc9'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-3befa8113e067573 - Potential hardcoded Solana public key

*Severity:* Medium
*Category:* Solana Security
*CWE ID:* CWE-798
*CVSS Score:* 5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs contains what appears to be a hardcoded base58-encoded public key at line 1: 'A2AMPLyncKHw'

*Impact:*
Hardcoded keys reduce flexibility and may expose sensitive information

*Recommendation:*
Use environment variables or configuration for public keys, or use the Pubkey::from_str() function with constants

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/common.rs:1


*References:*

- https://docs.solana.com/developing/programming-model/accounts

- https://docs.rs/solana-sdk/latest/solana_sdk/pubkey/struct.Pubkey.html




=== OSVM-SOL-84c33dbf1d7b9fb6 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-438513a0a3fa9b5d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-25c3697da0ac7456 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-172383db1f2dd5ab - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-84540a1bb025fa88 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-96afa2cfabf95ac2 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-5616dced55ad6917 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-a6576bf9ffac448d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7d37e237935df14b - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-acbef81097703faa - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/pyg.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-be1bb884d1cec5fa - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/stream.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/stream.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-c5cf66eb9f9931c6 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/stream.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/stream.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-29acd59f8c263b92 - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/stream.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/stream.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-9c0f18444eced516 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/stream.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/stream.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-7e580374f29f563d - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/prepay.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/prepay.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-1005a4cb80b66b15 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/prepay.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/prepay.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html

- https://solana-labs.github.io/solana-program-library/anchor/lang/macro.Program.html




=== OSVM-SOL-a98b71c1bd312c6c - Missing account owner validation

*Severity:* High
*Category:* Solana Security
*CWE ID:* CWE-284
*CVSS Score:* 7.5

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/prepay.rs contains account operation without owner validation at line 1

*Impact:*
Programs could operate on accounts owned by malicious programs

*Recommendation:*
Always verify account ownership before performing operations: account.owner == expected_program_id

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/prepay.rs:1


*References:*

- https://book.anchor-lang.com/anchor_bts/security.html




=== OSVM-SOL-c204b6cfba125aa2 - Missing signer validation in Solana operation

*Severity:* Critical
*Category:* Solana Security
*CWE ID:* CWE-862
*CVSS Score:* 9

*Description:*
File rust//tmp/osvm-audit-1754095715/rust/src/payments/prepay.rs contains Solana operation without signer validation at line 1

*Impact:*
Unauthorized users could execute privileged operations

*Recommendation:*
Always validate that required accounts are signers using is_signer checks

*Code Location:* rust:rust//tmp/osvm-audit-1754095715/rust/src/payments/prepay.rs:1


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