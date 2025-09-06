class MockAuthService {
  static Future<Map<String, dynamic>> mockGoogleSignIn() async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 2));
    
    return {
      'success': true,
      'user': {
        'displayName': 'Tourist User (Mock)',
        'email': 'tourist@example.com',
        'photoUrl': '',
        'uid': 'mock_uid_123',
      },
      'message': 'Mock authentication successful',
    };
  }
  
  static Future<Map<String, dynamic>> mockSignOut() async {
    await Future.delayed(const Duration(milliseconds: 500));
    
    return {
      'success': true,
      'message': 'Mock sign out successful',
    };
  }
}
