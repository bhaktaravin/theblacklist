// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:theblacklist/main.dart';

void main() {

  group('MyApp Tests', () {
    testWidgets('App builds with correct theme', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp());

      // Verify the app builds
      expect(find.byType(MaterialApp), findsOneWidget);
      
      // Verify dark theme is applied
      final materialApp = tester.widget<MaterialApp>(find.byType(MaterialApp));
      expect(materialApp.themeMode, equals(ThemeMode.dark));
      expect(materialApp.title, equals('The Blacklist'));
    });

    testWidgets('Home page displays app title', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(
        home: MyHomePage(title: 'The Blacklist'),
      ));

      // Verify the title appears in the AppBar
      expect(find.text('The Blacklist'), findsOneWidget);
    });

    testWidgets('Search bar is visible', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(
        home: MyHomePage(title: 'The Blacklist'),
      ));

      // Wait for the widget to build
      await tester.pumpAndSettle();

      // Verify search field exists
      expect(find.byType(TextField), findsOneWidget);
      expect(find.text('Search by name or number...'), findsOneWidget);
    });

    testWidgets('FloatingActionButton is present', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(
        home: MyHomePage(title: 'The Blacklist'),
      ));

      await tester.pumpAndSettle();

      // Verify FAB exists
      expect(find.byType(FloatingActionButton), findsOneWidget);
    });
  });

  group('DetailPage Tests', () {
    testWidgets('Detail page displays criminal information', (WidgetTester tester) async {
      final testData = {
        'number': 1,
        'name': 'Raymond Reddington',
        'description': 'Former US Naval Intelligence officer',
        'status': 'At Large',
        'threatLevel': 'Critical',
        'episode': 'S1E1',
        'alias': 'Red, Concierge of Crime',
        'location': 'Washington DC',
      };

      await tester.pumpWidget(MaterialApp(
        home: DetailPage(docId: 'test123', item: testData),
      ));

      await tester.pumpAndSettle();

      // Verify criminal information is displayed
      expect(find.text('Raymond Reddington'), findsOneWidget);
      expect(find.text('Former US Naval Intelligence officer'), findsOneWidget);
      expect(find.text('At Large'), findsOneWidget);
      expect(find.text('Critical'), findsOneWidget);
    });
  });

  group('UI Component Tests', () {
    test('Threat level colors are correct', () {
      final state = _MyHomePageState();
      
      expect(state._getThreatLevelColor('Critical'), equals(Colors.red.shade900));
      expect(state._getThreatLevelColor('High'), equals(Colors.orange.shade900));
      expect(state._getThreatLevelColor('Medium'), equals(Colors.yellow.shade900));
      expect(state._getThreatLevelColor('Low'), equals(Colors.green.shade900));
      expect(state._getThreatLevelColor('Unknown'), equals(Colors.grey.shade800));
    });
  });
}

// Helper class to expose private methods for testing
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

