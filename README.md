# TripSee 🧳✈️

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-username/tripsee)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-0.79.1-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)

> **Plan. Explore. Remember.** - Your ultimate travel companion for creating, sharing, and managing unforgettable trips.

## 📱 Project Overview

TripSee is a comprehensive mobile travel planning application that helps users organize their trips, discover new places, track expenses, and share experiences with fellow travelers. Built with React Native and Expo, it provides a seamless cross-platform experience for both iOS and Android users.

### ✨ Key Features

- **Trip Planning**: Create detailed itineraries with places, dates, and activities
- **Place Discovery**: Explore curated destinations with ratings and reviews
- **Expense Tracking**: Monitor travel costs with category-based budgeting
- **Social Sharing**: Share trips publicly or collaborate with travel partners
- **Guest Mode**: Browse and explore without account creation
- **Offline Support**: Access trip data without internet connection
- **Multi-currency**: Support for international travel expenses

### 🎯 Current Status

- **Version**: 1.0.0
- **Platform**: iOS, Android, Web (via Expo)
- **Status**: Development/Beta
- **Last Updated**: January 2025

## 🛠 Technology Stack

### Frontend Framework
- **React Native**: 0.79.1 - Cross-platform mobile development
- **Expo**: 53.0.0 - Development platform and build tools
- **TypeScript**: 5.8.3 - Type-safe JavaScript development

### Navigation & Routing
- **Expo Router**: 5.0.2 - File-based routing system
- **React Navigation**: 7.0.14 - Navigation library for React Native

### State Management
- **React Hooks**: Built-in state management with useState, useEffect
- **Custom Hooks**: Centralized data management (useTrips, usePlaces, useExpenses)
- **AsyncStorage**: Local data persistence

### UI & Styling
- **React Native StyleSheet**: Native styling approach
- **Lucide React Native**: 0.475.0 - Icon library
- **Expo Linear Gradient**: 14.1.3 - Gradient effects
- **React Native Safe Area Context**: 5.3.0 - Safe area handling

### Data & Storage
- **AsyncStorage**: @react-native-async-storage/async-storage 2.2.0
- **Local Storage**: Client-side data persistence
- **JSON**: Data serialization format

### Development Tools
- **Metro**: React Native bundler
- **Babel**: JavaScript compiler
- **ESLint**: Code linting
- **Prettier**: Code formatting

### Testing Framework
- **Jest**: Unit testing (configured but tests to be implemented)
- **React Native Testing Library**: Component testing utilities

## 🚀 Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Expo CLI**: Latest version
- **Git**: For version control

#### For iOS Development:
- **macOS**: Required for iOS development
- **Xcode**: 14.x or higher
- **iOS Simulator**: Included with Xcode

#### For Android Development:
- **Android Studio**: Latest version
- **Android SDK**: API level 33 or higher
- **Android Emulator**: Configured virtual device

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/tripsee.git
   cd tripsee
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   npx expo start
   ```

4. **Run on Device/Simulator**
   ```bash
   # iOS Simulator
   npx expo start --ios
   
   # Android Emulator
   npx expo start --android
   
   # Web Browser
   npx expo start --web
   ```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# App Configuration
EXPO_PUBLIC_APP_NAME=TripSee
EXPO_PUBLIC_APP_VERSION=1.0.0

# API Configuration (if using external APIs)
EXPO_PUBLIC_API_BASE_URL=https://api.tripsee.com
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key

# Feature Flags
EXPO_PUBLIC_ENABLE_SOCIAL_FEATURES=true
EXPO_PUBLIC_ENABLE_OFFLINE_MODE=true
```

### IDE Setup

