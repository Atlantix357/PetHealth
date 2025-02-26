# PetPulse Setup Guide for Beginners

This guide will walk you through setting up the PetPulse app from scratch, even if you're new to React Native development.

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- A Firebase account

## Step 1: Install Development Tools

### Install Node.js and npm
1. Download and install Node.js from [nodejs.org](https://nodejs.org/)
2. Verify installation by running:
   ```
   node -v
   npm -v
   ```

### Install Expo CLI
```
npm install -g expo-cli
```

### Install Android Studio
1. Download Android Studio from [developer.android.com](https://developer.android.com/studio)
2. Follow the installation wizard
3. Open Android Studio and go to SDK Manager
4. Install Android SDK (version 9.0/API level 28 or higher)
5. Set up an Android Virtual Device (AVD) through AVD Manager

## Step 2: Clone or Create the Project

### Option 1: Create a new project
```
npx create-expo-app petpulse
cd petpulse
```

### Option 2: Clone the existing repository
```
git clone [repository-url]
cd petpulse
npm install
```

## Step 3: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the steps to create a new project
3. Once created, click on the Android icon to add an Android app
4. Register your app with package name `com.yourcompany.petpulse`
5. Download the `google-services.json` file
6. Place the file in the root of your project

### Update Firebase Configuration
1. Open `src/services/firebase.js`
2. Replace the placeholder values in `firebaseConfig` with your actual Firebase configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_ACTUAL_API_KEY",
     authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
     projectId: "YOUR_ACTUAL_PROJECT_ID",
     storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
     messagingSenderId: "YOUR_ACTUAL_MESSAGING_SENDER_ID",
     appId: "YOUR_ACTUAL_APP_ID",
     measurementId: "YOUR_ACTUAL_MEASUREMENT_ID"
   };
   ```

## Step 4: Set Up Google Sign-In

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select your Firebase project
3. Navigate to "APIs & Services" > "Credentials"
4. Create an OAuth 2.0 Client ID for Android
5. Use your app's package name and SHA-1 certificate fingerprint
   - To get SHA-1, run: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
6. Download the configuration file and follow the instructions from Google

## Step 5: Set Up AdMob

1. Go to [AdMob Console](https://apps.admob.com/)
2. Create a new app
3. Get your AdMob App ID
4. Update the app.json file with your AdMob App ID
5. Create ad units for the different ad formats you want to use
6. Update the adService.js file with your ad unit IDs

## Step 6: Install Dependencies

Make sure all dependencies are installed:

```
npm install
```

## Step 7: Run the App

### Start the development server
```
npx expo start
```

### Run on Android
With the development server running:
- Press 'a' in the terminal to run on an Android emulator
- Or scan the QR code with the Expo Go app on your physical device

## Troubleshooting Common Issues

### Metro Bundler Issues
If the Metro bundler gets stuck or has errors:
```
npx expo start --clear
```

### Dependency Issues
If you encounter dependency conflicts:
```
npm install --force
```

### Android Build Issues
1. Make sure Android SDK is properly installed
2. Check that the `google-services.json` file is in the correct location
3. Verify that your emulator is running Android 9.0 or higher

## Next Steps

Once your app is running:

1. Implement the authentication screens
2. Set up the pet management functionality
3. Implement health tracking features
4. Add feeding schedule management
5. Integrate AdMob ads
6. Test thoroughly on different devices

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started)
- [AdMob Documentation](https://developers.google.com/admob/android/quick-start)
