import 'dart:async';
import 'dart:math';

/// 📱 Shake Detection Service - Enhanced for Emergency Activation
/// Uses device accelerometer to detect shake gestures for emergency alerts
class ShakeDetectionService {
  static final ShakeDetectionService _instance = ShakeDetectionService._internal();
  factory ShakeDetectionService() => _instance;
  ShakeDetectionService._internal();

  StreamController<ShakeEvent>? _shakeController;
  Timer? _shakeTimer;
  bool _isListening = false;
  
  // Shake detection parameters
  static const double _shakeThreshold = 12.0; // Minimum shake intensity
  static const int _shakeDuration = 500; // Duration between shakes (ms)
  static const int _requiredShakes = 3; // Number of shakes to trigger emergency
  
  int _shakeCount = 0;
  DateTime? _lastShakeTime;
  List<double> _accelerometerData = [0, 0, 0]; // x, y, z
  
  /// Stream of shake events
  Stream<ShakeEvent> get shakeStream {
    _shakeController ??= StreamController<ShakeEvent>.broadcast();
    return _shakeController!.stream;
  }

  /// Start listening for shake gestures
  Future<void> startListening() async {
    if (_isListening) return;
    
    print('📱 Starting shake detection service...');
    _isListening = true;
    _shakeCount = 0;
    
    // Simulate accelerometer data (in real app, use sensors_plus package)
    _startAccelerometerSimulation();
    
    print('✅ Shake detection active - Shake 3 times for emergency');
  }

  /// Stop listening for shake gestures
  void stopListening() {
    if (!_isListening) return;
    
    _isListening = false;
    _shakeTimer?.cancel();
    _shakeCount = 0;
    
    print('📱 Shake detection stopped');
  }

  /// Check if currently listening
  bool get isListening => _isListening;

  /// Manually trigger shake detection (for testing)
  void simulateShake() {
    if (!_isListening) return;
    
    _handleShakeDetected(15.0); // Simulate high intensity shake
  }

  /// Dispose service
  void dispose() {
    stopListening();
    _shakeController?.close();
  }

  // Private methods
  void _startAccelerometerSimulation() {
    // In a real app, you would use:
    // accelerometerEvents.listen((AccelerometerEvent event) {
    //   _accelerometerData = [event.x, event.y, event.z];
    //   _checkForShake();
    // });
    
    // For demo, we'll simulate random accelerometer data
    _shakeTimer = Timer.periodic(const Duration(milliseconds: 100), (timer) {
      if (!_isListening) {
        timer.cancel();
        return;
      }
      
      // Simulate normal phone movement with occasional shake potential
      final random = Random();
      _accelerometerData = [
        (random.nextDouble() - 0.5) * 4, // -2 to 2
        (random.nextDouble() - 0.5) * 4, // -2 to 2
        9.8 + (random.nextDouble() - 0.5) * 2, // ~9.8 (gravity) ± 1
      ];
      
      // Occasionally simulate a stronger movement that could be a shake
      if (random.nextDouble() > 0.995) { // 0.5% chance
        _accelerometerData = [
          (random.nextDouble() - 0.5) * 20, // Stronger movement
          (random.nextDouble() - 0.5) * 20,
          9.8 + (random.nextDouble() - 0.5) * 15,
        ];
      }
      
      _checkForShake();
    });
  }

  void _checkForShake() {
    // Calculate total acceleration magnitude
    final x = _accelerometerData[0];
    final y = _accelerometerData[1];
    final z = _accelerometerData[2];
    
    final acceleration = sqrt(x * x + y * y + z * z);
    
    // Remove gravity from calculation
    final netAcceleration = (acceleration - 9.8).abs();
    
    if (netAcceleration > _shakeThreshold) {
      _handleShakeDetected(netAcceleration);
    }
  }

  void _handleShakeDetected(double intensity) {
    final now = DateTime.now();
    
    // Check if this shake is within the time window of the last shake
    if (_lastShakeTime != null) {
      final timeDiff = now.difference(_lastShakeTime!).inMilliseconds;
      
      if (timeDiff > _shakeDuration * 2) {
        // Too much time passed, reset counter
        _shakeCount = 0;
      }
    }
    
    _lastShakeTime = now;
    _shakeCount++;
    
    print('📱 Shake detected! Count: $_shakeCount/${_requiredShakes} (Intensity: ${intensity.toStringAsFixed(1)})');
    
    // Emit shake event
    _shakeController?.add(ShakeEvent(
      intensity: intensity,
      timestamp: now,
      shakeCount: _shakeCount,
      isEmergencyTriggered: _shakeCount >= _requiredShakes,
    ));
    
    if (_shakeCount >= _requiredShakes) {
      _triggerEmergency(intensity);
      _shakeCount = 0; // Reset counter
    }
    
    // Reset counter after timeout
    Timer(Duration(milliseconds: _shakeDuration * 3), () {
      if (_lastShakeTime == now) {
        _shakeCount = 0;
      }
    });
  }

  void _triggerEmergency(double intensity) {
    print('🚨 EMERGENCY TRIGGERED BY SHAKE GESTURE!');
    print('   Intensity: ${intensity.toStringAsFixed(1)}');
    print('   Timestamp: ${DateTime.now()}');
    print('   Location: Simulated GPS coordinates');
    
    // Emit emergency shake event
    _shakeController?.add(ShakeEvent(
      intensity: intensity,
      timestamp: DateTime.now(),
      shakeCount: _requiredShakes,
      isEmergencyTriggered: true,
      isEmergencyActivated: true,
    ));
  }
}

/// Shake Event Model
class ShakeEvent {
  final double intensity;
  final DateTime timestamp;
  final int shakeCount;
  final bool isEmergencyTriggered;
  final bool isEmergencyActivated;

  ShakeEvent({
    required this.intensity,
    required this.timestamp,
    required this.shakeCount,
    required this.isEmergencyTriggered,
    this.isEmergencyActivated = false,
  });

  @override
  String toString() {
    return 'ShakeEvent(intensity: $intensity, count: $shakeCount, emergency: $isEmergencyTriggered)';
  }
}

/// Extension for easy shake detection integration
extension ShakeDetectionExtension on ShakeDetectionService {
  /// Initialize shake detection with emergency callback
  Future<void> initializeWithEmergencyCallback(
    Function() onEmergencyTriggered,
  ) async {
    await startListening();
    
    shakeStream.listen((event) {
      if (event.isEmergencyActivated) {
        onEmergencyTriggered();
      }
    });
  }
  
  /// Get current shake detection status
  Map<String, dynamic> getStatus() {
    return {
      'isListening': _isListening,
      'shakeCount': _shakeCount,
      'lastShakeTime': _lastShakeTime?.toIso8601String(),
      'threshold': ShakeDetectionService._shakeThreshold,
      'requiredShakes': ShakeDetectionService._requiredShakes,
    };
  }
}