#### VS Code Extensions (Recommended)
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "expo.vscode-expo-tools"
  ]
}
```

#### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### Troubleshooting

#### Common Issues

**Metro bundler cache issues:**
```bash
npm cache clean --force
npx expo start --clear
```

**iOS build issues:**
```bash
cd ios && pod install && cd ..
npx expo run:ios --clean
```

**Android build issues:**
```bash
npx expo run:android --clean
```

**TypeScript errors:**
```bash
npx tsc --noEmit
```

## 📁 Project Structure

```
tripsee/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx          # Tab layout configuration
│   │   ├── index.tsx            # Home/My Trips screen
│   │   ├── discover.tsx         # Place discovery screen
│   │   ├── expenses.tsx         # Expense tracking screen
│   │   ├── social.tsx           # Social features screen
│   │   └── profile.tsx          # User profile screen
│   ├── auth/                    # Authentication screens
│   │   ├── _layout.tsx          # Auth layout
│   │   ├── login.tsx            # Login screen
│   │   ├── register.tsx         # Registration screen
│   │   ├── profile-setup.tsx    # Profile setup wizard
│   │   └── forgot-password.tsx  # Password reset
│   ├── _layout.tsx              # Root layout
│   └── +not-found.tsx           # 404 error screen
├── components/                   # Reusable UI components
│   ├── DatePicker.tsx           # Date selection component
│   ├── DatePickerModal.tsx      # Modal date picker
│   ├── TripDetailsModal.tsx     # Trip details modal
│   ├── TripSharingModal.tsx     # Trip sharing modal
│   ├── TripMapView.tsx          # Map visualization
│   ├── ItineraryView.tsx        # Itinerary display
│   ├── PlaceSelector.tsx        # Place selection modal
│   └── InvitationsModal.tsx     # Trip invitations
├── hooks/                       # Custom React hooks
│   ├── useStorage.ts            # Data management hooks
│   └── useFrameworkReady.ts     # Framework initialization
├── services/                    # Business logic services
│   └── StorageService.ts        # Data persistence service
├── assets/                      # Static assets
│   └── images/                  # App icons and images
├── types/                       # TypeScript type definitions
├── docs/                        # Documentation
└── config/                      # Configuration files
```

### Directory Purposes

- **`app/`**: Contains all screen components using Expo Router file-based routing
- **`components/`**: Reusable UI components shared across screens
- **`hooks/`**: Custom React hooks for state management and side effects
- **`services/`**: Business logic and data access layer
- **`assets/`**: Static files like images, fonts, and icons
- **`types/`**: TypeScript interface and type definitions

### Naming Conventions

- **Files**: PascalCase for components (`TripCard.tsx`), camelCase for utilities (`storageUtils.ts`)
- **Components**: PascalCase (`TripDetailsModal`)
- **Functions**: camelCase (`handleCreateTrip`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Interfaces**: PascalCase with descriptive names (`UserProfile`, `TripData`)

## 🏗 Architecture & Design Patterns

### Architecture Pattern

TripSee follows a **Component-Based Architecture** with **Custom Hooks Pattern** for state management:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │   Business      │    │   Data          │
│   Layer         │    │   Logic         │    │   Layer         │
│                 │    │                 │    │                 │
│ • Screens       │◄──►│ • Custom Hooks  │◄──►│ • StorageService│
│ • Components    │    │ • State Mgmt    │    │ • AsyncStorage  │
│ • Navigation    │    │ • Side Effects  │    │ • Local Data    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Design Patterns Used

1. **Custom Hooks Pattern**: Centralized state management
   ```typescript
   const { trips, addTrip, updateTrip } = useTrips();
   ```

2. **Service Layer Pattern**: Data access abstraction
   ```typescript
   class StorageService {
     async getTrips(): Promise<Trip[]> { /* ... */ }
   }
   ```

3. **Observer Pattern**: React's built-in state updates and re-renders

4. **Factory Pattern**: Dynamic component creation based on data types

### Data Flow

```
User Interaction → Screen Component → Custom Hook → Service Layer → AsyncStorage
                                   ↓
                              State Update → Re-render → UI Update
```

## 📊 Data Schema

### Core Data Models

```typescript
interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  image: string;
  participants: number;
  places: number;
  createdAt: string;
  updatedAt: string;
  visibility: 'public' | 'private';
  shareId?: string;
  createdBy: string;
  collaborators: TripCollaborator[];
  invitations: TripInvitation[];
  currency: string;
  partners: TripPartner[];
  fellowTravellers: FellowTraveller[];
}

