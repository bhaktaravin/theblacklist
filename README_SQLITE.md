# The Blacklist iOS App

A React Native Expo app based on the TV show "The Blacklist" featuring a complete criminal database with SQLite integration.

## Features

### 🎯 **Core Functionality**
- **SQLite Database**: Persistent local storage for all data
- **CRUD Operations**: Create, Read, Update, and Delete criminals and characters
- **Real-time Updates**: All changes are immediately reflected in the UI

### 🏠 **Home Screen ("Task Force")**
- Dark, professional theme matching the show's aesthetic
- FBI Task Force welcome with Red's signature quotes
- Navigation to main features

### 📋 **Blacklist Database Screen**
- Complete criminal profiles with:
  - Blacklist numbers
  - Names and aliases
  - Status indicators (Active, Captured, Deceased, Unknown)
  - Threat levels (Low, Medium, High, Extreme)
  - Crime listings
  - Last known locations
- **Interactive Features**:
  - **Tap**: View full criminal details
  - **Long Press**: Quick edit/delete menu
  - **Add Button**: Create new criminal entries
  - **Edit Form**: Full-featured editing interface

### 👥 **Character Profiles (Modal)**
- FBI Task Force personnel database
- Key characters from the show
- Role, affiliation, and background information

## SQLite Integration

### Database Structure
- **`blacklist_criminals`** table with all criminal data
- **`characters`** table with FBI personnel
- Automatic initialization with show data
- JSON storage for arrays (aliases, crimes, skills)

### Available Operations
- **Add New Criminal**: Fill out the form and save
- **Edit Criminal**: Tap "Edit" from the detail view or use long press menu
- **Delete Criminal**: Available in the edit form or long press menu
- **View All**: Automatically loads from database on app start

## How to Use

### Adding a New Criminal
1. Go to the "Blacklist" tab
2. Tap the "+ Add New Criminal" button
3. Fill out the form:
   - **Blacklist Number**: Must be unique
   - **Name**: Required
   - **Aliases**: Comma-separated list
   - **Status**: Select from Active, Captured, Deceased, Unknown
   - **Threat Level**: Select from Low, Medium, High, Extreme
   - **Description**: Detailed background
   - **Crimes**: Comma-separated list
   - **Last Known Location**: Optional
4. Tap "Save"

### Editing/Deleting Criminals
1. **Quick Actions**: Long press any criminal card for edit/delete menu
2. **Detailed View**: Tap a criminal card, then tap "Edit"
3. **Edit Form**: Make changes and tap "Save" or "Delete"

### Data Persistence
- All data is stored locally in SQLite
- No internet connection required
- Data persists between app sessions
- Initial data is automatically seeded on first run

## Technical Features

- **React Native Expo SDK 54**
- **expo-sqlite** for database operations
- **TypeScript** for type safety
- **Custom UI Components** with Blacklist theming
- **Responsive Design** for various screen sizes

## Color Scheme
- **Primary**: Dark blacks (#0a0a0a, #1a1a1a)
- **Accent**: Blacklist red (#ff4444)
- **Text**: White (#ffffff) and light grays (#cccccc, #e0e0e0)
- **Status Colors**: Green (captured), Red (active), Gray (deceased), Orange (unknown)

## Running the App

```bash
cd /Users/ravin/theblacklist
npm start

# Then:
# Press 'i' for iOS simulator
# Press 'w' for web version
# Scan QR code for physical device
```

## File Structure

```
app/
├── (tabs)/
│   ├── index.tsx          # Home screen
│   ├── explore.tsx        # Blacklist database (with CRUD)
│   └── _layout.tsx        # Tab navigation
├── modal.tsx              # Character profiles
components/
├── CriminalEditForm.tsx   # Edit/Add criminal form
└── [other UI components]
database/
└── database.ts            # SQLite service layer
```

## Future Enhancements

- Search and filter functionality
- Export data capabilities  
- Image support for criminals
- Case file attachments
- Push notifications for "new cases"
- Sync between devices
- Advanced reporting features

---

**"Everyone has secrets..."** - Raymond Reddington