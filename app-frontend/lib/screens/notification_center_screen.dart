import 'package:flutter/material.dart';
import '../services/notification_service.dart';
import '../theme/emergency_theme.dart';
import '../widgets/theme_aware_text.dart';

class NotificationCenterScreen extends StatefulWidget {
  const NotificationCenterScreen({Key? key}) : super(key: key);

  @override
  State<NotificationCenterScreen> createState() => _NotificationCenterScreenState();
}

class _NotificationCenterScreenState extends State<NotificationCenterScreen> with SingleTickerProviderStateMixin {
  List<Map<String, dynamic>> _notifications = [];
  bool _isLoading = true;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _loadNotifications();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadNotifications() async {
    try {
      final notifications = await NotificationService.getAllNotifications();
      setState(() {
        _notifications = notifications;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const ThemeAwareText.heading('🔔 Notification Center'),
        backgroundColor: EmergencyColorPalette.primary[500],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            onPressed: _markAllAsRead,
            icon: const Icon(Icons.done_all),
            tooltip: 'Mark all as read',
          ),
          IconButton(
            onPressed: _clearAll,
            icon: const Icon(Icons.clear_all),
            tooltip: 'Clear all',
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
          tabs: [
            Tab(
              icon: const Icon(Icons.all_inbox),
              text: 'All (${_notifications.length})',
            ),
            Tab(
              icon: const Icon(Icons.warning),
              text: 'Alerts (${_getAlertCount()})',
            ),
            Tab(
              icon: const Icon(Icons.info),
              text: 'Info (${_getInfoCount()})',
            ),
            Tab(
              icon: const Icon(Icons.notifications_active),
              text: 'Unread (${_getUnreadCount()})',
            ),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                _buildNotificationList(_notifications),
                _buildNotificationList(_getAlertNotifications()),
                _buildNotificationList(_getInfoNotifications()),
                _buildNotificationList(_getUnreadNotifications()),
              ],
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: _createTestNotification,
        backgroundColor: EmergencyColorPalette.secondary[500],
        child: const Icon(Icons.add, color: Colors.white),
        tooltip: 'Create test notification',
      ),
    );
  }

  Widget _buildNotificationList(List<Map<String, dynamic>> notifications) {
    final theme = Theme.of(context);
    
    if (notifications.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.notifications_none,
              size: 80,
              color: theme.colorScheme.onSurface.withOpacity(0.4),
            ),
            const SizedBox(height: 16),
            Text(
              'No notifications',
              style: TextStyle(
                fontSize: 18,
                color: theme.colorScheme.onSurface.withOpacity(0.6),
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadNotifications,
      child: ListView.builder(
        padding: const EdgeInsets.all(8),
        itemCount: notifications.length,
        itemBuilder: (context, index) {
          final notification = notifications[index];
          return _buildNotificationCard(notification);
        },
      ),
    );
  }

  Widget _buildNotificationCard(Map<String, dynamic> notification) {
    final theme = Theme.of(context);
    final isRead = notification['read'] ?? false;
    final type = notification['type'] as String;
    final priority = notification['priority'] as String;
    
    Color borderColor = _getBorderColor(type, priority);
    IconData iconData = _getNotificationIcon(type);
    Color iconColor = _getIconColor(type, priority);

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4),
      decoration: BoxDecoration(
        color: isRead 
            ? theme.colorScheme.surface 
            : theme.colorScheme.primary.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: borderColor,
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: theme.shadowColor.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: CircleAvatar(
          backgroundColor: iconColor.withOpacity(0.1),
          child: Icon(iconData, color: iconColor),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                notification['title'],
                style: TextStyle(
                  fontWeight: isRead ? FontWeight.normal : FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
            if (!isRead)
              Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: Colors.blue,
                  shape: BoxShape.circle,
                ),
              ),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(
              notification['message'],
              style: TextStyle(
                color: theme.colorScheme.onSurface.withOpacity(0.8),
                height: 1.3,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                _buildPriorityChip(priority),
                const Spacer(),
                Text(
                  _formatTimestamp(notification['timestamp']),
                  style: TextStyle(
                    color: theme.colorScheme.onSurface.withOpacity(0.5),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ],
        ),
        onTap: () => _openNotificationDetails(notification),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (!isRead)
              IconButton(
                onPressed: () => _markAsRead(notification['id']),
                icon: const Icon(Icons.mark_email_read, size: 20),
                tooltip: 'Mark as read',
              ),
            PopupMenuButton<String>(
              onSelected: (value) => _handleNotificationAction(value, notification),
              itemBuilder: (context) => [
                const PopupMenuItem(
                  value: 'details',
                  child: Row(
                    children: [
                      Icon(Icons.info_outline),
                      SizedBox(width: 8),
                      Text('View Details'),
                    ],
                  ),
                ),
                if (!isRead)
                  const PopupMenuItem(
                    value: 'read',
                    child: Row(
                      children: [
                        Icon(Icons.mark_email_read),
                        SizedBox(width: 8),
                        Text('Mark as Read'),
                      ],
                    ),
                  ),
                const PopupMenuItem(
                  value: 'delete',
                  child: Row(
                    children: [
                      Icon(Icons.delete, color: Colors.red),
                      SizedBox(width: 8),
                      Text('Delete', style: TextStyle(color: Colors.red)),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPriorityChip(String priority) {
    Color color;
    String label;
    
    switch (priority.toLowerCase()) {
      case 'high':
        color = EmergencyColorPalette.danger[500]!;
        label = '🔥 HIGH';
        break;
      case 'medium':
        color = EmergencyColorPalette.warning[500]!;
        label = '⚡ MED';
        break;
      case 'low':
        color = EmergencyColorPalette.info[500]!;
        label = '📝 LOW';
        break;
      default:
        color = Colors.grey;
        label = priority.toUpperCase();
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Color _getBorderColor(String type, String priority) {
    if (priority.toLowerCase() == 'high') {
      return EmergencyColorPalette.danger[500]!;
    }
    
    switch (type.toLowerCase()) {
      case 'emergency':
        return EmergencyColorPalette.danger[500]!;
      case 'alert':
        return EmergencyColorPalette.warning[500]!;
      case 'info':
        return EmergencyColorPalette.info[500]!;
      default:
        return Colors.grey[300]!;
    }
  }

  IconData _getNotificationIcon(String type) {
    switch (type.toLowerCase()) {
      case 'emergency':
        return Icons.emergency;
      case 'alert':
        return Icons.warning;
      case 'info':
        return Icons.info;
      case 'reminder':
        return Icons.access_time;
      default:
        return Icons.notifications;
    }
  }

  Color _getIconColor(String type, String priority) {
    if (priority.toLowerCase() == 'high') {
      return EmergencyColorPalette.danger[500]!;
    }
    
    switch (type.toLowerCase()) {
      case 'emergency':
        return EmergencyColorPalette.danger[500]!;
      case 'alert':
        return EmergencyColorPalette.warning[500]!;
      case 'info':
        return EmergencyColorPalette.info[500]!;
      default:
        return Colors.grey;
    }
  }

  String _formatTimestamp(dynamic timestamp) {
    if (timestamp == null) return 'Unknown';
    
    try {
      final dt = DateTime.parse(timestamp.toString());
      final now = DateTime.now();
      final diff = now.difference(dt);
      
      if (diff.inMinutes < 1) {
        return 'Just now';
      } else if (diff.inHours < 1) {
        return '${diff.inMinutes}m ago';
      } else if (diff.inDays < 1) {
        return '${diff.inHours}h ago';
      } else {
        return '${diff.inDays}d ago';
      }
    } catch (e) {
      return timestamp.toString();
    }
  }

  int _getAlertCount() {
    return _notifications.where((n) => 
        n['type'] == 'alert' || n['type'] == 'emergency').length;
  }

  int _getInfoCount() {
    return _notifications.where((n) => n['type'] == 'info').length;
  }

  int _getUnreadCount() {
    return _notifications.where((n) => !(n['read'] ?? false)).length;
  }

  List<Map<String, dynamic>> _getAlertNotifications() {
    return _notifications.where((n) => 
        n['type'] == 'alert' || n['type'] == 'emergency').toList();
  }

  List<Map<String, dynamic>> _getInfoNotifications() {
    return _notifications.where((n) => n['type'] == 'info').toList();
  }

  List<Map<String, dynamic>> _getUnreadNotifications() {
    return _notifications.where((n) => !(n['read'] ?? false)).toList();
  }

  void _markAllAsRead() async {
    await NotificationService.markAllAsRead();
    _loadNotifications();
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('✅ All notifications marked as read'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _clearAll() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear All Notifications'),
        content: const Text('Are you sure you want to delete all notifications? This cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete All'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await NotificationService.clearAllNotifications();
      _loadNotifications();
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('🗑️ All notifications cleared'),
          backgroundColor: Colors.orange,
        ),
      );
    }
  }

  void _markAsRead(String notificationId) async {
    await NotificationService.markAsRead(notificationId);
    _loadNotifications();
  }

  void _handleNotificationAction(String action, Map<String, dynamic> notification) {
    switch (action) {
      case 'details':
        _openNotificationDetails(notification);
        break;
      case 'read':
        _markAsRead(notification['id']);
        break;
      case 'delete':
        _deleteNotification(notification['id']);
        break;
    }
  }

  void _openNotificationDetails(Map<String, dynamic> notification) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(_getNotificationIcon(notification['type'])),
            const SizedBox(width: 8),
            Expanded(child: Text(notification['title'])),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                notification['message'],
                style: const TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  const Text('Type: ', style: TextStyle(fontWeight: FontWeight.bold)),
                  Text(notification['type']),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Text('Priority: ', style: TextStyle(fontWeight: FontWeight.bold)),
                  _buildPriorityChip(notification['priority']),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Text('Time: ', style: TextStyle(fontWeight: FontWeight.bold)),
                  Text(_formatTimestamp(notification['timestamp'])),
                ],
              ),
              if (notification['data'] != null) ...[
                const SizedBox(height: 16),
                const Text('Additional Data:', style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    notification['data'].toString(),
                    style: const TextStyle(fontFamily: 'monospace'),
                  ),
                ),
              ],
            ],
          ),
        ),
        actions: [
          if (!(notification['read'] ?? false))
            TextButton(
              onPressed: () {
                _markAsRead(notification['id']);
                Navigator.of(context).pop();
              },
              child: const Text('Mark as Read'),
            ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _deleteNotification(String notificationId) async {
    await NotificationService.deleteNotification(notificationId);
    _loadNotifications();
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('🗑️ Notification deleted'),
        backgroundColor: Colors.orange,
      ),
    );
  }

  void _createTestNotification() async {
    final types = ['emergency', 'alert', 'info', 'reminder'];
    final priorities = ['high', 'medium', 'low'];
    final type = types[DateTime.now().millisecond % types.length];
    final priority = priorities[DateTime.now().second % priorities.length];
    
    await NotificationService.sendNotification(
      'Test Notification',
      'This is a test notification created at ${DateTime.now().toString().substring(11, 19)}',
      type: type,
      priority: priority,
    );
    
    _loadNotifications();
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('🔔 Test $type notification created'),
        backgroundColor: Colors.blue,
      ),
    );
  }
}
