#!/bin/bash

echo "🔧 App Store Screenshot Resizer"
echo "================================"

# Create resized screenshots directory
mkdir -p "app-store-assets/screenshots/resized"

echo ""
echo "📱 Required App Store Screenshot Sizes:"
echo "• iPhone 6.5\" Display: 1242 × 2688px"
echo "• iPhone 6.7\" Display: 1284 × 2778px"
echo ""

echo "🎯 Manual Resizing Instructions:"
echo ""
echo "For each screenshot you took:"
echo ""
echo "1. Open the screenshot in Preview app"
echo "2. Go to Tools → Adjust Size..."
echo "3. Change dimensions to:"
echo "   - Width: 1242, Height: 2688 (for 6.5\" display)"
echo "   - Width: 1284, Height: 2778 (for 6.7\" display)"
echo "4. Make sure 'Scale proportionally' is UNCHECKED"
echo "5. Save as new file in: app-store-assets/screenshots/resized/"
echo ""

echo "📝 Naming Convention:"
echo "• screenshot-1-6.5.png (1242×2688)"
echo "• screenshot-1-6.7.png (1284×2778)"
echo "• screenshot-2-6.5.png (1242×2688)"
echo "• screenshot-2-6.7.png (1284×2778)"
echo "• etc..."
echo ""

echo "⚡ Quick Alternative - Online Resizer:"
echo "1. Go to: https://www.iloveimg.com/resize-image"
echo "2. Upload your screenshots"
echo "3. Choose 'Custom' and enter exact dimensions above"
echo "4. Download resized versions"
echo ""

echo "✅ You need to create TWO versions of each screenshot:"
echo "   - One at 1242×2688 (6.5\" display)"  
echo "   - One at 1284×2778 (6.7\" display)"
echo ""

# Check if screenshots directory exists
if [ -d "app-store-assets/screenshots" ]; then
    echo "📁 Screenshots directory ready: app-store-assets/screenshots/"
else
    mkdir -p "app-store-assets/screenshots"
    echo "📁 Created screenshots directory: app-store-assets/screenshots/"
fi

echo ""
echo "🎬 Your screenshots look amazing! The FBI theme is perfect."
echo "Just need to resize them to Apple's exact specifications."