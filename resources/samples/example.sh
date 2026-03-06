#!/bin/bash
# Shell Script Example - Demonstrates functions, arrays, and control flow
# Use this file to validate Shell/Bash extension support on VFS

set -euo pipefail

# Constants
readonly SCRIPT_NAME=$(basename "$0")
readonly LOG_FILE="/tmp/${SCRIPT_NAME}.log"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
    
    case "$level" in
        ERROR) echo -e "${RED}[$level]${NC} $message" ;;
        WARN)  echo -e "${YELLOW}[$level]${NC} $message" ;;
        INFO)  echo -e "${GREEN}[$level]${NC} $message" ;;
        *)     echo "[$level] $message" ;;
    esac
}

# Array of items to process
declare -a ITEMS=("apple" "banana" "cherry" "date" "elderberry")

# Associative array (dictionary)
declare -A PRICES=(
    ["apple"]=1.50
    ["banana"]=0.75
    ["cherry"]=3.00
    ["date"]=2.25
    ["elderberry"]=4.50
)

# Function with return value
calculate_total() {
    local -a items=("$@")
    local total=0
    
    for item in "${items[@]}"; do
        if [[ -v PRICES[$item] ]]; then
            total=$(echo "$total + ${PRICES[$item]}" | bc)
        fi
    done
    
    echo "$total"
}

# Function with error handling
process_file() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        log ERROR "File not found: $file"
        return 1
    fi
    
    local line_count=$(wc -l < "$file")
    log INFO "Processing $file ($line_count lines)"
    return 0
}

# Parse command line arguments
parse_args() {
    while getopts ":hv" opt; do
        case $opt in
            h)
                echo "Usage: $SCRIPT_NAME [-h] [-v]"
                echo "  -h  Show this help message"
                echo "  -v  Enable verbose mode"
                exit 0
                ;;
            v)
                VERBOSE=true
                ;;
            \?)
                log ERROR "Invalid option: -$OPTARG"
                exit 1
                ;;
        esac
    done
}

# Main function
main() {
    log INFO "Starting $SCRIPT_NAME"
    
    # Process items
    echo "Available items:"
    for item in "${ITEMS[@]}"; do
        printf "  %-15s \$%.2f\n" "$item" "${PRICES[$item]}"
    done
    
    # Calculate total
    local total=$(calculate_total "${ITEMS[@]}")
    echo ""
    echo "Total value: \$$total"
    
    # Conditional execution
    if (( $(echo "$total > 10" | bc -l) )); then
        log INFO "Large order detected"
    fi
    
    log INFO "Script completed successfully"
}

# Entry point
parse_args "$@"
main
