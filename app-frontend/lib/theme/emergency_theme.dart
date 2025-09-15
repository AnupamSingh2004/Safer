import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Emergency Service Color Palette - Professional blue-green-red scheme
class EmergencyColorPalette {
  // Primary Safety Blue (Trust, Security, Professional)
  static const Map<int, Color> primary = {
    50: Color(0xFFECFEFF),   // Very light cyan - background highlights
    100: Color(0xFFCFFAFE),  // Light cyan - subtle backgrounds
    200: Color(0xFFA5F3FC),  // Light blue - hover states
    300: Color(0xFF67E8F9),  // Cyan - interactive elements
    400: Color(0xFF22D3EE),  // Bright cyan - accent elements
    500: Color(0xFF0891B2),  // Primary blue (main brand) - primary buttons
    600: Color(0xFF0E7490),  // Dark cyan - primary hover states
    700: Color(0xFF155E75),  // Darker cyan - pressed states
    800: Color(0xFF164E63),  // Very dark cyan - text on light backgrounds
    900: Color(0xFF083344),  // Darkest cyan - headings, important text
  };

  // Secondary Safety Green (Success, Safe Status, Go)
  static const Map<int, Color> secondary = {
    50: Color(0xFFF0FDF4),   // Very light green - success backgrounds
    100: Color(0xFFDCFCE7),  // Light green - safe zone indicators
    200: Color(0xFFBBF7D0),  // Light green - positive status
    300: Color(0xFF86EFAC),  // Green - safe status icons
    400: Color(0xFF4ADE80),  // Bright green - success indicators
    500: Color(0xFF22C55E),  // Main green (safety confirmed) - success buttons
    600: Color(0xFF16A34A),  // Dark green - success hover states
    700: Color(0xFF15803D),  // Darker green - confirmed safe status
    800: Color(0xFF166534),  // Very dark green - safe zone text
    900: Color(0xFF14532D),  // Darkest green - important safe status
  };

  // Emergency Alert Red (Danger, Critical, Emergency)
  static const Map<int, Color> danger = {
    50: Color(0xFFFEF2F2),   // Very light red - emergency backgrounds
    100: Color(0xFFFEE2E2),  // Light red - alert backgrounds
    200: Color(0xFFFECACA),  // Light red - warning backgrounds
    300: Color(0xFFFCA5A5),  // Red - moderate alerts
    400: Color(0xFFF87171),  // Bright red - alert indicators
    500: Color(0xFFEF4444),  // Main red (emergency) - critical alerts
    600: Color(0xFFDC2626),  // Dark red - emergency buttons
    700: Color(0xFFB91C1C),  // Darker red - critical status
    800: Color(0xFF991B1B),  // Very dark red - emergency text
    900: Color(0xFF7F1D1D),  // Darkest red - critical emergency
  };

  // Warning Yellow-Orange (Caution, Moderate Risk)
  static const Map<int, Color> warning = {
    50: Color(0xFFFFFBEB),   // Very light yellow - caution backgrounds
    100: Color(0xFFFEF3C7),  // Light yellow - warning backgrounds
    200: Color(0xFFFDE68A),  // Light yellow - minor alerts
    300: Color(0xFFFCD34D),  // Yellow - caution indicators
    400: Color(0xFFFBBF24),  // Bright yellow - warning icons
    500: Color(0xFFF59E0B),  // Main yellow (warning) - caution alerts
    600: Color(0xFFD97706),  // Dark yellow - warning buttons
    700: Color(0xFFB45309),  // Darker yellow - important warnings
    800: Color(0xFF92400E),  // Very dark yellow - warning text
    900: Color(0xFF78350F),  // Darkest yellow - critical warnings
  };

  // Information Blue (Informational, Neutral)
  static const Map<int, Color> info = {
    50: Color(0xFFEFF6FF),   // Very light blue - info backgrounds
    100: Color(0xFFDBEAFE),  // Light blue - info panels
    200: Color(0xFFBFDBFE),  // Light blue - info borders
    300: Color(0xFF93C5FD),  // Blue - info icons
    400: Color(0xFF60A5FA),  // Bright blue - info buttons
    500: Color(0xFF3B82F6),  // Main blue (information)
    600: Color(0xFF2563EB),  // Dark blue - info hover
    700: Color(0xFF1D4ED8),
    800: Color(0xFF1E40AF),
    900: Color(0xFF1E3A8A),
  };

  // Neutral Grays
  static const Map<int, Color> neutral = {
    50: Color(0xFFF8FAFC),
    100: Color(0xFFF1F5F9),
    200: Color(0xFFE2E8F0),
    300: Color(0xFFCBD5E1),
    400: Color(0xFF94A3B8),
    500: Color(0xFF64748B),
    600: Color(0xFF475569),
    700: Color(0xFF334155),
    800: Color(0xFF1E293B),
    900: Color(0xFF0F172A),
  };
}

