# Crimson Dossier

A cross-platform Flutter app for tracking **original** case files: numbered dossiers, status, threat level, references, aliases, locations, and optional photos. Data is stored in **Firebase** (Firestore + Storage).

## Firestore

Documents live in the collection **`casefiles`** (see `kDossierCollection` in `lib/main.dart`). If you previously used another collection name, copy or migrate those documents in the [Firebase Console](https://console.firebase.google.com/) or with a one-time script.

## Bundle IDs

Android and iOS **do not have to use the same string**; Firebase only requires each platform’s ID to match what you registered for that app.

- **Android** `applicationId` / Kotlin namespace: **`com.example.crimson_dossier`** (underscore — allowed in Firebase for your Android app).
- **iOS** (and macOS host): **`com.example.crimsondossier`** (no underscore — matches what Firebase accepted when creating the iOS app). Test bundle: **`com.example.crimsondossier.RunnerTests`**.

The Dart package name in `pubspec.yaml` remains **`crimson_dossier`**; that is only the Pub package name.

Keep **`android/app/google-services.json`** aligned with the **Android** package above, and **`ios/Runner/GoogleService-Info.plist`** with the **iOS** bundle above (re-download from Firebase if you change either). Run **`flutterfire configure`** so **`lib/firebase_options.dart`** lists the correct options per platform.

## Getting started

```bash
cd E:\Code\theblacklist   # or your clone path
flutter pub get
flutter run
```

Configure `lib/firebase_options.dart` and platform Firebase config files using [FlutterFire CLI](https://firebase.flutter.dev/docs/cli/) if this is a fresh checkout.
