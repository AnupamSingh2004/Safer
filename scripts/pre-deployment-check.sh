#!/bin/bash

# Pre-Deployment Check Script
# Smart Tourist Safety System - SIH 2024
# Automated deployment validation and system health checks

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_URL="http://localhost:8000"
FRONTEND_URL="http://localhost:3000"
BLOCKCHAIN_URL="http://localhost:8545"
TIMEOUT=30

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check HTTP endpoint
check_http_endpoint() {
    local url=$1
    local name=$2
    local timeout=${3:-10}
    
    log_info "Checking $name at $url..."
    
    if command_exists curl; then
        if curl -s --max-time $timeout "$url" > /dev/null; then
            log_success "$name is accessible"
            return 0
        else
            log_error "$name is not accessible"
            return 1
        fi
    else
        log_warning "curl not available, skipping HTTP check for $name"
        return 0
    fi
}

# Check port availability
check_port() {
    local host=$1
    local port=$2
    local name=$3
    
    log_info "Checking if $name port $port is available..."
    
    if command_exists nc; then
        if nc -z "$host" "$port" 2>/dev/null; then
            log_success "$name port $port is accessible"
            return 0
        else
            log_error "$name port $port is not accessible"
            return 1
        fi
    elif command_exists telnet; then
        if timeout 5 telnet "$host" "$port" 2>/dev/null | grep -q "Connected"; then
            log_success "$name port $port is accessible"
            return 0
        else
            log_error "$name port $port is not accessible"
            return 1
        fi
    else
        log_warning "Neither nc nor telnet available, skipping port check for $name"
        return 0
    fi
}

# Check file exists and permissions
check_file() {
    local file_path=$1
    local description=$2
    
    log_info "Checking $description: $file_path"
    
    if [ -f "$file_path" ]; then
        if [ -r "$file_path" ]; then
            log_success "$description exists and is readable"
            return 0
        else
            log_error "$description exists but is not readable"
            return 1
        fi
    else
        log_error "$description does not exist"
        return 1
    fi
}

# Check directory exists and permissions
check_directory() {
    local dir_path=$1
    local description=$2
    
    log_info "Checking $description: $dir_path"
    
    if [ -d "$dir_path" ]; then
        if [ -r "$dir_path" ] && [ -x "$dir_path" ]; then
            log_success "$description exists and is accessible"
            return 0
        else
            log_error "$description exists but is not accessible"
            return 1
        fi
    else
        log_error "$description does not exist"
        return 1
    fi
}

# Check Node.js dependencies
check_node_dependencies() {
    local dir=$1
    local name=$2
    
    log_info "Checking $name dependencies..."
    
    if [ -f "$dir/package.json" ]; then
        log_success "package.json found for $name"
        
        if [ -d "$dir/node_modules" ]; then
            log_success "node_modules directory exists for $name"
            
            # Check if main dependencies exist
            local main_deps=("react" "next" "typescript")
            for dep in "${main_deps[@]}"; do
                if [ -d "$dir/node_modules/$dep" ]; then
                    log_success "$dep dependency installed"
                else
                    log_warning "$dep dependency not found"
                fi
            done
        else
            log_error "node_modules directory not found for $name"
            return 1
        fi
    else
        log_error "package.json not found for $name"
        return 1
    fi
}

# Check environment variables
check_environment_variables() {
    log_info "Checking environment variables..."
    
    local required_vars=(
        "NODE_ENV"
        "NEXT_PUBLIC_API_URL"
        "DATABASE_URL"
        "JWT_SECRET"
    )
    
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        else
            log_success "$var is set"
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        log_error "Missing environment variables: ${missing_vars[*]}"
        return 1
    else
        log_success "All required environment variables are set"
        return 0
    fi
}

