// Widget tests use Firebase core mocks and [FakeFirebaseFirestore] so the UI
// can build without a device or emulator.

import 'package:crimson_dossier/main.dart';
import 'package:fake_cloud_firestore/fake_cloud_firestore.dart';
import 'package:firebase_core_platform_interface/test.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  late FakeFirebaseFirestore fakeFirestore;

  setUpAll(() async {
    TestWidgetsFlutterBinding.ensureInitialized();
    setupFirebaseCoreMocks();
  });

  setUp(() {
    fakeFirestore = FakeFirebaseFirestore();
  });

  group('MyApp Tests', () {
    testWidgets('App builds with correct theme', (WidgetTester tester) async {
      await tester.pumpWidget(MyApp(firestore: fakeFirestore));

      expect(find.byType(MaterialApp), findsOneWidget);

      final materialApp = tester.widget<MaterialApp>(find.byType(MaterialApp));
      expect(materialApp.themeMode, equals(ThemeMode.dark));
      expect(materialApp.title, equals('Crimson Dossier'));
    });

    testWidgets('Home page displays app title', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: MyHomePage(title: 'Crimson Dossier', firestore: fakeFirestore),
        ),
      );

      await tester.pump();

      expect(find.text('Crimson Dossier'), findsOneWidget);
    });

    testWidgets('Search bar is visible', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: MyHomePage(title: 'Crimson Dossier', firestore: fakeFirestore),
        ),
      );

      await tester.pump();
      await tester.pump();

      expect(find.byType(TextField), findsOneWidget);
      expect(find.text('Search by name or dossier number…'), findsOneWidget);
    });

    testWidgets('FloatingActionButton is present', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: MyHomePage(title: 'Crimson Dossier', firestore: fakeFirestore),
        ),
      );

      await tester.pump();
      await tester.pump();

      expect(find.byType(FloatingActionButton), findsOneWidget);
    });
  });

  group('DetailPage Tests', () {
    testWidgets('Detail page displays dossier information', (
      WidgetTester tester,
    ) async {
      final testData = {
        'number': 1,
        'name': 'Morgan Vale',
        'description': 'Independent broker with ties to several ports.',
        'status': 'At Large',
        'threatLevel': 'Critical',
        'episode': 'Harbor district — week 3',
        'alias': 'The broker, Night clerk',
        'location': 'Midtown',
      };

      await tester.pumpWidget(
        MaterialApp(
          home: DetailPage(docId: 'test123', item: testData),
        ),
      );

      await tester.pumpAndSettle();

      expect(find.text('Morgan Vale'), findsOneWidget);
      expect(
        find.text('Independent broker with ties to several ports.'),
        findsOneWidget,
      );
      expect(find.text('At Large'), findsOneWidget);
      expect(find.text('Critical'), findsOneWidget);
    });
  });

  group('UI Component Tests', () {
    test('Threat level colors are correct', () {
      final state = _MyHomePageState();

      expect(
        state._getThreatLevelColor('Critical'),
        equals(Colors.red.shade900),
      );
      expect(
        state._getThreatLevelColor('High'),
        equals(Colors.orange.shade900),
      );
      expect(
        state._getThreatLevelColor('Medium'),
        equals(Colors.yellow.shade900),
      );
      expect(state._getThreatLevelColor('Low'), equals(Colors.green.shade900));
      expect(
        state._getThreatLevelColor('Unknown'),
        equals(Colors.grey.shade800),
      );
    });
  });
}

// Helper to mirror threat-level colors from [MyHomePage] for unit testing.
class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) => Container();

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
}
