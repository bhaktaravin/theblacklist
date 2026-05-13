import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';

import 'firebase_options.dart';

/// Must match [kDossierCollection] in `main.dart`.
const String kDossierCollection = 'casefiles';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(MyApp(firestore: FirebaseFirestore.instance));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key, required this.firestore});

  final FirebaseFirestore firestore;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Crimson Dossier',
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
      home: MyHomePage(title: 'Crimson Dossier', firestore: firestore),
    );
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({super.key, required this.title, required this.firestore});

  final String title;
  final FirebaseFirestore firestore;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          title,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            letterSpacing: 1.2,
          ),
        ),
        centerTitle: true,
      ),
      body: StreamBuilder<QuerySnapshot>(
        stream: firestore
            .collection(kDossierCollection)
            .orderBy('number')
            .snapshots(),
        builder: (context, snapshot) {
          if (snapshot.hasError) {
            return const Center(child: Text('Something went wrong'));
          }

          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          final items = snapshot.data?.docs ?? [];

          if (items.isEmpty) {
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
                    'No case files yet',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.red.shade700,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Tap the + button to add your first entry',
                    style: TextStyle(fontSize: 16, color: Colors.grey.shade500),
                  ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async {
              // Force refresh by waiting a moment
              await Future.delayed(const Duration(milliseconds: 500));
            },
            color: Colors.red.shade700,
            child: ListView.builder(
              physics: const AlwaysScrollableScrollPhysics(),
              itemCount: items.length,
              itemBuilder: (context, index) {
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
                        content: Text('Delete case file for $name?'),
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
                        content: Text('$name removed from archive'),
                        backgroundColor: Colors.red.shade900,
                        duration: const Duration(seconds: 2),
                      ),
                    );
                  },
                  child: Hero(
                    tag: 'casefile_$docId',
                    child: Material(
                      color: Colors.transparent,
                      child: Card(
                        margin: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        color: Colors.grey.shade900,
                        elevation: 2,
                        child: ListTile(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) =>
                                    DetailPage(docId: docId, item: item),
                              ),
                            );
                          },
                          leading: Hero(
                            tag: 'avatar_$docId',
                            child: CircleAvatar(
                              backgroundColor: _getThreatLevelColor(
                                threatLevel,
                              ),
                              child: Text(
                                '#$number',
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
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
                );
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddDialog(context),
        tooltip: 'Add case file',
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
    String selectedStatus = 'At Large';

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: const Text('New case file'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: numberController,
                  decoration: const InputDecoration(
                    labelText: 'Dossier number',
                    hintText: 'e.g., 1',
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(
                    labelText: 'Name',
                    hintText: 'e.g., Morgan Vale',
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
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  initialValue: selectedStatus,
                  decoration: const InputDecoration(labelText: 'Status'),
                  items: ['At Large', 'Captured', 'Deceased']
                      .map(
                        (status) => DropdownMenuItem(
                          value: status,
                          child: Text(status),
                        ),
                      )
                      .toList(),
                  onChanged: (value) {
                    setState(() {
                      selectedStatus = value!;
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
              onPressed: () {
                final number = int.tryParse(numberController.text) ?? 0;
                if (nameController.text.isNotEmpty) {
                  FirebaseFirestore.instance
                      .collection(kDossierCollection)
                      .add({
                        'number': number,
                        'name': nameController.text,
                        'description': descriptionController.text,
                        'status': selectedStatus,
                        'timestamp': FieldValue.serverTimestamp(),
                      });
                  Navigator.pop(context);
                }
              },
              child: const Text('Add'),
            ),
          ],
        ),
      ),
    );
  }

  void _showEditDialog(
    BuildContext context,
    String docId,
    Map<String, dynamic> item,
  ) {
    final nameController = TextEditingController(text: item['name']);
    final numberController = TextEditingController(
      text: item['number']?.toString(),
    );
    final descriptionController = TextEditingController(
      text: item['description'],
    );
    String selectedStatus = item['status'] ?? 'At Large';

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
                    labelText: 'Dossier number',
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: nameController,
                  decoration: const InputDecoration(labelText: 'Name'),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: descriptionController,
                  decoration: const InputDecoration(
                    labelText: 'Description (optional)',
                  ),
                  maxLines: 2,
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  initialValue: selectedStatus,
                  decoration: const InputDecoration(labelText: 'Status'),
                  items: ['At Large', 'Captured', 'Deceased']
                      .map(
                        (status) => DropdownMenuItem(
                          value: status,
                          child: Text(status),
                        ),
                      )
                      .toList(),
                  onChanged: (value) {
                    setState(() {
                      selectedStatus = value!;
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
              onPressed: () {
                final number = int.tryParse(numberController.text) ?? 0;
                if (nameController.text.isNotEmpty) {
                  FirebaseFirestore.instance
                      .collection(kDossierCollection)
                      .doc(docId)
                      .update({
                        'number': number,
                        'name': nameController.text,
                        'description': descriptionController.text,
                        'status': selectedStatus,
                      });
                  Navigator.pop(context);
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

/// Minimal placeholder so this backup snapshot compiles if analyzed alone.
class DetailPage extends StatelessWidget {
  const DetailPage({super.key, required this.docId, required this.item});

  final String docId;
  final Map<String, dynamic> item;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(item['name']?.toString() ?? 'Entry')),
      body: const Center(child: Text('Backup snapshot — use main.dart')),
    );
  }
}
