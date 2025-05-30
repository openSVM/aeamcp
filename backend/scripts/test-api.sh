#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3001"
USER_ID="test-user-$(date +%s)"

echo -e "${BLUE}🧪 Testing AEAMCP Git Registration API${NC}"
echo "========================================"
echo -e "Base URL: ${YELLOW}${BASE_URL}${NC}"
echo -e "Test User ID: ${YELLOW}${USER_ID}${NC}"
echo ""

# Test health endpoint
test_health() {
    echo -e "${YELLOW}Testing health endpoint...${NC}"
    
    response=$(curl -s -w "%{http_code}" -o /tmp/health_response.json "${BASE_URL}/health" || echo "000")
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ Health check passed${NC}"
        echo "Response:"
        cat /tmp/health_response.json | jq '.' 2>/dev/null || cat /tmp/health_response.json
        echo ""
        return 0
    else
        echo -e "${RED}❌ Health check failed (HTTP ${response})${NC}"
        return 1
    fi
}

# Test API info endpoint
test_api_info() {
    echo -e "${YELLOW}Testing API info endpoint...${NC}"
    
    response=$(curl -s -w "%{http_code}" -o /tmp/api_response.json "${BASE_URL}/api/v1" || echo "000")
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ API info endpoint working${NC}"
        echo "Response:"
        cat /tmp/api_response.json | jq '.' 2>/dev/null || cat /tmp/api_response.json
        echo ""
        return 0
    else
        echo -e "${RED}❌ API info endpoint failed (HTTP ${response})${NC}"
        return 1
    fi
}

# Test repository analysis with public repo
test_public_repo_analysis() {
    echo -e "${YELLOW}Testing public repository analysis...${NC}"
    
    # Use a known public MCP server repository
    payload=$(cat <<EOF
{
  "url": "https://github.com/modelcontextprotocol/servers.git",
  "branch": "main"
}
EOF
)
    
    echo "Sending request:"
    echo "$payload" | jq '.'
    
    response=$(curl -s -w "%{http_code}" -o /tmp/analysis_response.json \
        -X POST "${BASE_URL}/api/v1/git/analyze" \
        -H "Content-Type: application/json" \
        -H "x-user-id: ${USER_ID}" \
        -d "$payload" || echo "000")
    
    if [ "$response" = "202" ]; then
        echo -e "${GREEN}✅ Analysis request accepted${NC}"
        echo "Response:"
        cat /tmp/analysis_response.json | jq '.' 2>/dev/null || cat /tmp/analysis_response.json
        
        # Extract repo ID for follow-up
        REPO_ID=$(cat /tmp/analysis_response.json | jq -r '.repoId' 2>/dev/null || echo "")
        echo ""
        
        if [ -n "$REPO_ID" ] && [ "$REPO_ID" != "null" ]; then
            echo -e "${YELLOW}Checking analysis status...${NC}"
            sleep 2
            
            # Check analysis status
            status_response=$(curl -s -w "%{http_code}" -o /tmp/status_response.json \
                "${BASE_URL}/api/v1/git/analysis/${REPO_ID}" \
                -H "x-user-id: ${USER_ID}" || echo "000")
            
            if [ "$status_response" = "200" ]; then
                echo -e "${GREEN}✅ Analysis status retrieved${NC}"
                echo "Status response:"
                cat /tmp/status_response.json | jq '.' 2>/dev/null || cat /tmp/status_response.json
                echo ""
            else
                echo -e "${YELLOW}⚠️  Analysis status check returned HTTP ${status_response}${NC}"
            fi
        fi
        
        return 0
    else
        echo -e "${RED}❌ Analysis request failed (HTTP ${response})${NC}"
        echo "Response:"
        cat /tmp/analysis_response.json 2>/dev/null || echo "No response body"
        return 1
    fi
}

# Test list analyses endpoint
test_list_analyses() {
    echo -e "${YELLOW}Testing list analyses endpoint...${NC}"
    
    response=$(curl -s -w "%{http_code}" -o /tmp/list_response.json \
        "${BASE_URL}/api/v1/git/analyses?page=1&limit=5" \
        -H "x-user-id: ${USER_ID}" || echo "000")
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✅ List analyses working${NC}"
        echo "Response:"
        cat /tmp/list_response.json | jq '.' 2>/dev/null || cat /tmp/list_response.json
        echo ""
        return 0
    else
        echo -e "${RED}❌ List analyses failed (HTTP ${response})${NC}"
        return 1
    fi
}

