import 'package:flutter/material.dart';
import '../services/community_service.dart';
import '../theme/emergency_theme.dart';
import '../widgets/theme_aware_text.dart';

class CommunityInteractionScreen extends StatefulWidget {
  const CommunityInteractionScreen({Key? key}) : super(key: key);

  @override
  State<CommunityInteractionScreen> createState() => _CommunityInteractionScreenState();
}

class _CommunityInteractionScreenState extends State<CommunityInteractionScreen> with SingleTickerProviderStateMixin {
  List<Map<String, dynamic>> _messages = [];
  List<Map<String, dynamic>> _nearbyUsers = [];
  bool _isLoading = true;
  late TabController _tabController;
  final TextEditingController _messageController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadCommunityData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _loadCommunityData() async {
    try {
      final messages = await CommunityService.getMessages();
      final nearbyUsers = await CommunityService.getNearbyUsers();
      
      setState(() {
        _messages = messages;
        _nearbyUsers = nearbyUsers;
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
        title: const ThemeAwareText.heading('🤝 Community'),
        backgroundColor: EmergencyColorPalette.primary[500],
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            onPressed: _showTrustScoreInfo,
            icon: const Icon(Icons.info_outline),
            tooltip: 'Trust Score Info',
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white70,
          indicatorColor: Colors.white,
          tabs: const [
            Tab(icon: Icon(Icons.chat), text: 'Messages'),
            Tab(icon: Icon(Icons.people_outline), text: 'Nearby'),
            Tab(icon: Icon(Icons.group), text: 'Groups'),
          ],
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                _buildMessagesTab(),
                _buildNearbyUsersTab(),
                _buildGroupsTab(),
              ],
            ),
    );
  }

