import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'theme/emergency_theme.dart';
import 'screens/login_screen.dart';
import 'services/notification_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  try {
    await dotenv.load(fileName: ".env");
    print('Environment loaded successfully');
  } catch (e) {
    print('Warning: Could not load .env file: $e');
    print('Continuing with default configuration...');
  }
  
  // Initialize notification service
  await NotificationService.init();
  
  runApp(const SafeTravelApp());
}

class SafeTravelApp extends StatelessWidget {
  const SafeTravelApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Safer',
      theme: EmergencyTheme.lightTheme,
      darkTheme: EmergencyTheme.darkTheme,
      themeMode: ThemeMode.system, // Follows system theme
      debugShowCheckedModeBanner: false,
      home: const LoginScreen(),
    );
  }
}