# Check database connection
check_database() {
    log_info "Checking database connection..."
    
    if [ -n "$DATABASE_URL" ]; then
        # Extract database type from URL
        if [[ $DATABASE_URL == postgresql* ]]; then
            log_info "PostgreSQL database detected"
            if command_exists psql; then
                if psql "$DATABASE_URL" -c "SELECT 1;" > /dev/null 2>&1; then
                    log_success "Database connection successful"
                    return 0
                else
                    log_error "Database connection failed"
                    return 1
                fi
            else
                log_warning "psql not available, skipping database check"
                return 0
            fi
        elif [[ $DATABASE_URL == mongodb* ]]; then
            log_info "MongoDB database detected"
            if command_exists mongo; then
                if mongo "$DATABASE_URL" --eval "db.runCommand({ping: 1})" > /dev/null 2>&1; then
                    log_success "Database connection successful"
                    return 0
                else
                    log_error "Database connection failed"
                    return 1
                fi
            else
                log_warning "mongo client not available, skipping database check"
                return 0
            fi
        else
            log_warning "Unknown database type, skipping connection check"
            return 0
        fi
    else
        log_error "DATABASE_URL not set"
        return 1
    fi
}

# Check system resources
check_system_resources() {
    log_info "Checking system resources..."
    
    # Check available memory
    if command_exists free; then
        local available_mem=$(free -m | awk 'NR==2{printf "%.1f", $7/1024}')
        log_info "Available memory: ${available_mem}GB"
        
        if (( $(echo "$available_mem > 1.0" | bc -l) )); then
            log_success "Sufficient memory available"
        else
            log_warning "Low memory available: ${available_mem}GB"
        fi
    fi
    
    # Check disk space
    if command_exists df; then
        local available_disk=$(df -h "$PROJECT_ROOT" | awk 'NR==2 {print $4}')
        log_info "Available disk space: $available_disk"
        
        # Extract numeric value (assuming format like "10G")
        local disk_gb=$(echo "$available_disk" | sed 's/[^0-9.]//g')
        if (( $(echo "$disk_gb > 5.0" | bc -l) )); then
            log_success "Sufficient disk space available"
        else
            log_warning "Low disk space available: $available_disk"
        fi
    fi
    
    # Check CPU load
    if command_exists uptime; then
        local load_avg=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
        log_info "Current load average: $load_avg"
        
        if (( $(echo "$load_avg < 2.0" | bc -l) )); then
            log_success "System load is normal"
        else
            log_warning "High system load: $load_avg"
        fi
    fi
}

# Check security configurations
check_security() {
    log_info "Checking security configurations..."
    
    # Check if running as root
    if [ "$EUID" -eq 0 ]; then
        log_warning "Running as root - consider using a non-root user"
    else
        log_success "Not running as root"
    fi
    
    # Check file permissions
    local sensitive_files=(
        ".env"
        ".env.local"
        "package.json"
    )
    
    for file in "${sensitive_files[@]}"; do
        local file_path="$PROJECT_ROOT/$file"
        if [ -f "$file_path" ]; then
            local perms=$(stat -c "%a" "$file_path" 2>/dev/null || stat -f "%A" "$file_path" 2>/dev/null)
            if [ "$perms" = "600" ] || [ "$perms" = "644" ]; then
                log_success "$file has appropriate permissions ($perms)"
            else
                log_warning "$file has permissive permissions ($perms)"
            fi
        fi
    done
    
    # Check for exposed secrets
    if [ -f "$PROJECT_ROOT/.env" ]; then
        if grep -q "password\|secret\|key" "$PROJECT_ROOT/.env" 2>/dev/null; then
            log_warning "Sensitive data detected in .env file"
        else
            log_success ".env file looks secure"
        fi
    fi
}

# Run API health checks
check_api_health() {
    log_info "Running API health checks..."
    
    # Backend health check
    if check_http_endpoint "$BACKEND_URL/api/health" "Backend API"; then
        # Check specific endpoints
        local endpoints=(
            "/api/tourists"
            "/api/alerts"
            "/api/emergency"
            "/api/auth"
        )
        
        for endpoint in "${endpoints[@]}"; do
            check_http_endpoint "$BACKEND_URL$endpoint" "Endpoint $endpoint"
        done
    fi
    
    # Frontend health check
    check_http_endpoint "$FRONTEND_URL" "Frontend Application"
    
    # Blockchain node check
    check_http_endpoint "$BLOCKCHAIN_URL" "Blockchain Node"
}