/// Emergency Alert Specific Colors
class AlertTypeColors {
  static const Color critical = Color(0xFFDC2626);
  static const Color emergency = Color(0xFFEF4444);
  static const Color missing = Color(0xFFF59E0B);
  static const Color medical = Color(0xFFEC4899);
  static const Color security = Color(0xFFF97316);
  static const Color geofence = Color(0xFF8B5CF6);
  static const Color anomaly = Color(0xFF06B6D4);
  static const Color panic = Color(0xFFDC2626);
  static const Color system = Color(0xFF64748B);
  static const Color resolved = Color(0xFF22C55E);
}

/// Zone Risk Level Colors
class ZoneRiskColors {
  static const Color safe = Color(0xFF22C55E);
  static const Color lowRisk = Color(0xFF0891B2);
  static const Color moderateRisk = Color(0xFFF59E0B);
  static const Color highRisk = Color(0xFFEF4444);
  static const Color restricted = Color(0xFF7C2D12);
  static const Color unknown = Color(0xFF64748B);
}

/// Emergency Theme Configuration
class EmergencyTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: ColorScheme.light(
        primary: EmergencyColorPalette.primary[500]!,
        onPrimary: Colors.white,
        secondary: EmergencyColorPalette.secondary[500]!,
        onSecondary: Colors.white,
        surface: Colors.white,
        onSurface: EmergencyColorPalette.neutral[900]!,
        background: EmergencyColorPalette.neutral[50]!,
        onBackground: EmergencyColorPalette.neutral[900]!,
        error: EmergencyColorPalette.danger[500]!,
        onError: Colors.white,
        tertiary: EmergencyColorPalette.warning[500]!,
        onTertiary: Colors.white,
      ),
      scaffoldBackgroundColor: EmergencyColorPalette.neutral[50],
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: EmergencyColorPalette.neutral[900],
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          color: EmergencyColorPalette.neutral[900],
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
        systemOverlayStyle: SystemUiOverlayStyle.dark,
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: Colors.white,
        selectedItemColor: EmergencyColorPalette.primary[500],
        unselectedItemColor: EmergencyColorPalette.neutral[400],
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      cardTheme: CardThemeData(
        color: Colors.white,
        elevation: 2,
        shadowColor: EmergencyColorPalette.neutral[200],
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: EmergencyColorPalette.primary[500],
          foregroundColor: Colors.white,
          elevation: 2,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: EmergencyColorPalette.primary[500],
          side: BorderSide(color: EmergencyColorPalette.primary[500]!),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: EmergencyColorPalette.primary[500],
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: EmergencyColorPalette.neutral[300]!),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: EmergencyColorPalette.neutral[300]!),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: EmergencyColorPalette.primary[500]!, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: EmergencyColorPalette.danger[500]!),
        ),
        labelStyle: TextStyle(
          color: EmergencyColorPalette.neutral[700],
          fontWeight: FontWeight.w600,
        ),
        hintStyle: TextStyle(
          color: EmergencyColorPalette.neutral[500],
          fontWeight: FontWeight.w500,
        ),
      ),
      // Enhanced text theme for better visibility
      textTheme: TextTheme(
        headlineLarge: TextStyle(
          color: Colors.black,
          fontSize: 32,
          fontWeight: FontWeight.w900,
          letterSpacing: -0.5,
          shadows: [
            Shadow(
              color: Colors.black.withOpacity(0.1),
              offset: const Offset(0, 1),
              blurRadius: 2,
            ),
          ],
        ),
        headlineMedium: TextStyle(
          color: Colors.black,
          fontSize: 28,
          fontWeight: FontWeight.w900,
          letterSpacing: -0.3,
          shadows: [
            Shadow(
              color: Colors.black.withOpacity(0.1),
              offset: const Offset(0, 1),
              blurRadius: 2,
            ),
          ],
        ),
        headlineSmall: TextStyle(
          color: Colors.black,
          fontSize: 24,
          fontWeight: FontWeight.w900,
          letterSpacing: -0.2,
          shadows: [
            Shadow(
              color: Colors.black.withOpacity(0.1),
              offset: const Offset(0, 1),
              blurRadius: 2,
            ),
          ],
        ),
        titleLarge: TextStyle(
          color: Colors.black,
          fontSize: 22,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.1,
        ),
        titleMedium: TextStyle(
          color: Colors.black,
          fontSize: 16,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.1,
        ),
        titleSmall: TextStyle(
          color: Colors.black,
          fontSize: 14,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.2,
        ),
        bodyLarge: TextStyle(
          color: Colors.black,
          fontSize: 16,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.1,
          height: 1.5,
        ),
        bodyMedium: TextStyle(
          color: Colors.black,
          fontSize: 14,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.1,
          height: 1.5,
        ),
        bodySmall: TextStyle(
          color: Colors.black,
          fontSize: 12,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.2,
          height: 1.4,
        ),
        labelLarge: TextStyle(
          color: Colors.black,
          fontSize: 14,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.3,
        ),
        labelMedium: TextStyle(
          color: Colors.black,
          fontSize: 12,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.3,
        ),
        labelSmall: TextStyle(
          color: Colors.black,
          fontSize: 11,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.4,
        ),
      ),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: EmergencyColorPalette.danger[500],
        foregroundColor: Colors.white,
        elevation: 6,
      ),
    );
  }

  static ThemeData get darkTheme => ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: ColorScheme.dark(
        primary: EmergencyColorPalette.primary[400]!,
        onPrimary: Colors.white,
        secondary: EmergencyColorPalette.secondary[400]!,
        onSecondary: Colors.white,
        surface: const Color(0xFF1E1E1E),
        onSurface: Colors.white,
        background: const Color(0xFF121212),
        onBackground: Colors.white,
        error: EmergencyColorPalette.danger[400]!,
        onError: Colors.white,
        tertiary: EmergencyColorPalette.warning[400]!,
        onTertiary: Colors.white,
      ),
      scaffoldBackgroundColor: const Color(0xFF121212),
      appBarTheme: AppBarTheme(
        backgroundColor: const Color(0xFF1E1E1E),
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: const TextStyle(
          color: Colors.white,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: const Color(0xFF1E1E1E),
        selectedItemColor: EmergencyColorPalette.primary[400],
        unselectedItemColor: Colors.white54,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      cardTheme: CardThemeData(
        color: const Color(0xFF2D2D2D),
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: EmergencyColorPalette.primary[500],
          foregroundColor: Colors.white,
          elevation: 3,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
            letterSpacing: 0.5,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: EmergencyColorPalette.primary[400],
          side: BorderSide(color: EmergencyColorPalette.primary[400]!, width: 2),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
            letterSpacing: 0.5,
          ),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: EmergencyColorPalette.primary[400],
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          textStyle: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 16,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFF2D2D2D),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF404040)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF404040)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: EmergencyColorPalette.primary[400]!, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: EmergencyColorPalette.danger[400]!),
        ),
        labelStyle: const TextStyle(
          color: Colors.white70,
          fontWeight: FontWeight.w600,
        ),
        hintStyle: const TextStyle(
          color: Colors.white54,
          fontWeight: FontWeight.w500,
        ),
      ),
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          color: Colors.white,
          fontSize: 32,
          fontWeight: FontWeight.bold,
          letterSpacing: -0.5,
        ),
        headlineMedium: TextStyle(
          color: Colors.white,
          fontSize: 28,
          fontWeight: FontWeight.bold,
          letterSpacing: -0.3,
        ),
        headlineSmall: TextStyle(
          color: Colors.white,
          fontSize: 24,
          fontWeight: FontWeight.bold,
          letterSpacing: -0.2,
        ),
        titleLarge: TextStyle(
          color: Colors.white,
          fontSize: 22,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.1,
        ),
        titleMedium: TextStyle(
          color: Colors.white,
          fontSize: 16,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.1,
        ),
        titleSmall: TextStyle(
          color: Colors.white,
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.2,
        ),
        bodyLarge: TextStyle(
          color: Colors.white,
          fontSize: 16,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.1,
          height: 1.5,
        ),
        bodyMedium: TextStyle(
          color: Colors.white,
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.1,
          height: 1.5,
        ),
        bodySmall: TextStyle(
          color: Colors.white,
          fontSize: 12,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.2,
          height: 1.4,
        ),
        labelLarge: TextStyle(
          color: Colors.white,
          fontSize: 14,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.3,
        ),
        labelMedium: TextStyle(
          color: Colors.white,
          fontSize: 12,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.3,
        ),
        labelSmall: TextStyle(
          color: Colors.white,
          fontSize: 11,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.4,
        ),
      ),
      floatingActionButtonTheme: FloatingActionButtonThemeData(
        backgroundColor: EmergencyColorPalette.danger[500],
        foregroundColor: Colors.white,
        elevation: 6,
      ),
    );

  // Button Styles
  static ButtonStyle get primaryButtonStyle => ElevatedButton.styleFrom(
        backgroundColor: EmergencyColorPalette.primary[500],
        foregroundColor: Colors.white,
        elevation: 3,
        shadowColor: EmergencyColorPalette.primary[900]?.withOpacity(0.3),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        textStyle: const TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 16,
          letterSpacing: 0.5,
        ),
      );

  static ButtonStyle get secondaryButtonStyle => ElevatedButton.styleFrom(
        backgroundColor: EmergencyColorPalette.secondary[500],
        foregroundColor: Colors.white,
        elevation: 3,
        shadowColor: EmergencyColorPalette.secondary[900]?.withOpacity(0.3),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        textStyle: const TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 16,
          letterSpacing: 0.5,
        ),
      );

  static ButtonStyle get outlineButtonStyle => OutlinedButton.styleFrom(
        side: BorderSide(color: EmergencyColorPalette.primary[500]!, width: 2),
        foregroundColor: EmergencyColorPalette.primary[500],
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        textStyle: const TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 16,
          letterSpacing: 0.5,
        ),
      );

  static ButtonStyle get dangerButtonStyle => ElevatedButton.styleFrom(
        backgroundColor: EmergencyColorPalette.danger[500],
        foregroundColor: Colors.white,
        elevation: 3,
        shadowColor: EmergencyColorPalette.danger[900]?.withOpacity(0.3),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
        textStyle: const TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 16,
          letterSpacing: 0.5,
        ),
      );

  // Box Decorations
  static BoxDecoration get cardDecoration => BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: EmergencyColorPalette.neutral[900]!.withOpacity(0.08),
            blurRadius: 12,
            offset: const Offset(0, 4),
            spreadRadius: 2,
          ),
        ],
      );

  static BoxDecoration get emergencyCardDecoration => BoxDecoration(
        color: EmergencyColorPalette.danger[50],
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: EmergencyColorPalette.danger[200]!,
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: EmergencyColorPalette.danger[500]!.withOpacity(0.15),
            blurRadius: 12,
            offset: const Offset(0, 4),
            spreadRadius: 2,
          ),
        ],
      );

  static BoxDecoration get primaryCardDecoration => BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            EmergencyColorPalette.primary[500]!,
            EmergencyColorPalette.primary[600]!,
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: EmergencyColorPalette.primary[500]!.withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
            spreadRadius: 2,
          ),
        ],
      );

  // Text Styles for better visibility
  static TextStyle get headingStyle => const TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.bold,
        color: Colors.black87,
        letterSpacing: -0.2,
        height: 1.2,
      );

  static TextStyle get subheadingStyle => const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: Colors.black87,
        letterSpacing: 0.1,
        height: 1.3,
      );

  static TextStyle get bodyStyle => const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        color: Colors.black87,
        letterSpacing: 0.1,
        height: 1.5,
      );

  static TextStyle get captionStyle => TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: EmergencyColorPalette.neutral[600],
        letterSpacing: 0.2,
        height: 1.4,
      );

  static TextStyle get buttonTextStyle => const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.bold,
        letterSpacing: 0.5,
      );


}

