import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../theme/emergency_theme.dart';
import 'enhanced_dashboard_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with TickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;
  
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  
  bool _isLoading = false;
  bool _obscurePassword = true;
  String? _error;

  // Hardcoded credentials for demo
  final Map<String, String> _validCredentials = {
    'tourist@safetravel.com': 'tourist123',
    'admin@safetravel.com': 'admin123',
    'user@example.com': 'password123',
    'demo@demo.com': 'demo123',
  };

  @override
  void initState() {
    super.initState();
    _setupAnimations();
    _checkExistingAuth();
  }

  void _setupAnimations() {
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeIn,
    ));

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.3),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeOut,
    ));

    _animationController.forward();
  }

  Future<void> _checkExistingAuth() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final isLoggedIn = prefs.getBool('is_logged_in') ?? false;
      
      if (isLoggedIn && mounted) {
        // Auto navigate to dashboard if already logged in
        _navigateToMainApp();
      }
    } catch (error) {
      debugPrint('Auth check error: $error');
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              EmergencyColorPalette.primary[500]!.withOpacity(0.1),
              Colors.white,
            ],
          ),
        ),
        child: SafeArea(
          child: FadeTransition(
            opacity: _fadeAnimation,
            child: SlideTransition(
              position: _slideAnimation,
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Logo Section
                      Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          color: EmergencyColorPalette.primary[500],
                          borderRadius: BorderRadius.circular(24),
                          boxShadow: [
                            BoxShadow(
                              color: EmergencyColorPalette.primary[500]!.withOpacity(0.3),
                              blurRadius: 20,
                              spreadRadius: 5,
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.security,
                          size: 60,
                          color: Colors.white,
                        ),
                      ),

                      const SizedBox(height: 32),

                      // App Title
                      Text(
                        'Safe Travel',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: EmergencyColorPalette.primary[500],
                        ),
                      ),

                      const SizedBox(height: 8),

                      Text(
                        'Your Smart Tourist Safety Companion',
                        style: TextStyle(
                          fontSize: 16,
                          color: EmergencyColorPalette.neutral[600],
                        ),
                        textAlign: TextAlign.center,
                      ),

                      const SizedBox(height: 48),

                      // Demo Credentials Card
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: EmergencyColorPalette.info[50],
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: EmergencyColorPalette.info[200]!,
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Icon(
                                  Icons.info_outline,
                                  color: EmergencyColorPalette.info[500],
                                  size: 20,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  'Demo Credentials',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w600,
                                    color: EmergencyColorPalette.info[700],
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Email: tourist@safetravel.com\nPassword: tourist123',
                              style: TextStyle(
                                fontSize: 14,
                                color: EmergencyColorPalette.neutral[700],
                                fontFamily: 'monospace',
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Email Field
                      TextFormField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        decoration: InputDecoration(
                          labelText: 'Email',
                          prefixIcon: Icon(
                            Icons.email_outlined,
                            color: EmergencyColorPalette.primary[500],
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(
                              color: EmergencyColorPalette.primary[500]!,
                              width: 2,
                            ),
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your email';
                          }
                          if (!value.contains('@')) {
                            return 'Please enter a valid email';
                          }
                          return null;
                        },
                      ),

                      const SizedBox(height: 16),

                      // Password Field
                      TextFormField(
                        controller: _passwordController,
                        obscureText: _obscurePassword,
                        decoration: InputDecoration(
                          labelText: 'Password',
                          prefixIcon: Icon(
                            Icons.lock_outlined,
                            color: EmergencyColorPalette.primary[500],
                          ),
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword
                                  ? Icons.visibility_outlined
                                  : Icons.visibility_off_outlined,
                              color: EmergencyColorPalette.neutral[500],
                            ),
                            onPressed: () {
                              setState(() {
                                _obscurePassword = !_obscurePassword;
                              });
                            },
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(
                              color: EmergencyColorPalette.primary[500]!,
                              width: 2,
                            ),
                          ),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter your password';
                          }
                          if (value.length < 6) {
                            return 'Password must be at least 6 characters';
                          }
                          return null;
                        },
                      ),

                      const SizedBox(height: 24),

                      // Error Message
                      if (_error != null)
                        Container(
                          padding: const EdgeInsets.all(12),
                          margin: const EdgeInsets.only(bottom: 16),
                          decoration: BoxDecoration(
                            color: EmergencyColorPalette.danger[50],
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: EmergencyColorPalette.danger[200]!,
                            ),
                          ),
                          child: Row(
                            children: [
                              Icon(
                                Icons.error_outline,
                                color: EmergencyColorPalette.danger[500],
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  _error!,
                                  style: TextStyle(
                                    color: EmergencyColorPalette.danger[700],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),

                      // Login Button
                      SizedBox(
                        width: double.infinity,
                        height: 56,
                        child: ElevatedButton.icon(
                          onPressed: _isLoading ? null : _handleLogin,
                          icon: _isLoading
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                  ),
                                )
                              : const Icon(
                                  Icons.login,
                                  color: Colors.white,
                                  size: 24,
                                ),
                          label: Text(
                            _isLoading ? 'Signing In...' : 'Sign In',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Colors.white,
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: EmergencyColorPalette.primary[500],
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            elevation: 2,
                          ),
                        ),
                      ),

                      const SizedBox(height: 16),

                      // Quick Login Button
                      TextButton.icon(
                        onPressed: _isLoading ? null : _quickLogin,
                        icon: Icon(
                          Icons.flash_on,
                          color: EmergencyColorPalette.secondary[500],
                        ),
                        label: Text(
                          'Quick Demo Login',
                          style: TextStyle(
                            color: EmergencyColorPalette.secondary[500],
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),

                      const SizedBox(height: 32),

                      // Terms and Privacy
                      Text(
                        'By continuing, you agree to our Terms of Service and Privacy Policy',
                        style: TextStyle(
                          fontSize: 12,
                          color: EmergencyColorPalette.neutral[500],
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final email = _emailController.text.trim();
      final password = _passwordController.text;

      // Check hardcoded credentials
      if (_validCredentials.containsKey(email) && 
          _validCredentials[email] == password) {
        
        // Save user data
        await _saveUserData(email);
        
        // Navigate to dashboard
        _navigateToMainApp();
      } else {
        setState(() {
          _error = 'Invalid email or password. Please try the demo credentials.';
        });
      }
    } catch (error) {
      setState(() {
        _error = 'Login failed. Please try again.';
      });
      debugPrint('Login error: $error');
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _quickLogin() async {
    _emailController.text = 'tourist@safetravel.com';
    _passwordController.text = 'tourist123';
    _handleLogin();
  }

  Future<void> _saveUserData(String email) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      await prefs.setBool('is_logged_in', true);
      await prefs.setString('user_name', 'Tourist User');
      await prefs.setString('user_email', email);
      await prefs.setString('user_photo', '');
      await prefs.setString('user_type', 'tourist');
      await prefs.setString('subscription_type', 'basic');
      await prefs.setBool('is_premium', false);
      await prefs.setString('join_date', DateTime.now().toIso8601String());
      
      // Initialize tourist-specific statistics
      await prefs.setInt('places_visited', 5);
      await prefs.setInt('safety_alerts', 2);
      await prefs.setInt('emergency_contacts', 3);
      
      debugPrint('User data saved successfully');
    } catch (e) {
      debugPrint('Error saving user data: $e');
    }
  }

  void _navigateToMainApp() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (context) => const EnhancedDashboardScreen(),
      ),
    );
  }
}
