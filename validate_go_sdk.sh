#!/bin/bash
# Go SDK Implementation Validation Script
# This script validates that the Go SDK implementation meets all requirements

set -e

echo "🚀 Starting Go SDK Implementation Validation"
echo "============================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
        exit 1
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "ℹ️  $1"
}

# Check if we're in a Go SDK directory
if [ ! -f "go.mod" ]; then
    echo -e "${RED}Error: go.mod not found. Please run this script from the Go SDK root directory.${NC}"
    exit 1
fi

print_info "Validating Go SDK implementation against requirements..."

# 1. Module Structure Validation
echo -e "\n📁 Validating Module Structure"
echo "--------------------------------"

# Check required directories
required_dirs=("client" "agent" "mcp" "payments" "idl" "errors" "examples" "tests")
for dir in "${required_dirs[@]}"; do
    if [ -d "$dir" ]; then
        print_status 0 "Directory $dir exists"
    else
        print_status 1 "Directory $dir missing"
    fi
done

# Check required files
required_files=("README.md" "LICENSE" ".github/workflows/go.yml")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "File $file exists"
    else
        print_status 1 "File $file missing"
    fi
done

# 2. Dependencies Validation
echo -e "\n📦 Validating Dependencies"
echo "----------------------------"

# Check go.mod for required dependencies
required_deps=("github.com/gagliardetto/solana-go" "github.com/stretchr/testify")
for dep in "${required_deps[@]}"; do
    if grep -q "$dep" go.mod; then
        print_status 0 "Dependency $dep found in go.mod"
    else
        print_status 1 "Dependency $dep missing from go.mod"
    fi
done

# Check for security vulnerabilities
print_info "Checking for security vulnerabilities..."
if command -v govulncheck &> /dev/null; then
    if govulncheck ./...; then
        print_status 0 "No security vulnerabilities found"
    else
        print_status 1 "Security vulnerabilities detected"
    fi
else
    print_warning "govulncheck not installed, skipping vulnerability check"
fi

# 3. Code Quality Validation
echo -e "\n🔍 Validating Code Quality"
echo "----------------------------"

# Check formatting
print_info "Checking code formatting..."
if [ -z "$(gofmt -l .)" ]; then
    print_status 0 "Code is properly formatted"
else
    print_status 1 "Code formatting issues found"
    echo "Run 'gofmt -w .' to fix formatting issues"
fi

# Check for common Go issues
print_info "Running go vet..."
if go vet ./...; then
    print_status 0 "go vet passed"
else
    print_status 1 "go vet found issues"
fi

# Check for linting issues (if golangci-lint is available)
if command -v golangci-lint &> /dev/null; then
    print_info "Running golangci-lint..."
    if golangci-lint run; then
        print_status 0 "golangci-lint passed"
    else
        print_status 1 "golangci-lint found issues"
    fi
else
    print_warning "golangci-lint not installed, skipping lint check"
fi

# 4. Unit Tests Validation
echo -e "\n🧪 Validating Unit Tests"
echo "-------------------------"

# Run unit tests with coverage
print_info "Running unit tests with coverage..."
if go test -v -race -coverprofile=coverage.out ./...; then
    print_status 0 "Unit tests passed"
    
    # Check coverage
    coverage=$(go tool cover -func=coverage.out | grep total | awk '{print $3}' | sed 's/%//')
    if (( $(echo "$coverage >= 90" | bc -l) )); then
        print_status 0 "Code coverage ${coverage}% meets requirement (≥90%)"
    else
        print_status 1 "Code coverage ${coverage}% below requirement (≥90%)"
    fi
else
    print_status 1 "Unit tests failed"
fi

# 5. Integration Tests Validation
echo -e "\n🌐 Validating Integration Tests"
echo "--------------------------------"

# Check if devnet tests exist
if [ -f "tests/integration_test.go" ]; then
    print_status 0 "Integration tests exist"
    
    # Run integration tests if SOLANA_RPC_URL is set
    if [ -n "$SOLANA_RPC_URL" ]; then
        print_info "Running integration tests against devnet..."
        if go test -v -tags=devnet ./tests/...; then
            print_status 0 "Integration tests passed"
        else
            print_status 1 "Integration tests failed"
        fi
    else
        print_warning "SOLANA_RPC_URL not set, skipping integration tests"
    fi
else
    print_status 1 "Integration tests missing"
fi

