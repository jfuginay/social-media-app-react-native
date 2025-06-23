# Deployment Commands for Social Media App

## GitHub Repository Setup

### After creating repository on GitHub, run these commands:

```bash
# Add your GitHub repository as remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename main branch to match GitHub default
git branch -M main

# Push code to GitHub
git push -u origin main
```

## EAS Build Commands

### Current Build Status
✅ Currently running: `eas build --platform all --profile preview`
- This creates internal distribution builds (fastest deployment)
- No app store approval needed
- Direct install links for iOS and Android

### Future Build Commands

```bash
# For development builds (with dev client)
eas build --platform all --profile development

# For production app store builds
eas build --platform all --profile production

# Submit to app stores (after production build)
eas submit --platform all
```

## Quick Deployment Options

### Option 1: Internal Testing (Current - FASTEST)
- **Time**: 15-30 minutes
- **Result**: Direct download links
- **Perfect for**: Testing, demos, sharing with team

### Option 2: App Store Deployment
```bash
# After preview build completes
eas build --platform all --profile production
eas submit --platform all
```
- **Time**: 1-3 days (app store review)
- **Result**: Published to Google Play & Apple App Store

## Environment Setup

### Required API Keys
1. **Google Maps API Key** (Required for map functionality)
   - Go to: https://console.cloud.google.com/
   - Enable: Maps SDK for Android & iOS
   - Create API key
   - Update in app.json: `"apiKey": "YOUR_ACTUAL_KEY"`

### EAS Project
- **Project URL**: https://expo.dev/accounts/jfuginay/projects/snapchat
- **Bundle ID**: com.jfuginay.snapchat (Android & iOS)

## Build Monitoring

### Check Build Status
```bash
# View build status
eas build:list

# View specific build
eas build:view [BUILD_ID]
```

### Build URLs
- Check your builds at: https://expo.dev/accounts/jfuginay/projects/snapchat/builds

## App Features Ready for Testing

✅ **Camera Screen**: Photo capture with preview modal
✅ **Photo Gallery**: Grid layout with full-screen viewer  
✅ **Interactive Map**: Real-time GPS tracking with Google Maps
✅ **Bottom Navigation**: 5 tabs (Home, Search, Camera, Map, Profile)
✅ **Photo Management**: Save, view, delete photos
✅ **Location Services**: Live location updates with custom markers
✅ **Cross-Platform**: iOS and Android support
✅ **TypeScript**: Full type safety throughout app

## Next Steps After Build Completes

1. **Download builds** from EAS dashboard
2. **Test on devices** using provided install links
3. **Share with users** for immediate testing
4. **Configure Google Maps API** for full map functionality
5. **Set up CI/CD** with GitHub Actions (optional) 