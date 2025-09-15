import 'package:flutter/material.dart';
import 'emergency_theme.dart';

/// Enhanced text styles with improved visibility and readability
class EnhancedTextStyles {
  // Heading Styles with improved contrast and readability
  static const TextStyle headingLarge = TextStyle(
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: Colors.black87,
    height: 1.2,
    letterSpacing: -0.5,
  );

  static const TextStyle headingMedium = TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.bold,
    color: Colors.black87,
    height: 1.3,
    letterSpacing: -0.3,
  );

  static const TextStyle headingSmall = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: Colors.black87,
    height: 1.4,
    letterSpacing: -0.2,
  );

  // Body Text Styles with enhanced readability
  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: Colors.black87,
    height: 1.5,
    letterSpacing: 0.1,
  );

  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: Colors.black87,
    height: 1.5,
    letterSpacing: 0.1,
  );

  static const TextStyle bodySmall = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w600,
    color: Colors.black87,
    height: 1.4,
    letterSpacing: 0.2,
  );

  // Label Styles for UI elements
  static TextStyle labelLarge = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: EmergencyColorPalette.neutral[800],
    height: 1.3,
    letterSpacing: 0.3,
  );

  static TextStyle labelMedium = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: EmergencyColorPalette.neutral[800],
    height: 1.3,
    letterSpacing: 0.3,
  );

  static TextStyle labelSmall = TextStyle(
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: EmergencyColorPalette.neutral[700],
    height: 1.2,
    letterSpacing: 0.4,
  );

  // Button Text Styles
  static const TextStyle buttonLarge = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 0.5,
    height: 1.2,
  );

  static const TextStyle buttonMedium = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 0.3,
    height: 1.2,
  );

  static const TextStyle buttonSmall = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 0.3,
    height: 1.1,
  );

  // Card and Container Text Styles
  static const TextStyle cardTitle = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: Colors.black87,
    height: 1.3,
    letterSpacing: -0.2,
  );

  static const TextStyle cardSubtitle = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: Colors.black87,
    height: 1.4,
    letterSpacing: 0.1,
  );

  static TextStyle cardDescription = TextStyle(
    fontSize: 13,
    fontWeight: FontWeight.w600,
    color: EmergencyColorPalette.neutral[700],
    height: 1.5,
    letterSpacing: 0.1,
  );

  // Status and Badge Text Styles
  static const TextStyle statusActive = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 0.5,
  );

  static const TextStyle statusInactive = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 0.5,
  );

  // Error and Warning Text Styles
  static TextStyle errorText = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: EmergencyColorPalette.danger[600],
    height: 1.4,
    letterSpacing: 0.1,
  );

  static TextStyle warningText = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: EmergencyColorPalette.warning[700],
    height: 1.4,
    letterSpacing: 0.1,
  );

  static TextStyle successText = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    color: EmergencyColorPalette.secondary[700],
    height: 1.4,
    letterSpacing: 0.1,
  );

  // Navigation Text Styles
  static const TextStyle navTitle = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 0.2,
  );

  static const TextStyle navItem = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: Colors.black87,
    letterSpacing: 0.1,
  );

  // Form Text Styles
  static TextStyle inputLabel = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.bold,
    color: EmergencyColorPalette.neutral[800],
    letterSpacing: 0.2,
  );

  static TextStyle inputText = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: EmergencyColorPalette.neutral[900],
    letterSpacing: 0.1,
  );

  static TextStyle inputHint = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w500,
    color: EmergencyColorPalette.neutral[500],
    letterSpacing: 0.1,
  );

  // Time and Date Text Styles
  static TextStyle timestamp = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.w600,
    color: EmergencyColorPalette.neutral[600],
    letterSpacing: 0.2,
  );

  static const TextStyle timeAgo = TextStyle(
    fontSize: 11,
    fontWeight: FontWeight.w600,
    color: Colors.black54,
    letterSpacing: 0.2,
  );

  // Statistics and Numbers
  static const TextStyle numberLarge = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: Colors.black87,
    height: 1.1,
    letterSpacing: -0.5,
  );

  static const TextStyle numberMedium = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.black87,
    height: 1.2,
    letterSpacing: -0.3,
  );

  static const TextStyle numberSmall = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Colors.black87,
    height: 1.3,
    letterSpacing: -0.2,
  );

  // Helper methods for dynamic text with shadows (for better visibility over images)
  static TextStyle withShadow(TextStyle baseStyle, {Color shadowColor = Colors.black26}) {
    return baseStyle.copyWith(
      shadows: [
        Shadow(
          offset: const Offset(1, 1),
          blurRadius: 2,
          color: shadowColor,
        ),
      ],
    );
  }

  // Helper method for colored text while maintaining readability
  static TextStyle withColor(TextStyle baseStyle, Color color) {
    return baseStyle.copyWith(color: color);
  }

  // Helper method for emphasized text
  static TextStyle emphasized(TextStyle baseStyle) {
    return baseStyle.copyWith(
      fontWeight: FontWeight.bold,
      letterSpacing: baseStyle.letterSpacing! + 0.2,
    );
  }
}
