import 'package:flutter/material.dart';

/// A widget that automatically adjusts text styles based on the current theme
/// for better visibility and consistency across light and dark themes
class ThemeAwareText extends StatelessWidget {
  final String text;
  final TextStyle? style;
  final TextAlign? textAlign;
  final int? maxLines;
  final TextOverflow? overflow;
  final ThemeAwareTextType type;

  const ThemeAwareText(
    this.text, {
    super.key,
    this.style,
    this.textAlign,
    this.maxLines,
    this.overflow,
    this.type = ThemeAwareTextType.body,
  });

  // Named constructors for different text types
  const ThemeAwareText.heading(
    this.text, {
    super.key,
    this.style,
    this.textAlign,
    this.maxLines,
    this.overflow,
  }) : type = ThemeAwareTextType.heading;

  const ThemeAwareText.subheading(
    this.text, {
    super.key,
    this.style,
    this.textAlign,
    this.maxLines,
    this.overflow,
  }) : type = ThemeAwareTextType.subheading;

  const ThemeAwareText.body(
    this.text, {
    super.key,
    this.style,
    this.textAlign,
    this.maxLines,
    this.overflow,
  }) : type = ThemeAwareTextType.body;

  const ThemeAwareText.caption(
    this.text, {
    super.key,
    this.style,
    this.textAlign,
    this.maxLines,
    this.overflow,
  }) : type = ThemeAwareTextType.caption;

  const ThemeAwareText.button(
    this.text, {
    super.key,
    this.style,
    this.textAlign,
    this.maxLines,
    this.overflow,
  }) : type = ThemeAwareTextType.button;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    TextStyle baseStyle;
    
    switch (type) {
      case ThemeAwareTextType.heading:
        baseStyle = theme.textTheme.headlineMedium ?? const TextStyle();
        break;
      case ThemeAwareTextType.subheading:
        baseStyle = theme.textTheme.titleLarge ?? const TextStyle();
        break;
      case ThemeAwareTextType.body:
        baseStyle = theme.textTheme.bodyLarge ?? const TextStyle();
        break;
      case ThemeAwareTextType.caption:
        baseStyle = theme.textTheme.bodySmall ?? const TextStyle();
        break;
      case ThemeAwareTextType.button:
        baseStyle = theme.textTheme.labelLarge ?? const TextStyle();
        break;
    }

    // Ensure proper color contrast
    Color textColor = baseStyle.color ?? (isDark ? Colors.white : Colors.black87);
    
    // Enhance text weight for better visibility
    FontWeight fontWeight = baseStyle.fontWeight ?? FontWeight.w500;
    if (type == ThemeAwareTextType.heading || type == ThemeAwareTextType.button) {
      fontWeight = FontWeight.bold;
    }

    final finalStyle = baseStyle.copyWith(
      color: textColor,
      fontWeight: fontWeight,
      shadows: isDark ? [
        Shadow(
          color: Colors.black.withOpacity(0.5),
          offset: const Offset(0, 1),
          blurRadius: 2,
        ),
      ] : null,
    ).merge(style);

    return Text(
      text,
      style: finalStyle,
      textAlign: textAlign,
      maxLines: maxLines,
      overflow: overflow,
    );
  }
}

enum ThemeAwareTextType {
  heading,
  subheading,
  body,
  caption,
  button,
}

/// A container that provides consistent card styling across themes
class ThemeAwareCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double? elevation;
  final Color? color;
  final BorderRadius? borderRadius;

  const ThemeAwareCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.elevation,
    this.color,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      margin: margin ?? const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: color ?? (isDark ? const Color(0xFF2D2D2D) : Colors.white),
        borderRadius: borderRadius ?? BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: isDark 
                ? Colors.black.withOpacity(0.3)
                : Colors.black.withOpacity(0.08),
            blurRadius: elevation ?? 8,
            offset: const Offset(0, 2),
            spreadRadius: 1,
          ),
        ],
      ),
      child: Padding(
        padding: padding ?? const EdgeInsets.all(16),
        child: child,
      ),
    );
  }
}

/// Button with consistent theming across light and dark modes
class ThemeAwareButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final ThemeAwareButtonType type;
  final EdgeInsetsGeometry? padding;
  final double? width;
  final double? height;
  final IconData? icon;

  const ThemeAwareButton({
    super.key,
    required this.text,
    this.onPressed,
    this.type = ThemeAwareButtonType.primary,
    this.padding,
    this.width,
    this.height,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    Widget buttonChild = icon != null 
        ? Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 18),
              const SizedBox(width: 8),
              ThemeAwareText.button(text),
            ],
          )
        : ThemeAwareText.button(text);

    Widget button;

    switch (type) {
      case ThemeAwareButtonType.primary:
        button = ElevatedButton(
          onPressed: onPressed,
          style: theme.elevatedButtonTheme.style,
          child: buttonChild,
        );
        break;
      case ThemeAwareButtonType.secondary:
        button = OutlinedButton(
          onPressed: onPressed,
          style: theme.outlinedButtonTheme.style,
          child: buttonChild,
        );
        break;
      case ThemeAwareButtonType.text:
        button = TextButton(
          onPressed: onPressed,
          style: theme.textButtonTheme.style,
          child: buttonChild,
        );
        break;
    }

    return SizedBox(
      width: width,
      height: height ?? 48,
      child: Padding(
        padding: padding ?? EdgeInsets.zero,
        child: button,
      ),
    );
  }
}

enum ThemeAwareButtonType {
  primary,
  secondary,
  text,
}