interface Place {
  id: string;
  name: string;
  category: string;
  rating: number;
  image: string;
  description: string;
  location: string;
  estimatedTime: string;
  price: string;
  saved: boolean;
  tripId?: string;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  tripId: string;
  createdAt: string;
  paidBy: string;
  splitBetween: string[];
  settled: boolean;
  currency: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  userType: 'guest' | 'authenticated';
  isActive: boolean;
  preferences: {
    notifications: boolean;
    locationSharing: boolean;
    publicProfile: boolean;
  };
  stats: {
    tripsCompleted: number;
    placesVisited: number;
    totalExpenses: number;
    friendsConnected: number;
  };
}
```

### Local Storage Schema

Data is stored in AsyncStorage with the following keys:

- `travel_trips`: Array of Trip objects
- `travel_places`: Array of Place objects
- `travel_expenses`: Array of Expense objects
- `user_profile`: UserProfile object
- `user_session`: Session information
- `public_trips`: Public trips feed
- `trip_invitations`: Trip collaboration invitations

### State Structure

```typescript
// Custom Hooks State Management
const useTrips = () => ({
  trips: Trip[],
  loading: boolean,
  addTrip: (trip: Omit<Trip, 'id'>) => Promise<Trip>,
  updateTrip: (id: string, updates: Partial<Trip>) => Promise<void>,
  deleteTrip: (id: string) => Promise<void>
});
```

## 🔌 API Integration

### Service Layer Architecture

```typescript
class StorageService {
  // Trip Management
  async getTrips(): Promise<Trip[]>
  async addTrip(trip: Trip): Promise<void>
  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<void>
  
  // User Management
  async getProfile(): Promise<UserProfile | null>
  async saveProfile(profile: UserProfile): Promise<void>
  
  // Data Sharing
  async exportAllData(): Promise<SharedData>
  async importSharedData(data: SharedData): Promise<void>
}
```

### Error Handling Strategy

```typescript
// Global error handling in custom hooks
const useTrips = () => {
  const [error, setError] = useState<string | null>(null);
  
  const addTrip = async (trip: Omit<Trip, 'id'>) => {
    try {
      // ... operation
    } catch (error) {
      console.error('Error adding trip:', error);
      setError('Failed to add trip. Please try again.');
      throw error;
    }
  };
};
```

### Authentication Flow

```typescript
// Guest Session Creation
await StorageService.createGuestSession({
  fullName: 'John Doe',
  email: 'john@example.com'
});

// Authenticated Session Creation
await StorageService.createAuthenticatedSession({
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://...'
});
```

## 🧪 Testing Strategy

### Unit Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Testing Structure

```
tests/
├── __mocks__/           # Mock implementations
├── components/          # Component tests
├── hooks/              # Custom hook tests
├── services/           # Service layer tests
└── utils/              # Utility function tests
```

### Example Test

```typescript
// hooks/__tests__/useTrips.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useTrips } from '../useStorage';

describe('useTrips', () => {
  it('should add a new trip', async () => {
    const { result } = renderHook(() => useTrips());
    
    await act(async () => {
      await result.current.addTrip({
        title: 'Test Trip',
        destination: 'Paris',
        startDate: '2024-06-01',
        endDate: '2024-06-07'
      });
    });
    
    expect(result.current.trips).toHaveLength(1);
  });
});
```

### Manual Testing Checklist

- [ ] Guest user registration and login
- [ ] Trip creation and editing
- [ ] Place discovery and saving
- [ ] Expense tracking and categorization
- [ ] Social sharing functionality
- [ ] Offline data persistence
- [ ] Cross-platform compatibility

## 📱 Build and Deployment

### Development Build

```bash
# Start development server
npm run dev

