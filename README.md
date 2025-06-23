# Social Media App

A React Native Expo TypeScript social media application with camera functionality.

## 🚀 Features

- **Camera Integration**: Take photos and videos using expo-camera
- **Interactive Map**: Real-time location tracking with Google Maps
- **Photo Gallery**: Grid-based photo display with full-screen viewer
- **Navigation**: Stack and bottom tab navigation
- **TypeScript**: Full TypeScript support with proper typing
- **Modern Architecture**: Clean folder structure and component organization
- **Responsive Design**: Beautiful UI with consistent styling

## 📁 Project Structure

```
├── components/          # Reusable UI components
│   ├── Button.tsx      # Custom button component
│   └── index.ts        # Component exports
├── navigation/          # Navigation configuration
│   └── index.tsx       # Main navigation setup
├── screens/            # Screen components
│   ├── CameraScreen.tsx    # Camera functionality
│   ├── HomeScreen.tsx      # Main feed
│   ├── SearchScreen.tsx    # Search functionality
│   └── ProfileScreen.tsx   # User profile
├── services/           # Utilities and services
│   ├── theme.ts        # Design system/theme
│   ├── PhotoContext.tsx # Photo state management
│   ├── LocationService.tsx # Location tracking service
│   └── index.ts        # Service exports
├── types/              # TypeScript definitions
│   ├── navigation.ts   # Navigation types
│   └── index.ts        # Type exports
└── App.tsx             # Main application component
```

## 🛠 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Google Maps API Key** (Required for Map functionality):
   - Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Replace `AIzaSyD_your_api_key_here` in `app.json` with your actual API key
   - Enable Maps SDK for iOS and Android in your Google Cloud project

3. **Start the development server**:
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## 📱 Screens

### Camera Screen
- Camera permission handling
- Photo capture with preview and save/discard options
- Front/back camera toggle
- Modern camera UI with controls
- Device gallery integration

### Home Screen
- Photo gallery grid displaying captured photos
- Real-time photo statistics
- Photo management (view, delete)
- Clean, Instagram-like interface

### Search Screen
- Search input with icon
- Placeholder for search results
- Clean, minimal design

### Map Screen
- Interactive Google Maps integration
- Real-time location tracking
- Custom user marker with person icon
- Follow/unfollow location mode
- Location accuracy display
- Zoom, pan, rotate controls
- Location coordinates display

### Profile Screen
- User profile display
- Live stats (posts count from captured photos)
- Photo grid with full-screen viewer
- Delete photos functionality

## 🎨 Design System

The app uses a consistent design system defined in `services/theme.ts`:

- **Colors**: Primary, secondary, and semantic colors
- **Typography**: Consistent font sizes and weights
- **Spacing**: Standardized spacing scale
- **Border Radius**: Consistent corner radius values

## 🔧 Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **TypeScript**: Type safety and better DX
- **React Navigation**: Navigation solution
- **Expo Camera**: Camera functionality with media library
- **React Native Maps**: Interactive maps with Google Maps
- **Expo Location**: Location services and GPS tracking
- **Expo Vector Icons**: Icon library

## 📋 Next Steps

Ready for AI feature implementation:

1. **Image Processing**: Add filters and effects
2. **AI Recognition**: Object/face detection
3. **Smart Captions**: AI-generated captions
4. **Content Moderation**: Automated content filtering
5. **Recommendation Engine**: Personalized content suggestions

## 🚀 Getting Started

The app is ready to run! The camera screen is fully functional with proper permissions handling. All navigation is set up and the basic UI framework is in place for adding more advanced features.

## 📝 Development Notes

- Camera permissions are properly configured for both iOS and Android
- TypeScript configuration includes proper JSX and module resolution
- Navigation types are properly defined for type safety
- Component architecture is scalable for future features 