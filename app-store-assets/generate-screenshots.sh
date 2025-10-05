#!/bin/bash

# App Store Screenshot Generator Script
# Run this after your build is complete

echo "🚀 Setting up iOS Simulator for App Store Screenshots"

# Open different simulator sizes for screenshots
echo "Opening iPhone 15 Pro Max (6.7 inch)..."
xcrun simctl boot "iPhone 15 Pro Max"
open -a Simulator --args -CurrentDeviceUDID "iPhone 15 Pro Max"

echo "📱 Simulator opened. Follow these steps:"
echo ""
echo "1. Install your app build on the simulator"
echo "2. Open your app"
echo "3. Navigate to each screen you want to screenshot"
echo "4. Press Device > Screenshots > Save to Desktop"
echo ""
echo "Required screenshots:"
echo "- Home screen with animated background"
echo "- Character profiles list"
echo "- Character detail modal/popup"
echo "- Features overview"
echo ""
echo "Screenshot sizes needed:"
echo "- iPhone 6.7\": 1290 x 2796 pixels"
echo "- iPhone 6.5\": 1242 x 2688 pixels"  
echo "- iPhone 5.5\": 1242 x 2208 pixels"
echo ""
echo "💡 Tip: Take screenshots in portrait orientation only"
echo "💡 Tip: First screenshot is most important - use your best screen!"

# Create screenshots directory
mkdir -p "app-store-assets/screenshots"
echo "📁 Created screenshots directory: app-store-assets/screenshots"

echo ""
echo "Once you have screenshots:"
echo "1. Resize them to required dimensions"
echo "2. Add text overlays highlighting features"
echo "3. Upload to App Store Connect"