# 6. Documentation Validation
echo -e "\n📚 Validating Documentation"
echo "-----------------------------"

# Check for GoDoc comments
print_info "Checking GoDoc coverage..."
missing_docs=0
while IFS= read -r -d '' file; do
    if grep -l "^func [A-Z]" "$file" | head -1 > /dev/null; then
        # Check if exported functions have doc comments
        if ! grep -B1 "^func [A-Z]" "$file" | grep -q "^//"; then
            echo "Missing documentation in $file"
            missing_docs=$((missing_docs + 1))
        fi
    fi
done < <(find . -name "*.go" -not -path "./vendor/*" -not -path "./.git/*" -print0)

if [ $missing_docs -eq 0 ]; then
    print_status 0 "All public functions documented"
else
    print_status 1 "$missing_docs files missing documentation"
fi

# Check examples
example_files=("examples/basic_agent_registration.go" "examples/mcp_server_setup.go" "examples/payment_flows.go")
for file in "${example_files[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "Example $file exists"
    else
        print_status 1 "Example $file missing"
    fi
done

# 7. IDL Validation
echo -e "\n🔧 Validating IDL Integration"
echo "------------------------------"

# Check IDL files
idl_files=("idl/agent_registry.json" "idl/mcp_server_registry.json")
for file in "${idl_files[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "IDL file $file exists"
        
        # Validate JSON format
        if jq empty "$file" 2>/dev/null; then
            print_status 0 "IDL file $file is valid JSON"
        else
            print_status 1 "IDL file $file is invalid JSON"
        fi
    else
        print_status 1 "IDL file $file missing"
    fi
done

# 8. Error Handling Validation
echo -e "\n⚠️  Validating Error Handling"
echo "------------------------------"

# Check for error types
if [ -f "errors/errors.go" ]; then
    print_status 0 "Error handling package exists"
    
    # Check for typed errors
    if grep -q "type.*Error struct" errors/errors.go; then
        print_status 0 "Typed errors defined"
    else
        print_status 1 "Typed errors missing"
    fi
    
    # Check for error wrapping
    if grep -q "fmt.Errorf.*%w" errors/errors.go; then
        print_status 0 "Error wrapping implemented"
    else
        print_status 1 "Error wrapping missing"
    fi
else
    print_status 1 "Error handling package missing"
fi

# 9. Performance Validation
echo -e "\n⚡ Validating Performance"
echo "-------------------------"

# Check for benchmark tests
if find . -name "*_test.go" -exec grep -l "func Benchmark" {} \; | head -1 > /dev/null; then
    print_status 0 "Benchmark tests exist"
    
    # Run benchmarks
    print_info "Running benchmarks..."
    if go test -bench=. -run=^$ ./... > /dev/null 2>&1; then
        print_status 0 "Benchmarks completed successfully"
    else
        print_status 1 "Benchmark tests failed"
    fi
else
    print_status 1 "Benchmark tests missing"
fi

# 10. CI/CD Validation
echo -e "\n🚀 Validating CI/CD Configuration"
echo "----------------------------------"

# Check GitHub Actions workflow
if [ -f ".github/workflows/go.yml" ]; then
    print_status 0 "GitHub Actions workflow exists"
    
    # Check for required jobs
    required_jobs=("test" "lint" "security")
    for job in "${required_jobs[@]}"; do
        if grep -q "$job:" .github/workflows/go.yml; then
            print_status 0 "CI job '$job' configured"
        else
            print_status 1 "CI job '$job' missing"
        fi
    done
else
    print_status 1 "GitHub Actions workflow missing"
fi

echo -e "\n🎉 Validation Complete!"
echo "======================="

# Summary
echo -e "\n📊 Summary:"
echo "- Module structure validated"
echo "- Dependencies checked"
echo "- Code quality verified"
echo "- Tests validated"
echo "- Documentation checked"
echo "- IDL integration verified"
echo "- Error handling confirmed"
echo "- Performance benchmarks checked"
echo "- CI/CD configuration verified"

echo -e "\n💡 Next Steps:"
echo "1. Fix any issues reported above"
echo "2. Run integration tests with: SOLANA_RPC_URL=https://api.devnet.solana.com ./validate_go_sdk.sh"
echo "3. Review implementation guidelines: docs/GO_SDK_IMPLEMENTATION_GUIDELINES.md"
echo "4. Submit PR for review"

echo -e "\n✅ Go SDK implementation validation completed successfully!"