/// Emergency Button Styles
class EmergencyButtonStyles {
  static ButtonStyle get panicButton => ElevatedButton.styleFrom(
    backgroundColor: EmergencyColorPalette.danger[500],
    foregroundColor: Colors.white,
    padding: const EdgeInsets.all(20),
    shape: const CircleBorder(),
    elevation: 8,
    shadowColor: EmergencyColorPalette.danger[300],
  );

  static ButtonStyle get safeButton => ElevatedButton.styleFrom(
    backgroundColor: EmergencyColorPalette.secondary[500],
    foregroundColor: Colors.white,
    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    elevation: 4,
  );

  static ButtonStyle get warningButton => ElevatedButton.styleFrom(
    backgroundColor: EmergencyColorPalette.warning[500],
    foregroundColor: Colors.white,
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    elevation: 2,
  );
}

/// Emergency Container Decorations
class EmergencyDecorations {
  static BoxDecoration get emergencyCard => BoxDecoration(
    color: EmergencyColorPalette.danger[50],
    border: Border.all(color: EmergencyColorPalette.danger[200]!),
    borderRadius: BorderRadius.circular(12),
    boxShadow: [
      BoxShadow(
        color: EmergencyColorPalette.danger[100]!,
        blurRadius: 8,
        offset: const Offset(0, 2),
      ),
    ],
  );

  static BoxDecoration get safeCard => BoxDecoration(
    color: EmergencyColorPalette.secondary[50],
    border: Border.all(color: EmergencyColorPalette.secondary[200]!),
    borderRadius: BorderRadius.circular(12),
    boxShadow: [
      BoxShadow(
        color: EmergencyColorPalette.secondary[100]!,
        blurRadius: 8,
        offset: const Offset(0, 2),
      ),
    ],
  );

  static BoxDecoration get warningCard => BoxDecoration(
    color: EmergencyColorPalette.warning[50],
    border: Border.all(color: EmergencyColorPalette.warning[200]!),
    borderRadius: BorderRadius.circular(12),
    boxShadow: [
      BoxShadow(
        color: EmergencyColorPalette.warning[100]!,
        blurRadius: 8,
        offset: const Offset(0, 2),
      ),
    ],
  );
}
