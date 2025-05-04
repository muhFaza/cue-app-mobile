# CueApp - Billiard Halls Finder

A React Native Expo application that helps users find nearby billiard halls using the Google Places API.

## Features

- Splash screen with logo and location permission request
- List of nearby billiard halls with details (name, address, open/closed status)
- Detailed view of each billiard hall including:
  - Photos
  - Opening hours
  - Rating and reviews
  - Contact information
  - Option to open in Google Maps

## Technical Implementation

- Built with React Native and Expo
- Uses React Navigation for screen navigation
- Integrates with Google Places API for location data
- Uses Expo Location for device location services
- Implements responsive design for various screen sizes

## Setup Instructions

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up your Google Places API key in `utils/api.js`
4. Run the app with `expo start`

## Required API Keys

- Google Places API key with Places API and Maps API enabled
- Set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in .env

## How to set up your Google Places API key:
- Go to Google Cloud Console (https://console.cloud.google.com/)
- Create a new project or select an existing one
- Enable the Places API and Maps API from the API Library
- Create an API key with appropriate restrictions
- Replace 'EXPO_PUBLIC_GOOGLE_MAPS_API_KEY' in utils/api.js with your actual key

## Dependencies

- @react-navigation/native
- @react-navigation/stack
- expo-location
- axios
- react-native-screens
- react-native-safe-area-context