  Widget _buildMessagesTab() {
    return Column(
      children: [
        // Trust Score Banner
        _buildTrustScoreBanner(),
        
        // Messages List
        Expanded(
          child: RefreshIndicator(
            onRefresh: _loadCommunityData,
            child: _messages.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.chat_bubble_outline, size: 80, color: Theme.of(context).colorScheme.onSurface.withOpacity(0.4)),
                        const SizedBox(height: 16),
                        Text('No messages yet', style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6))),
                        Text('Start a conversation with nearby tourists!', 
                             style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withOpacity(0.4), fontSize: 12)),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: _messages.length,
                    itemBuilder: (context, index) {
                      final message = _messages[index];
                      return _buildMessageCard(message);
                    },
                  ),
          ),
        ),
        
        // Message Input
        _buildMessageInput(),
      ],
    );
  }

  Widget _buildNearbyUsersTab() {
    return RefreshIndicator(
      onRefresh: _loadCommunityData,
      child: _nearbyUsers.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.people_outline, size: 80, color: Theme.of(context).colorScheme.onSurface.withOpacity(0.4)),
                  const SizedBox(height: 16),
                  Text('No nearby users found', style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withOpacity(0.6))),
                  Text('Enable location sharing to connect with others nearby!', 
                       style: TextStyle(color: Theme.of(context).colorScheme.onSurface.withOpacity(0.4), fontSize: 12)),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _nearbyUsers.length,
              itemBuilder: (context, index) {
                final user = _nearbyUsers[index];
                return _buildNearbyUserCard(user);
              },
            ),
    );
  }

  Widget _buildGroupsTab() {
    return const Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.group, size: 80, color: Colors.grey),
          SizedBox(height: 16),
          Text('Groups feature coming soon!', style: TextStyle(color: Colors.grey)),
          Text('Join groups based on interests and location', 
               style: TextStyle(color: Colors.grey, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildTrustScoreBanner() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            EmergencyColorPalette.primary[500]!,
            EmergencyColorPalette.secondary[500]!,
          ],
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          const CircleAvatar(
            backgroundColor: Colors.white,
            child: Icon(Icons.verified_user, color: Colors.blue),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Your Trust Score: 87/100',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  '🔒 Blockchain Verified',
                  style: TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
          TextButton(
            onPressed: _showTrustScoreInfo,
            child: const Text(
              'Learn More',
              style: TextStyle(color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageCard(Map<String, dynamic> message) {
    final isOwnMessage = message['senderId'] == 'current_user';
    
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: isOwnMessage ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          if (!isOwnMessage) ...[
            CircleAvatar(
              radius: 16,
              backgroundColor: _getTrustScoreColor(message['senderTrustScore']),
              child: Text(
                message['senderName'][0].toUpperCase(),
                style: const TextStyle(color: Colors.white, fontSize: 12),
              ),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              constraints: BoxConstraints(
                maxWidth: MediaQuery.of(context).size.width * 0.7,
              ),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isOwnMessage 
                    ? EmergencyColorPalette.primary[500]
                    : Colors.grey[200],
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (!isOwnMessage) ...[
                    Row(
                      children: [
                        Text(
                          message['senderName'],
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                            color: isOwnMessage ? Colors.white70 : Colors.grey[600],
                          ),
                        ),
                        const SizedBox(width: 4),
                        _buildTrustScoreChip(message['senderTrustScore']),
                      ],
                    ),
                    const SizedBox(height: 4),
                  ],
                  Text(
                    message['content'],
                    style: TextStyle(
                      color: isOwnMessage ? Colors.white : Colors.black87,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    _formatTimestamp(message['timestamp']),
                    style: TextStyle(
                      fontSize: 10,
                      color: isOwnMessage ? Colors.white70 : Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (isOwnMessage) ...[
            const SizedBox(width: 8),
            CircleAvatar(
              radius: 16,
              backgroundColor: EmergencyColorPalette.secondary[500],
              child: const Text(
                'Y',
                style: TextStyle(color: Colors.white, fontSize: 12),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildNearbyUserCard(Map<String, dynamic> user) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 4),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: _getTrustScoreColor(user['trustScore']),
          child: Text(
            user['name'][0].toUpperCase(),
            style: const TextStyle(color: Colors.white),
          ),
        ),
        title: Row(
          children: [
            Text(user['name']),
            const SizedBox(width: 8),
            _buildTrustScoreChip(user['trustScore']),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('${user['distance']}m away'),
            if (user['status'] != null)
              Text(
                '💭 ${user['status']}',
                style: const TextStyle(fontStyle: FontStyle.italic),
              ),
          ],
        ),
        trailing: SizedBox(
          width: 96,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              IconButton(
                onPressed: () => _sendDirectMessage(user),
                icon: const Icon(Icons.message, size: 20),
                tooltip: 'Send message',
                padding: const EdgeInsets.all(4),
                constraints: const BoxConstraints(minWidth: 40, minHeight: 40),
              ),
              IconButton(
                onPressed: () => _requestHelp(user),
                icon: const Icon(Icons.help_outline, size: 20),
                tooltip: 'Request help',
                padding: const EdgeInsets.all(4),
                constraints: const BoxConstraints(minWidth: 40, minHeight: 40),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTrustScoreChip(int trustScore) {
    Color color;
    String label;
    
    if (trustScore >= 80) {
      color = Colors.green;
      label = 'HIGH';
    } else if (trustScore >= 60) {
      color = Colors.orange;
      label = 'MED';
    } else {
      color = Colors.red;
      label = 'LOW';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 9,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Color _getTrustScoreColor(int trustScore) {
    if (trustScore >= 80) {
      return Colors.green;
    } else if (trustScore >= 60) {
      return Colors.orange;
    } else {
      return Colors.red;
    }
  }

  Widget _buildMessageInput() {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: theme.shadowColor.withOpacity(0.1),
            blurRadius: 5,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _messageController,
              decoration: InputDecoration(
                hintText: 'Type a message...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(25),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: theme.brightness == Brightness.dark 
                    ? theme.colorScheme.surface.withOpacity(0.8)
                    : Colors.grey[100],
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
              ),
              maxLines: null,
            ),
          ),
          const SizedBox(width: 8),
          CircleAvatar(
            backgroundColor: EmergencyColorPalette.primary[500],
            child: IconButton(
              onPressed: _sendMessage,
              icon: const Icon(Icons.send, color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  String _formatTimestamp(dynamic timestamp) {
    if (timestamp == null) return '';
    
    try {
      final dt = DateTime.parse(timestamp.toString());
      final now = DateTime.now();
      final diff = now.difference(dt);
      
      if (diff.inMinutes < 1) {
        return 'now';
      } else if (diff.inHours < 1) {
        return '${diff.inMinutes}m';
      } else if (diff.inDays < 1) {
        return '${diff.inHours}h';
      } else {
        return '${diff.inDays}d';
      }
    } catch (e) {
      return '';
    }
  }

  void _sendMessage() async {
    if (_messageController.text.trim().isEmpty) return;
    
    final message = _messageController.text.trim();
    _messageController.clear();
    
    await CommunityService.sendMessage(message);
    _loadCommunityData();
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('💬 Message sent to community'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _sendDirectMessage(Map<String, dynamic> user) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Message ${user['name']}'),
        content: const TextField(
          decoration: InputDecoration(
            hintText: 'Type your message...',
            border: OutlineInputBorder(),
          ),
          maxLines: 3,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('📨 Direct message sent to ${user['name']}'),
                  backgroundColor: Colors.blue,
                ),
              );
            },
            child: const Text('Send'),
          ),
        ],
      ),
    );
  }

  void _requestHelp(Map<String, dynamic> user) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Request Help from ${user['name']}'),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('What kind of help do you need?'),
            SizedBox(height: 16),
            TextField(
              decoration: InputDecoration(
                hintText: 'Describe your situation...',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('🆘 Help request sent to ${user['name']}'),
                  backgroundColor: Colors.orange,
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: EmergencyColorPalette.warning[500],
            ),
            child: const Text('Request Help'),
          ),
        ],
      ),
    );
  }

  void _showTrustScoreInfo() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.verified_user, color: Colors.blue),
            SizedBox(width: 8),
            Text('Trust Score System'),
          ],
        ),
        content: const SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Your trust score is calculated based on:',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 12),
              Text('🔐 Blockchain verification'),
              Text('📱 Profile completeness'),
              Text('🤝 Community interactions'),
              Text('⭐ User reviews and ratings'),
              Text('📍 Location sharing accuracy'),
              SizedBox(height: 16),
              Text(
                'Trust Levels:',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              Text('🟢 HIGH (80-100): Highly trusted'),
              Text('🟡 MEDIUM (60-79): Moderately trusted'),
              Text('🔴 LOW (0-59): New or unverified'),
              SizedBox(height: 16),
              Text(
                'Higher trust scores enable:',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              Text('• Access to exclusive features'),
              Text('• Priority emergency response'),
              Text('• Enhanced community privileges'),
              Text('• Increased visibility to others'),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Got it'),
          ),
        ],
      ),
    );
  }
}
