#!/bin/bash

# Script to clone BingotwoGether repository to fresh-start-repo
# This script creates a clean copy of the repository with all files but optionally without git history

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SOURCE_REPO="https://github.com/bingo2gether/BingotwoGether.git"
TARGET_REPO_NAME="fresh-start-repo"
CURRENT_DIR=$(pwd)

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}BingotwoGether Repository Cloning Tool${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if target directory already exists
if [ -d "$TARGET_REPO_NAME" ]; then
    echo -e "${RED}Error: Directory '$TARGET_REPO_NAME' already exists!${NC}"
    echo "Please remove it or choose a different location."
    exit 1
fi

# Ask user for cloning preference
echo -e "${YELLOW}How would you like to clone the repository?${NC}"
echo "1) Clone with full git history (recommended for contributing back)"
echo "2) Clone without git history (fresh start for a new project)"
echo ""
read -p "Enter your choice (1 or 2): " choice

case $choice in
    1)
        echo -e "${GREEN}Cloning with full git history...${NC}"
        git clone "$SOURCE_REPO" "$TARGET_REPO_NAME"
        cd "$TARGET_REPO_NAME"
        
        # Remove the origin remote to prevent accidental pushes
        git remote remove origin
        
        echo ""
        echo -e "${GREEN}✓ Repository cloned successfully!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. cd $TARGET_REPO_NAME"
        echo "2. Set up your new remote repository:"
        echo "   git remote add origin <your-new-repo-url>"
        echo "3. Push to your new repository:"
        echo "   git push -u origin main"
        ;;
    2)
        echo -e "${GREEN}Cloning without git history (fresh start)...${NC}"
        
        # Clone the repository temporarily
        TEMP_DIR="temp_clone_$$"
        git clone "$SOURCE_REPO" "$TEMP_DIR"
        
        # Create new directory and copy files
        mkdir -p "$TARGET_REPO_NAME"
        
        # Copy all files except .git directory
        rsync -av --progress "$TEMP_DIR/" "$TARGET_REPO_NAME/" --exclude .git
        
        # Remove temporary clone
        rm -rf "$TEMP_DIR"
        
        # Initialize new git repository
        cd "$TARGET_REPO_NAME"
        git init
        
        # Configure git user if not already set (for this repository only)
        if ! git config user.name > /dev/null 2>&1; then
            git config user.name "Repository Cloner"
        fi
        if ! git config user.email > /dev/null 2>&1; then
            git config user.email "clone@example.com"
        fi
        
        git add .
        git commit -m "Initial commit: Fresh start from BingotwoGether"
        
        echo ""
        echo -e "${GREEN}✓ Repository copied successfully with fresh git history!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. cd $TARGET_REPO_NAME"
        echo "2. Create a new repository on GitHub (or your preferred platform)"
        echo "3. Add the remote:"
        echo "   git remote add origin <your-new-repo-url>"
        echo "4. Push to your new repository:"
        echo "   git branch -M main"
        echo "   git push -u origin main"
        ;;
    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

cd "$CURRENT_DIR"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Additional Setup Required:${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "1. Install dependencies:"
echo "   cd $TARGET_REPO_NAME"
echo "   npm install"
echo "   cd frontend && npm install"
echo "   cd ../backend && npm install"
echo ""
echo "2. Set up environment variables:"
echo "   cp frontend/.env.example frontend/.env"
echo "   cp backend/.env.example backend/.env"
echo "   # Edit the .env files with your configuration"
echo ""
echo "3. Set up database:"
echo "   docker-compose up -d"
echo "   cd backend && npx prisma migrate dev"
echo ""
echo "4. Start development:"
echo "   npm run dev"
echo ""
echo -e "${GREEN}For detailed setup instructions, see QUICKSTART.md${NC}"
