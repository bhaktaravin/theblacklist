# The Blacklist 🎯

A cross-platform mobile application inspired by the TV series "The Blacklist" for tracking and managing criminal profiles with enhanced features.

![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Dart](https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white)

## ✨ Features

- **🔍 Real-time Search** - Search criminals by name or blacklist number
- **📸 Photo Management** - Upload and display criminal mugshots with Firebase Storage
- **📊 Threat Level System** - Visual color-coded threat indicators (Critical, High, Medium, Low)
- **📍 Location Tracking** - Track last known locations
- **👤 Detailed Profiles** - Comprehensive criminal profiles with aliases, descriptions, and episode references
- **🔄 Status Management** - Track status (At Large, Captured, Deceased)
- **🎨 Dark Theme UI** - Sleek, Material Design 3 dark interface
- **⚡ Real-time Updates** - Live synchronization with Firebase Firestore
- **🗑️ Swipe to Delete** - Intuitive gesture-based deletion with confirmation
- **✏️ Edit Profiles** - Full CRUD operations on criminal records

## 🛠️ Tech Stack

- **Flutter** - Cross-platform mobile framework
- **Firebase Firestore** - NoSQL cloud database for real-time data
- **Firebase Storage** - Cloud storage for images
- **Image Picker** - Gallery integration for photo uploads
- **Material Design 3** - Modern UI components

## 📱 Screenshots

> Add your app screenshots here

## 🚀 Getting Started

### Prerequisites

- Flutter SDK (^3.10.1)
- Firebase account and project setup
- Android Studio / Xcode for platform-specific builds

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/theblacklist.git
cd theblacklist
```

2. Install dependencies
```bash
flutter pub get
```

3. Configure Firebase
   - Add your `google-services.json` to `android/app/`
   - Add your `GoogleService-Info.plist` to `ios/Runner/`
   - Update `firebase_options.dart` with your Firebase config

4. Run the app
```bash
flutter run
```

## 📦 Dependencies

```yaml
dependencies:
  flutter:
    sdk: flutter
  firebase_core: ^3.10.0
  cloud_firestore: ^5.6.12
  firebase_storage: ^12.3.8
  image_picker: ^1.0.7
```

## 🏗️ Project Structure

```
lib/
  ├── main.dart              # Main app entry point
  ├── firebase_options.dart  # Firebase configuration
  └── (features organized by functionality)
```

## 🎯 Future Enhancements

- Filter by threat level and status
- Grid view option
- Statistics dashboard
- Export to PDF
- Offline mode with sync
- Map integration for locations
- Multi-user collaboration

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Developer

Built with ❤️ using Flutter

---

⭐ Star this repo if you find it useful!