# Check WebSocket connectivity
check_websocket() {
    log_info "Checking WebSocket connectivity..."
    
    if command_exists wscat; then
        if timeout 10 wscat -c "ws://localhost:8000" -x "ping" > /dev/null 2>&1; then
            log_success "WebSocket connection successful"
        else
            log_error "WebSocket connection failed"
        fi
    else
        log_warning "wscat not available, skipping WebSocket check"
    fi
}

# Performance benchmarks
run_performance_checks() {
    log_info "Running performance checks..."
    
    # Frontend bundle size check
    if [ -d "$PROJECT_ROOT/frontend/.next" ]; then
        local bundle_size=$(du -sh "$PROJECT_ROOT/frontend/.next" | cut -f1)
        log_info "Frontend bundle size: $bundle_size"
        
        # Check if bundle is reasonable size (less than 100MB)
        local size_mb=$(du -sm "$PROJECT_ROOT/frontend/.next" | cut -f1)
        if [ "$size_mb" -lt 100 ]; then
            log_success "Bundle size is optimal"
        else
            log_warning "Bundle size is large: ${bundle_size}"
        fi
    fi
    
    # Backend response time check
    if command_exists curl; then
        local response_time=$(curl -o /dev/null -s -w "%{time_total}" "$BACKEND_URL/api/health" 2>/dev/null || echo "0")
        log_info "Backend response time: ${response_time}s"
        
        if (( $(echo "$response_time < 2.0" | bc -l) )); then
            log_success "Backend response time is good"
        else
            log_warning "Backend response time is slow: ${response_time}s"
        fi
    fi
}