# Test error handling with invalid URL
test_error_handling() {
    echo -e "${YELLOW}Testing error handling with invalid URL...${NC}"
    
    payload=$(cat <<EOF
{
  "url": "not-a-valid-url",
  "branch": "main"
}
EOF
)
    
    response=$(curl -s -w "%{http_code}" -o /tmp/error_response.json \
        -X POST "${BASE_URL}/api/v1/git/analyze" \
        -H "Content-Type: application/json" \
        -H "x-user-id: ${USER_ID}" \
        -d "$payload" || echo "000")
    
    if [ "$response" = "400" ]; then
        echo -e "${GREEN}✅ Error handling working correctly${NC}"
        echo "Error response:"
        cat /tmp/error_response.json | jq '.' 2>/dev/null || cat /tmp/error_response.json
        echo ""
        return 0
    else
        echo -e "${RED}❌ Error handling test failed (expected 400, got ${response})${NC}"
        return 1
    fi
}

# Test rate limiting
test_rate_limiting() {
    echo -e "${YELLOW}Testing rate limiting (making multiple requests)...${NC}"
    
    success_count=0
    rate_limited_count=0
    
    for i in {1..5}; do
        response=$(curl -s -w "%{http_code}" -o /dev/null "${BASE_URL}/health" || echo "000")
        if [ "$response" = "200" ]; then
            ((success_count++))
        elif [ "$response" = "429" ]; then
            ((rate_limited_count++))
        fi
        sleep 0.1
    done
    
    echo -e "${GREEN}✅ Rate limiting test completed${NC}"
    echo "Successful requests: $success_count"
    echo "Rate limited requests: $rate_limited_count"
    echo ""
}

# Check if server is running
check_server() {
    echo -e "${YELLOW}Checking if server is running...${NC}"
    
    if curl -s "${BASE_URL}/health" >/dev/null; then
        echo -e "${GREEN}✅ Server is running${NC}"
        return 0
    else
        echo -e "${RED}❌ Server is not running or not accessible${NC}"
        echo -e "${YELLOW}Please start the server with: npm run dev${NC}"
        return 1
    fi
}

# Run all tests
run_tests() {
    local failed=0
    
    echo -e "${BLUE}Running API tests...${NC}"
    echo ""
    
    check_server || return 1
    
    test_health || ((failed++))
    test_api_info || ((failed++))
    test_list_analyses || ((failed++))
    test_error_handling || ((failed++))
    test_rate_limiting || ((failed++))
    test_public_repo_analysis || ((failed++))
    
    echo -e "${BLUE}Test Results:${NC}"
    echo "============="
    
    if [ $failed -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed!${NC}"
        return 0
    else
        echo -e "${RED}❌ $failed test(s) failed${NC}"
        return 1
    fi
}

# Cleanup function
cleanup() {
    rm -f /tmp/health_response.json
    rm -f /tmp/api_response.json
    rm -f /tmp/analysis_response.json
    rm -f /tmp/status_response.json
    rm -f /tmp/list_response.json
    rm -f /tmp/error_response.json
}

# Main execution
main() {
    trap cleanup EXIT
    
    case "${1:-all}" in
        "health")
            check_server && test_health
            ;;
        "info")
            test_api_info
            ;;
        "analysis")
            test_public_repo_analysis
            ;;
        "list")
            test_list_analyses
            ;;
        "error")
            test_error_handling
            ;;
        "rate")
            test_rate_limiting
            ;;
        "all")
            run_tests
            ;;
        *)
            echo "Usage: $0 [health|info|analysis|list|error|rate|all]"
            echo ""
            echo "Options:"
            echo "  health    - Test health endpoint only"
            echo "  info      - Test API info endpoint"
            echo "  analysis  - Test repository analysis"
            echo "  list      - Test list analyses"
            echo "  error     - Test error handling"
            echo "  rate      - Test rate limiting"
            echo "  all       - Run all tests (default)"
            exit 1
            ;;
    esac
}

main "$@"