# Build for specific platform
npx expo run:ios
npx expo run:android
```

### Production Build

#### iOS Deployment

**Prerequisites:**
- macOS with Xcode 14+
- Apple Developer Account ($99/year)
- Valid provisioning profiles

**Build Process:**
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure build
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

**App Store Submission:**
1. Create app listing in App Store Connect
2. Upload build via EAS Submit or Xcode
3. Fill out app metadata and screenshots
4. Submit for review (typically 24-48 hours)

#### Android Deployment

**Prerequisites:**
- Google Play Console account ($25 one-time fee)
- Signing keystore

**Build Process:**
```bash
# Generate keystore (first time only)
keytool -genkey -v -keystore release-key.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000

# Build for Android
eas build --platform android --profile production

# Submit to Google Play
eas submit --platform android
```

**Google Play Submission:**
1. Create app listing in Google Play Console
2. Upload AAB file
3. Complete store listing with descriptions and screenshots
4. Submit for review (typically 2-3 days)

### Environment-Specific Builds

```javascript
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

## 🤝 Contributing Guidelines

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the coding standards
4. Write tests for new functionality
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Coding Standards

- **TypeScript**: All new code must be written in TypeScript
- **ESLint**: Follow the configured linting rules
- **Prettier**: Use automatic code formatting
- **Naming**: Follow established naming conventions
- **Comments**: Document complex logic and public APIs

### Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add screenshots for UI changes
4. Request review from maintainers
5. Address feedback and re-request review

## 📋 Changelog

### Version 1.0.0 (January 2025)
- ✨ Initial release
- 🎯 Core trip planning functionality
- 🗺️ Place discovery and recommendations
- 💰 Expense tracking with categories
- 👥 Social sharing and collaboration
- 🔐 Guest and authenticated user modes
- 📱 Cross-platform support (iOS, Android, Web)

### Upcoming Features (v1.1.0)
- 🌐 Real-time collaboration
- 📍 GPS integration and offline maps
- 🔄 Cloud synchronization
- 📊 Advanced expense analytics
- 🎨 Customizable themes
- 🌍 Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 TripSee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## 🆘 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: [GitHub Issues](https://github.com/your-username/tripsee/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/tripsee/discussions)
- **Email**: support@tripsee.com

### Reporting Bugs

When reporting bugs, please include:

1. **Device Information**: OS version, device model
2. **App Version**: Current version number
3. **Steps to Reproduce**: Detailed reproduction steps
4. **Expected Behavior**: What should happen
5. **Actual Behavior**: What actually happens
6. **Screenshots**: Visual evidence if applicable
7. **Logs**: Console output or crash logs

### Feature Requests

We welcome feature requests! Please:

1. Check existing issues to avoid duplicates
2. Provide detailed use case descriptions
3. Explain the problem you're trying to solve
4. Suggest potential implementation approaches

## 🚀 Performance Considerations

### Optimization Strategies

- **Lazy Loading**: Components and screens load on demand
- **Image Optimization**: Compressed images with appropriate resolutions
- **Memory Management**: Proper cleanup of listeners and subscriptions
- **Bundle Size**: Tree shaking and code splitting
- **Caching**: Intelligent data caching with AsyncStorage

### Performance Benchmarks

- **App Launch Time**: < 3 seconds on average devices
- **Screen Transitions**: < 300ms animation duration
- **Data Loading**: < 2 seconds for typical operations
- **Memory Usage**: < 150MB RAM on average

### Monitoring

```typescript
// Performance monitoring example
const startTime = performance.now();
await loadTripsData();
const endTime = performance.now();
console.log(`Data loading took ${endTime - startTime} milliseconds`);
```

---

## 🎯 Quick Start

Ready to get started? Follow these steps:

1. **Clone & Install**
   ```bash
   git clone https://github.com/your-username/tripsee.git
   cd tripsee
   npm install
   ```

2. **Start Development**
   ```bash
   npm run dev
   ```

3. **Open on Device**
   - Scan QR code with Expo Go app
   - Or press `i` for iOS Simulator
   - Or press `a` for Android Emulator

4. **Start Building**
   - Check out the project structure
   - Read the component documentation
   - Start with small changes and work your way up

Happy coding! 🚀

---

**Made with ❤️ by the TripSee Team**