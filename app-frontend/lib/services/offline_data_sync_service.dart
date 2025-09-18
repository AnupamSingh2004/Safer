import 'dart:async';
import 'dart:convert';

/// 📡 Offline Data Sync Service - Enhanced for SIH 2025 Demo
/// Handles offline mode support, data synchronization, and conflict resolution
class OfflineDataSyncService {
  static final OfflineDataSyncService _instance = OfflineDataSyncService._internal();
  factory OfflineDataSyncService() => _instance;
  OfflineDataSyncService._internal();

  final StreamController<SyncStatus> _syncStatusController = 
      StreamController<SyncStatus>.broadcast();
  
  bool _isOnline = true;
  bool _isSyncing = false;
  DateTime? _lastSyncTime;
  int _pendingOperations = 0;
  
  final Map<String, dynamic> _localData = {};
  final List<PendingOperation> _pendingOperationsList = [];
  final Map<String, ConflictResolution> _conflictResolutions = {};

  /// Stream of sync status updates
  Stream<SyncStatus> get syncStatusStream => _syncStatusController.stream;

  /// Current online status
  bool get isOnline => _isOnline;
  
  /// Current sync status
  bool get isSyncing => _isSyncing;
  
  /// Last sync time
  DateTime? get lastSyncTime => _lastSyncTime;
  
  /// Number of pending operations
  int get pendingOperationsCount => _pendingOperations;

  /// Initialize offline sync service
  Future<void> initialize() async {
    await Future.delayed(const Duration(seconds: 1));
    
    // Load cached data
    await _loadLocalData();
    
    // Start network monitoring
    _startNetworkMonitoring();
    
    // Start periodic sync
    _startPeriodicSync();
    
    print('📡 Offline Data Sync Service Initialized');
    print('🔒 BLOCKCHAIN SYNCHRONIZED STORAGE');
    print('📱 Offline Mode Support: ENABLED');
  }

  /// Store data with offline support
  Future<void> storeData(String key, dynamic data, {bool priority = false}) async {
    // Store locally immediately
    _localData[key] = {
      'data': data,
      'timestamp': DateTime.now().toIso8601String(),
      'synced': false,
      'priority': priority,
    };

    // Add to pending operations if offline
    if (!_isOnline) {
      _addPendingOperation(PendingOperation(
        id: 'store_${DateTime.now().millisecondsSinceEpoch}',
        type: 'store',
        key: key,
        data: data,
        timestamp: DateTime.now(),
        priority: priority,
      ));
    } else {
      // Sync immediately if online
      await _syncDataToBlockchain(key, data);
    }

    await _saveLocalData();
    _updateSyncStatus();
  }

  /// Retrieve data with offline support
  Future<Map<String, dynamic>?> getData(String key) async {
    // Try to get from local storage first
    if (_localData.containsKey(key)) {
      final localEntry = _localData[key];
      
      // If online, check for remote updates
      if (_isOnline) {
        final remoteData = await _getDataFromBlockchain(key);
        if (remoteData != null) {
          final localTimestamp = DateTime.parse(localEntry['timestamp']);
          final remoteTimestamp = DateTime.parse(remoteData['timestamp']);
          
          // Use newer data
          if (remoteTimestamp.isAfter(localTimestamp)) {
            _localData[key] = remoteData;
            await _saveLocalData();
            return remoteData;
          }
        }
      }
      
      return localEntry;
    }

    // If not available locally and online, try remote
    if (_isOnline) {
      final remoteData = await _getDataFromBlockchain(key);
      if (remoteData != null) {
        _localData[key] = remoteData;
        await _saveLocalData();
        return remoteData;
      }
    }

    return null;
  }

  /// Delete data with offline support
  Future<void> deleteData(String key) async {
    // Mark as deleted locally
    _localData[key] = {
      'data': null,
      'timestamp': DateTime.now().toIso8601String(),
      'deleted': true,
      'synced': false,
    };

    // Add to pending operations if offline
    if (!_isOnline) {
      _addPendingOperation(PendingOperation(
        id: 'delete_${DateTime.now().millisecondsSinceEpoch}',
        type: 'delete',
        key: key,
        data: null,
        timestamp: DateTime.now(),
      ));
    } else {
      await _deleteDataFromBlockchain(key);
    }

    await _saveLocalData();
    _updateSyncStatus();
  }

