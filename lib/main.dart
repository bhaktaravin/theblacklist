import 'dart:io';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  runApp(const MyApp());
}

// Detail Page with enhanced information
class DetailPage extends StatelessWidget {
  final String docId;
  final Map<String, dynamic> item;

  const DetailPage({
    super.key,
    required this.docId,
    required this.item,
  });

  @override
  Widget build(BuildContext context) {
    final number = item['number'] ?? 0;
    final name = item['name'] ?? 'Unknown';
    final description = item['description'] ?? 'No description available';
    final status = item['status'] ?? 'At Large';
    final threatLevel = item['threatLevel'] ?? 'Medium';
    final episode = item['episode'] ?? 'Unknown';
    final alias = item['alias'] ?? '';
    final location = item['location'] ?? '';
    final photoUrl = item['photoUrl'];

    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Text('#$number'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () => _showEditDialog(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero Avatar Section
            Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Hero(
                  tag: 'avatar_$docId',
                  child: photoUrl != null
                      ? Container(
                          width: 120,
                          height: 120,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: _getThreatLevelColor(threatLevel),
                              width: 4,
                            ),
                            image: DecorationImage(
                              image: NetworkImage(photoUrl),
                              fit: BoxFit.cover,
                            ),
                          ),
                        )
                      : CircleAvatar(
                          radius: 60,
                          backgroundColor: _getThreatLevelColor(threatLevel),
                          child: Text(
                            '#$number',
                            style: const TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                ),
              ),

              child: Text(
                name,
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Colors.red.shade700,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            
            const SizedBox(height: 24),
            
            // Status & Threat Level Row
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildInfoChip(
                    'Status',
                    status,
                    _getStatusColor(status),
                  ),
                  _buildInfoChip(
                    'Threat',
                    threatLevel,
                    _getThreatLevelColor(threatLevel),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            
            // Information Cards
            _buildInfoSection('Episode', episode, Icons.tv),
            if (alias.isNotEmpty)
              _buildInfoSection('Known Aliases', alias, Icons.person_outline),
            if (location.isNotEmpty)
              _buildInfoSection('Last Known Location', location, Icons.location_on),
            _buildInfoSection('Description', description, Icons.description),
            
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoChip(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey.shade500,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoSection(String title, String content, IconData icon) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
      child: Card(
        color: Colors.grey.shade900,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(icon, color: Colors.red.shade700, size: 20),
                  const SizedBox(width: 8),
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.red.shade700,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                content,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey.shade300,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Captured':
        return Colors.green.shade800;
      case 'Deceased':
        return Colors.grey.shade700;
      case 'At Large':
      default:
        return Colors.orange.shade900;
    }
  }

  Color _getThreatLevelColor(String threatLevel) {
    switch (threatLevel) {
      case 'Critical':
        return Colors.red.shade900;
      case 'High':
        return Colors.orange.shade900;
      case 'Medium':
        return Colors.yellow.shade900;
      case 'Low':
        return Colors.green.shade900;
      default:
        return Colors.grey.shade800;
    }
  }

  void _showEditDialog(BuildContext context) {
    final nameController = TextEditingController(text: item['name']);
    final numberController = TextEditingController(text: item['number']?.toString());
    final descriptionController = TextEditingController(text: item['description']);
    final episodeController = TextEditingController(text: item['episode']);
    final aliasController = TextEditingController(text: item['alias']);
    final locationController = TextEditingController(text: item['location']);
    String selectedStatus = item['status'] ?? 'At Large';
    String selectedThreatLevel = item['threatLevel'] ?? 'Medium';
    File? selectedImage;
    final ImagePicker picker = ImagePicker();

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('Edit Entry'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: numberController,
                  decoration: const InputDecoration(
                    labelText: 'Blacklist Number',
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'Name',
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: descriptionController,
                  decoration: const InputDecoration(
                    labelText: 'Description',
                  ),
                  maxLines: 2,
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: episodeController,
                  decoration: const InputDecoration(
                    labelText: 'Episode',
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: aliasController,
                  decoration: const InputDecoration(
                    labelText: 'Known Aliases',
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: locationController,
                  decoration: const InputDecoration(
                    labelText: 'Last Known Location',
                  ),
                ),
                const SizedBox(height: 16),
                // Photo Picker for Edit
                Column(
                  children: [
                    if (item['photoUrl'] != null)
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          item['photoUrl'],
                          height: 100,
                          width: 100,
                          fit: BoxFit.cover,
                        ),
                      ),
                    const SizedBox(height: 8),
                    ElevatedButton.icon(
                      onPressed: () async {
                        final XFile? image = await picker.pickImage(
                          source: ImageSource.gallery,
                          maxWidth: 1024,
                          maxHeight: 1024,
                          imageQuality: 85,
                        );
                        if (image != null) {
                          setState(() {
                            selectedImage = File(image.path);
                          });
                        }
                      },
                      icon: const Icon(Icons.photo_camera),
                      label: Text(selectedImage == null 
                          ? (item['photoUrl'] != null ? 'Change Photo' : 'Add Photo')
                          : 'New Photo Selected'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey.shade800,
                      ),
                    ),
                    if (selectedImage != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 8.0),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.file(
                            selectedImage!,
                            height: 100,
                            width: 100,
                            fit: BoxFit.cover,
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  initialValue: selectedStatus,
                  decoration: const InputDecoration(
                    labelText: 'Status',
                  ),
                  items: ['At Large', 'Captured', 'Deceased']
                      .map((status) => DropdownMenuItem(
                            value: status,
                            child: Text(status),
                          ))
                      .toList(),
                  onChanged: (value) {
                    setState(() {
                      selectedStatus = value!;
                    });
                  },
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  initialValue: selectedThreatLevel,
                  decoration: const InputDecoration(
                    labelText: 'Threat Level',
                  ),
                  items: ['Critical', 'High', 'Medium', 'Low']
                      .map((level) => DropdownMenuItem(
                            value: level,
                            child: Text(level),
                          ))
                      .toList(),
                  onChanged: (value) {
                    setState(() {
                      selectedThreatLevel = value!;
                    });
                  },
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () async {
                final number = int.tryParse(numberController.text) ?? 0;
                if (nameController.text.isNotEmpty) {
                  // Show loading
                  Navigator.pop(context);
                  showDialog(
                    context: context,
                    barrierDismissible: false,
                    builder: (context) => const Center(
                      child: CircularProgressIndicator(),
                    ),
                  );

                  String? photoUrl = item['photoUrl'];
                  
                  // Upload new photo if selected
                  if (selectedImage != null) {
                    try {
                      final fileName = 'criminals/${DateTime.now().millisecondsSinceEpoch}.jpg';
                      final ref = FirebaseStorage.instance.ref().child(fileName);
                      await ref.putFile(selectedImage!);
                      photoUrl = await ref.getDownloadURL();
                    } catch (e) {
                      // Handle error
                    }
                  }

                  final updateData = {
                    'number': number,
                    'name': nameController.text,
                    'description': descriptionController.text,
                    'episode': episodeController.text,
                    'alias': aliasController.text,
                    'location': locationController.text,
                    'status': selectedStatus,
                    'threatLevel': selectedThreatLevel,
                  };
                  
                  if (photoUrl != null) {
                    updateData['photoUrl'] = photoUrl;
                  }

                  await FirebaseFirestore.instance.collection('blacklist').doc(docId).update(updateData);
                  
                  if (context.mounted) {
                    Navigator.pop(context); // Close loading
                    Navigator.pop(context); // Go back to list
                  }
                }
              },
              child: const Text('Save'),
            ),
          ],
        ),
      ),
    );
  }
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'The Blacklist',
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(
        colorScheme: ColorScheme.dark(
          primary: Colors.red.shade900,
          secondary: Colors.red.shade700,
          surface: Colors.black,
          error: Colors.red,
        ),
        scaffoldBackgroundColor: Colors.black,
        cardColor: Colors.grey.shade900,
        appBarTheme: AppBarTheme(
          backgroundColor: Colors.black,
          foregroundColor: Colors.red.shade700,
          elevation: 0,
        ),
        floatingActionButtonTheme: FloatingActionButtonThemeData(
          backgroundColor: Colors.red.shade900,
          foregroundColor: Colors.white,
        ),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'The Blacklist'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  final String title;

  const MyHomePage({super.key, required this.title});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  String _searchQuery = '';
  final TextEditingController _searchController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.title,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
          ),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              controller: _searchController,
              onChanged: (value) {
                setState(() {
                  _searchQuery = value.toLowerCase();
                });
              },
              decoration: InputDecoration(
                hintText: 'Search by name or number...',
                prefixIcon: Icon(Icons.search, color: Colors.red.shade700),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          setState(() {
                            _searchController.clear();
                            _searchQuery = '';
                          });
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade700),
                ),
                filled: true,
                fillColor: Colors.grey.shade900,
              ),
            ),
          ),
          // List
          Expanded(
            child: StreamBuilder<QuerySnapshot>(
              stream: FirebaseFirestore.instance
                  .collection('blacklist')
                  .orderBy('number')
                  .snapshots(),
              builder: (context, snapshot) {
          if (snapshot.hasError) {
            return const Center(child: Text('Something went wrong'));
          }

          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(
              child: CircularProgressIndicator(
                color: Colors.red.shade700,
              ),
            );
          }

          final allItems = snapshot.data?.docs ?? [];
          
          // Filter items based on search query
          final items = allItems.where((doc) {
            if (_searchQuery.isEmpty) return true;
            final item = doc.data() as Map<String, dynamic>;
            final name = (item['name'] ?? '').toString().toLowerCase();
            final number = (item['number'] ?? 0).toString();
            return name.contains(_searchQuery) || number.contains(_searchQuery);
          }).toList();

          if (items.isEmpty && _searchQuery.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.folder_open,
                    size: 80,
                    color: Colors.grey.shade700,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No Criminals Yet',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.red.shade700,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Tap the + button to add your first entry',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey.shade500,
                    ),
                  ),
                ],
              ),
            );
          }

          if (items.isEmpty && _searchQuery.isNotEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.search_off,
                    size: 80,
                    color: Colors.grey.shade700,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No Results Found',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.red.shade700,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Try a different search term',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey.shade500,
                    ),
                  ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async {
              await Future.delayed(const Duration(milliseconds: 500));
            },
            color: Colors.red.shade700,
            child: ListView.builder(
              physics: const AlwaysScrollableScrollPhysics(),
              itemCount: items.length,
              itemBuilder: (context, index) {
                try {
                  final item = items[index].data() as Map<String, dynamic>;
                  final docId = items[index].id;
                  final number = item['number'] ?? 0;
                  final name = item['name'] ?? 'Unknown';
                  final description = item['description'] ?? '';
                  final status = item['status'] ?? 'At Large';
                  final threatLevel = item['threatLevel'] ?? 'Medium';
                
                return Dismissible(
                  key: Key(docId),
                  direction: DismissDirection.endToStart,
                  confirmDismiss: (direction) async {
                    return await showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: const Text('Confirm Delete'),
                        content: Text('Remove $name from the blacklist?'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context, false),
                            child: const Text('Cancel'),
                          ),
                          TextButton(
                            onPressed: () => Navigator.pop(context, true),
                            child: Text(
                              'Delete',
                              style: TextStyle(color: Colors.red.shade700),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                  background: Container(
                    color: Colors.red.shade900,
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.only(right: 16),
                    child: const Icon(Icons.delete, color: Colors.white),
                  ),
                  onDismissed: (direction) {
                    items[index].reference.delete();
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('$name removed from blacklist'),
                        backgroundColor: Colors.red.shade900,
                        duration: const Duration(seconds: 2),
                      ),
                    );
                  },
                  child: Material(
                    color: Colors.transparent,
                    child: Card(
                      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      color: Colors.grey.shade900,
                      elevation: 2,
                      child: ListTile(
                        onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => DetailPage(
                                  docId: docId,
                                  item: item,
                                ),
                              ),
                            );
                          },
                          leading: Hero(
                            tag: 'avatar_$docId',
                            child: CircleAvatar(
                              backgroundColor: _getThreatLevelColor(threatLevel),
                              backgroundImage: item['photoUrl'] != null && item['photoUrl'].toString().isNotEmpty
                                  ? NetworkImage(item['photoUrl'].toString())
                                  : null,
                              child: item['photoUrl'] == null || item['photoUrl'].toString().isEmpty
                                  ? Text(
                                      '#$number',
                                      style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    )
                                  : null,
                            ),
                          ),
                          title: Row(
                            children: [
                              Expanded(
                                child: Text(
                                  name,
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    color: Colors.red.shade700,
                                  ),
                                ),
                              ),
                              _buildStatusChip(status),
                            ],
                          ),
                          subtitle: description.isNotEmpty
                              ? Text(
                                  description,
                                  style: TextStyle(color: Colors.grey.shade400),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                )
                              : null,
                          trailing: Icon(
                            Icons.chevron_right,
                            color: Colors.grey.shade600,
                          ),
                        ),
                      ),
                    ),
                  ),
                )
                } catch (e) {
                  // If there's an error rendering this item, show a simple error card
                  return Card(
                    margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    color: Colors.red.shade900,
                    child: ListTile(
                      title: Text('Error loading item: ${e.toString()}'),
                    ),
                  );
                }
              },
            ),
          );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddDialog(context),
        tooltip: 'Add Criminal',
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildStatusChip(String status) {
    Color chipColor;
    Color textColor = Colors.white;
    
    switch (status) {
      case 'Captured':
        chipColor = Colors.green.shade800;
        break;
      case 'Deceased':
        chipColor = Colors.grey.shade700;
        break;
      case 'At Large':
      default:
        chipColor = Colors.orange.shade900;
    }
    
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: chipColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        status,
        style: TextStyle(
          color: textColor,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Color _getThreatLevelColor(String threatLevel) {
    switch (threatLevel) {
      case 'Critical':
        return Colors.red.shade900;
      case 'High':
        return Colors.orange.shade900;
      case 'Medium':
        return Colors.yellow.shade900;
      case 'Low':
        return Colors.green.shade900;
      default:
        return Colors.grey.shade800;
    }
  }

  void _showAddDialog(BuildContext context) {
    final nameController = TextEditingController();
    final numberController = TextEditingController();
    final descriptionController = TextEditingController();
    final episodeController = TextEditingController();
    final aliasController = TextEditingController();
    final locationController = TextEditingController();
    String? selectedStatus;
    String? selectedThreatLevel;
    File? selectedImage;
    final ImagePicker picker = ImagePicker();
    
    // Save the scaffold messenger for later use
    final scaffoldMessenger = ScaffoldMessenger.of(context);

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('Add to Blacklist'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: numberController,
                  decoration: const InputDecoration(
                    labelText: 'Blacklist Number',
                    hintText: 'e.g., 1',
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'Name',
                    hintText: 'e.g., Raymond Reddington',
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: descriptionController,
                  decoration: const InputDecoration(
                    labelText: 'Description (optional)',
                    hintText: 'Brief description',
                  ),
                  maxLines: 2,
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: episodeController,
                  decoration: const InputDecoration(
                    labelText: 'Episode (optional)',
                    hintText: 'e.g., S1E1',
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: aliasController,
                  decoration: const InputDecoration(
                    labelText: 'Known Aliases (optional)',
                    hintText: 'e.g., Red, Concierge of Crime',
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: locationController,
                  decoration: const InputDecoration(
                    labelText: 'Last Known Location (optional)',
                    hintText: 'e.g., Washington DC',
                  ),
                ),
                const SizedBox(height: 16),
                // Photo Picker
                ElevatedButton.icon(
                  onPressed: () async {
                    final XFile? image = await picker.pickImage(
                      source: ImageSource.gallery,
                      maxWidth: 1024,
                      maxHeight: 1024,
                      imageQuality: 85,
                    );
                    if (image != null) {
                      setState(() {
                        selectedImage = File(image.path);
                      });
                    }
                  },
                  icon: const Icon(Icons.photo_camera),
                  label: Text(selectedImage == null ? 'Add Photo' : 'Photo Selected'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.grey.shade800,
                  ),
                ),
                if (selectedImage != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.file(
                        selectedImage!,
                        height: 100,
                        width: 100,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String?>(
                  initialValue: selectedStatus,
                  decoration: const InputDecoration(
                    labelText: 'Status (optional)',
                  ),
                  items: [
                    const DropdownMenuItem(value: null, child: Text('Not Set')),
                    ...['At Large', 'Captured', 'Deceased']
                        .map((status) => DropdownMenuItem(
                              value: status,
                              child: Text(status),
                            ))
                  ],
                  onChanged: (value) {
                    setState(() {
                      selectedStatus = value;
                    });
                  },
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String?>(
                  initialValue: selectedThreatLevel,
                  decoration: const InputDecoration(
                    labelText: 'Threat Level (optional)',
                  ),
                  items: [
                    const DropdownMenuItem(value: null, child: Text('Not Set')),
                    ...['Critical', 'High', 'Medium', 'Low']
                        .map((level) => DropdownMenuItem(
                              value: level,
                              child: Text(level),
                            ))
                  ],
                  onChanged: (value) {
                    setState(() {
                      selectedThreatLevel = value;
                    });
                  },
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () async {
                final number = int.tryParse(numberController.text) ?? 0;
                if (nameController.text.isNotEmpty) {
                  // Close the add dialog first
                  Navigator.of(context).pop();
                  
                  // Show loading
                  showDialog(
                    context: context,
                    barrierDismissible: false,
                    builder: (BuildContext dialogContext) => WillPopScope(
                      onWillPop: () async => false,
                      child: const Center(
                        child: CircularProgressIndicator(),
                      ),
                    ),
                  );

                  try {
                    String? photoUrl;
                    
                    // Upload photo if selected
                    if (selectedImage != null) {
                      final fileName = 'criminals/${DateTime.now().millisecondsSinceEpoch}.jpg';
                      final ref = FirebaseStorage.instance.ref().child(fileName);
                      await ref.putFile(selectedImage!);
                      photoUrl = await ref.getDownloadURL();
                    }

                    final data = <String, dynamic>{
                      'number': number,
                      'name': nameController.text,
                      'description': descriptionController.text,
                      'episode': episodeController.text,
                      'alias': aliasController.text,
                      'location': locationController.text,
                      'timestamp': FieldValue.serverTimestamp(),
                    };
                    
                    if (selectedStatus?.isNotEmpty ?? false) {
                      data['status'] = selectedStatus;
                    }
                    if (selectedThreatLevel?.isNotEmpty ?? false) {
                      data['threatLevel'] = selectedThreatLevel;
                    }
                    if (photoUrl != null) {
                      data['photoUrl'] = photoUrl;
                    }
                    
                    await FirebaseFirestore.instance.collection('blacklist').add(data);
                    
                    // Close loading dialog
                    Navigator.of(context).pop();
                    
                    // Show success message
                    scaffoldMessenger.showSnackBar(
                      SnackBar(
                        content: Text('${nameController.text} added to blacklist'),
                        backgroundColor: Colors.green.shade900,
                      ),
                    );
                  } catch (e) {
                    // Close loading dialog
                    Navigator.of(context).pop();
                    
                    // Show error message
                    scaffoldMessenger.showSnackBar(
                      SnackBar(
                        content: Text('Error: ${e.toString()}'),
                        backgroundColor: Colors.red.shade900,
                        duration: const Duration(seconds: 5),
                      ),
                    );
                  }
                }
              },
              child: const Text('Add'),
            ),
          ],
        ),
      ),
    );
  }
}
