# StoreApp (React Native)

A simple store app built with React Native and TypeScript using DummyJSON as the backend. It includes an authentication flow, a tabbed main app (Products, Categories, Profile), dark mode, and basic role-based actions.

## Features

- Auth login against https://dummyjson.com/auth/login with token persistence (MMKV)
- Main tabs:
  - Products: list all products
  - Categories: browse all categories; tap any category to see its products
  - Profile: show user info and role, toggle dark mode, and sign out
- Role-based action: admin/superadmin can see the Delete button on products (demo purpose)
- Dark mode toggle saved persistently
- Auto-lock and optional biometric unlock (if supported on device)

## Superadmin credentials

Use these to log in with elevated permissions:

- Username: `emilys`
- Password: `emilyspass`

## Requirements

- macOS with Node.js 20+ and Watchman
- Xcode (for iOS) and Android Studio (for Android)
- Ruby + Bundler (for CocoaPods)

## Setup & Run

1. Install JS dependencies

- npm install

2. iOS setup (first time or after native updates)

- bundle install
- cd ios && bundle exec pod install && cd ..

3. Start Metro (in a separate terminal)

- npm start

4. Run the app

- iOS: npm run ios
- Android: npm run android

Notes

- If Metro is already running, you can skip step 3. The platform command will start it if needed.
- For best results, run on a physical device or simulator without Remote JS Debugging.

## Important notes

- Persistence: This app uses MMKV for fast storage. Remote JS Debugging disables MMKV; to see login persistence across reloads, run without remote debugging.
- API base URL: https://dummyjson.com
- Categories: All categories are listed; tapping one opens its products list.

## Scripts

- npm start – start Metro
- npm run ios – build and run iOS
- npm run android – build and run Android
- npm test – run tests

## Trade-offs and next steps (if more time)

- Improve UI/UX and visual polish
- Add more product actions (edit, add to cart, favorite)
- Product details screen with images, specs, and reviews
- Profile enhancements and customization (avatar edit, preferences)