  /// Force sync all pending operations
  Future<void> forceSyncAll() async {
    if (!_isOnline || _isSyncing) return;

    _isSyncing = true;
    _updateSyncStatus();

    try {
      print('📡 Starting force sync of ${_pendingOperationsList.length} operations...');

      // Process pending operations
      final operations = List<PendingOperation>.from(_pendingOperationsList);
      operations.sort((a, b) {
        // Priority operations first
        if (a.priority && !b.priority) return -1;
        if (!a.priority && b.priority) return 1;
        return a.timestamp.compareTo(b.timestamp);
      });

      for (final operation in operations) {
        await _processPendingOperation(operation);
        _pendingOperationsList.remove(operation);
        _pendingOperations = _pendingOperationsList.length;
      }

      // Sync local data
      await _syncAllLocalData();

      _lastSyncTime = DateTime.now();
      print('✅ Force sync completed successfully');

    } catch (e) {
      print('❌ Force sync failed: $e');
    } finally {
      _isSyncing = false;
      _updateSyncStatus();
      await _saveLocalData();
    }
  }

  /// Get sync statistics
  Map<String, dynamic> getSyncStats() {
    return {
      'isOnline': _isOnline,
      'isSyncing': _isSyncing,
      'lastSyncTime': _lastSyncTime?.toIso8601String(),
      'pendingOperations': _pendingOperations,
      'localDataEntries': _localData.length,
      'conflictResolutions': _conflictResolutions.length,
      'cacheSize': _calculateCacheSize(),
    };
  }

  /// Clear local cache
  Future<void> clearLocalCache() async {
    _localData.clear();
    _pendingOperationsList.clear();
    _conflictResolutions.clear();
    _pendingOperations = 0;
    await _saveLocalData();
    _updateSyncStatus();
    print('🗑️ Local cache cleared');
  }

  /// Set network status (for testing)
  void setNetworkStatus(bool isOnline) {
    if (_isOnline != isOnline) {
      _isOnline = isOnline;
      print('📡 Network status changed: ${isOnline ? 'ONLINE' : 'OFFLINE'}');
      
      if (isOnline) {
        // Start sync when coming back online
        Timer(const Duration(seconds: 2), () => forceSyncAll());
      }
      
      _updateSyncStatus();
    }
  }

  /// Dispose service
  void dispose() {
    _syncStatusController.close();
  }

  // Private methods
  void _addPendingOperation(PendingOperation operation) {
    _pendingOperationsList.add(operation);
    _pendingOperations = _pendingOperationsList.length;
    print('📝 Added pending operation: ${operation.type} - ${operation.key}');
  }

  Future<void> _processPendingOperation(PendingOperation operation) async {
    switch (operation.type) {
      case 'store':
        await _syncDataToBlockchain(operation.key, operation.data);
        break;
      case 'delete':
        await _deleteDataFromBlockchain(operation.key);
        break;
      case 'update':
        await _syncDataToBlockchain(operation.key, operation.data);
        break;
    }
  }

  Future<void> _syncDataToBlockchain(String key, dynamic data) async {
    // Simulate blockchain sync
    await Future.delayed(const Duration(milliseconds: 500));
    
    // Mark as synced
    if (_localData.containsKey(key)) {
      _localData[key]['synced'] = true;
      _localData[key]['blockchainTxHash'] = _generateTxHash();
    }
    
    print('🔒 Data synced to blockchain: $key');
  }

  Future<Map<String, dynamic>?> _getDataFromBlockchain(String key) async {
    // Simulate blockchain retrieval
    await Future.delayed(const Duration(milliseconds: 300));
    
    // Mock returning some data
    if (key == 'tourist_profile') {
      return {
        'data': {'name': 'Rajesh Kumar', 'verified': true},
        'timestamp': DateTime.now().subtract(const Duration(hours: 1)).toIso8601String(),
        'synced': true,
        'blockchainTxHash': _generateTxHash(),
      };
    }
    
    return null;
  }