# Main deployment check function
run_deployment_checks() {
    echo "🚀 Smart Tourist Safety System - Pre-Deployment Validation"
    echo "============================================================"
    echo "Project Root: $PROJECT_ROOT"
    echo "Timestamp: $(date)"
    echo ""
    
    local total_checks=0
    local passed_checks=0
    local failed_checks=0
    
    # System prerequisites
    echo "📋 SYSTEM PREREQUISITES"
    echo "------------------------"
    
    ((total_checks++))
    if command_exists node; then
        local node_version=$(node --version)
        log_success "Node.js is installed: $node_version"
        ((passed_checks++))
    else
        log_error "Node.js is not installed"
        ((failed_checks++))
    fi
    
    ((total_checks++))
    if command_exists npm; then
        local npm_version=$(npm --version)
        log_success "npm is installed: $npm_version"
        ((passed_checks++))
    else
        log_error "npm is not installed"
        ((failed_checks++))
    fi
    
    ((total_checks++))
    if command_exists git; then
        local git_version=$(git --version)
        log_success "Git is installed: $git_version"
        ((passed_checks++))
    else
        log_error "Git is not installed"
        ((failed_checks++))
    fi
    
    echo ""
    
    # Project structure
    echo "📁 PROJECT STRUCTURE"
    echo "---------------------"
    
    local dirs=(
        "$PROJECT_ROOT/frontend:Frontend directory"
        "$PROJECT_ROOT/backend:Backend directory"
        "$PROJECT_ROOT/docs:Documentation directory"
        "$PROJECT_ROOT/scripts:Scripts directory"
    )
    
    for dir_info in "${dirs[@]}"; do
        IFS=':' read -r dir_path description <<< "$dir_info"
        ((total_checks++))
        if check_directory "$dir_path" "$description"; then
            ((passed_checks++))
        else
            ((failed_checks++))
        fi
    done
    
    echo ""
    
    # Dependencies
    echo "📦 DEPENDENCIES"
    echo "---------------"
    
    ((total_checks++))
    if check_node_dependencies "$PROJECT_ROOT/frontend" "Frontend"; then
        ((passed_checks++))
    else
        ((failed_checks++))
    fi
    
    ((total_checks++))
    if check_node_dependencies "$PROJECT_ROOT/backend" "Backend"; then
        ((passed_checks++))
    else
        ((failed_checks++))
    fi
    
    echo ""
    
    # Configuration
    echo "⚙️  CONFIGURATION"
    echo "-----------------"
    
    local config_files=(
        "$PROJECT_ROOT/frontend/next.config.ts:Next.js config"
        "$PROJECT_ROOT/frontend/package.json:Frontend package.json"
        "$PROJECT_ROOT/backend/package.json:Backend package.json"
        "$PROJECT_ROOT/docker-compose.yml:Docker Compose config"
    )
    
    for file_info in "${config_files[@]}"; do
        IFS=':' read -r file_path description <<< "$file_info"
        ((total_checks++))
        if check_file "$file_path" "$description"; then
            ((passed_checks++))
        else
            ((failed_checks++))
        fi
    done
    
    ((total_checks++))
    if check_environment_variables; then
        ((passed_checks++))
    else
        ((failed_checks++))
    fi
    
    echo ""
    
    # Services
    echo "🌐 SERVICES"
    echo "-----------"
    
    ((total_checks++))
    if check_port "localhost" "3000" "Frontend"; then
        ((passed_checks++))
    else
        ((failed_checks++))
    fi
    
    ((total_checks++))
    if check_port "localhost" "8000" "Backend"; then
        ((passed_checks++))
    else
        ((failed_checks++))
    fi
    
    ((total_checks++))
    if check_database; then
        ((passed_checks++))
    else
        ((failed_checks++))
    fi
    
    echo ""
    
    # API Health
    echo "🏥 API HEALTH"
    echo "-------------"
    check_api_health
    
    echo ""
    
    # WebSocket
    echo "🔌 WEBSOCKET"
    echo "------------"
    check_websocket
    
    echo ""
    
    # System Resources
    echo "💻 SYSTEM RESOURCES"
    echo "-------------------"
    check_system_resources
    
    echo ""
    
    # Security
    echo "🔒 SECURITY"
    echo "-----------"
    check_security
    
    echo ""
    
    # Performance
    echo "⚡ PERFORMANCE"
    echo "-------------"
    run_performance_checks
    
    echo ""
    
    # Summary
    echo "📊 DEPLOYMENT READINESS SUMMARY"
    echo "================================"
    echo "Total Checks: $total_checks"
    echo "Passed: $passed_checks"
    echo "Failed: $failed_checks"
    echo ""
    
    local success_rate=$((passed_checks * 100 / total_checks))
    
    if [ $failed_checks -eq 0 ]; then
        log_success "🎉 All checks passed! System is ready for deployment."
        echo ""
        echo "✅ DEPLOYMENT STATUS: READY"
        exit 0
    elif [ $success_rate -ge 80 ]; then
        log_warning "⚠️  Most checks passed with $failed_checks failures. Review and fix issues."
        echo ""
        echo "⚠️  DEPLOYMENT STATUS: READY WITH WARNINGS"
        exit 0
    else
        log_error "❌ Multiple checks failed. System is not ready for deployment."
        echo ""
        echo "❌ DEPLOYMENT STATUS: NOT READY"
        exit 1
    fi
}

# Quick health check function
quick_health_check() {
    echo "🏥 Quick Health Check"
    echo "===================="
    
    check_http_endpoint "$BACKEND_URL/api/health" "Backend API"
    check_http_endpoint "$FRONTEND_URL" "Frontend"
    check_port "localhost" "3000" "Frontend Port"
    check_port "localhost" "8000" "Backend Port"
    
    echo ""
    log_info "Quick health check completed"
}

# Help function
show_help() {
    echo "Smart Tourist Safety System - Pre-Deployment Check Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --full       Run full deployment validation (default)"
    echo "  --quick      Run quick health check only"
    echo "  --help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                 # Run full deployment check"
    echo "  $0 --quick         # Run quick health check"
    echo "  $0 --help          # Show help"
    echo ""
}

# Parse command line arguments
case "${1:-}" in
    --quick)
        quick_health_check
        ;;
    --help)
        show_help
        ;;
    --full|"")
        run_deployment_checks
        ;;
    *)
        echo "Unknown option: $1"
        show_help
        exit 1
        ;;
esac