  Future<void> _deleteDataFromBlockchain(String key) async {
    // Simulate blockchain deletion
    await Future.delayed(const Duration(milliseconds: 400));
    print('🗑️ Data deleted from blockchain: $key');
  }

  Future<void> _syncAllLocalData() async {
    for (final entry in _localData.entries) {
      if (entry.value['synced'] != true && entry.value['deleted'] != true) {
        await _syncDataToBlockchain(entry.key, entry.value['data']);
      }
    }
  }

  Future<void> _loadLocalData() async {
    // Simulate loading from local storage
    await Future.delayed(const Duration(milliseconds: 200));
    
    // Mock some cached data
    _localData['emergency_contacts'] = {
      'data': [
        {'name': 'Priya Kumar', 'phone': '+91 98765 43211'},
        {'name': 'Ram Kumar', 'phone': '+91 98765 43212'},
      ],
      'timestamp': DateTime.now().subtract(const Duration(hours: 2)).toIso8601String(),
      'synced': true,
    };
    
    _localData['user_preferences'] = {
      'data': {
        'language': 'English',
        'notifications': true,
        'location_sharing': true,
      },
      'timestamp': DateTime.now().subtract(const Duration(minutes: 30)).toIso8601String(),
      'synced': false,
      'priority': false,
    };

    print('📱 Local data loaded: ${_localData.length} entries');
  }

  Future<void> _saveLocalData() async {
    // Simulate saving to local storage
    await Future.delayed(const Duration(milliseconds: 100));
    // In real implementation, save to SharedPreferences or local database
  }

  void _startNetworkMonitoring() {
    // Simulate network status changes
    Timer.periodic(const Duration(minutes: 2), (timer) {
      // Randomly simulate network changes for demo
      if (DateTime.now().second % 30 == 0) {
        final wasOnline = _isOnline;
        _isOnline = !_isOnline;
        
        if (wasOnline != _isOnline) {
          print('📡 Network status changed: ${_isOnline ? 'ONLINE' : 'OFFLINE'}');
          _updateSyncStatus();
          
          if (_isOnline) {
            Timer(const Duration(seconds: 1), () => forceSyncAll());
          }
        }
      }
    });
  }

  void _startPeriodicSync() {
    Timer.periodic(const Duration(minutes: 5), (timer) {
      if (_isOnline && !_isSyncing && _pendingOperationsList.isNotEmpty) {
        forceSyncAll();
      }
    });
  }

  void _updateSyncStatus() {
    _syncStatusController.add(SyncStatus(
      isOnline: _isOnline,
      isSyncing: _isSyncing,
      pendingOperations: _pendingOperations,
      lastSyncTime: _lastSyncTime,
    ));
  }

  String _generateTxHash() {
    return '0x${DateTime.now().millisecondsSinceEpoch.toRadixString(16)}';
  }

  int _calculateCacheSize() {
    // Simulate cache size calculation
    return json.encode(_localData).length;
  }
}

/// Sync Status Model
class SyncStatus {
  final bool isOnline;
  final bool isSyncing;
  final int pendingOperations;
  final DateTime? lastSyncTime;

  SyncStatus({
    required this.isOnline,
    required this.isSyncing,
    required this.pendingOperations,
    this.lastSyncTime,
  });

  @override
  String toString() {
    return 'SyncStatus(online: $isOnline, syncing: $isSyncing, pending: $pendingOperations)';
  }
}

/// Pending Operation Model
class PendingOperation {
  final String id;
  final String type; // 'store', 'delete', 'update'
  final String key;
  final dynamic data;
  final DateTime timestamp;
  final bool priority;

  PendingOperation({
    required this.id,
    required this.type,
    required this.key,
    this.data,
    required this.timestamp,
    this.priority = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'key': key,
      'data': data,
      'timestamp': timestamp.toIso8601String(),
      'priority': priority,
    };
  }
}

/// Conflict Resolution Model
class ConflictResolution {
  final String key;
  final dynamic localData;
  final dynamic remoteData;
  final DateTime conflictTime;
  final String resolution; // 'local', 'remote', 'merged', 'manual'

  ConflictResolution({
    required this.key,
    required this.localData,
    required this.remoteData,
    required this.conflictTime,
    required this.resolution,
  });
}
