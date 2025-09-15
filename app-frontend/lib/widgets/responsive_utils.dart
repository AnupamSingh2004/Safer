import 'package:flutter/material.dart';

/// Utility class for handling responsive layouts and preventing overflow
class ResponsiveUtils {
  static bool isSmallScreen(BuildContext context) {
    return MediaQuery.of(context).size.width < 600;
  }

  static bool isMediumScreen(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    return width >= 600 && width < 1200;
  }

  static bool isLargeScreen(BuildContext context) {
    return MediaQuery.of(context).size.width >= 1200;
  }

  static double getResponsivePadding(BuildContext context) {
    if (isSmallScreen(context)) return 16.0;
    if (isMediumScreen(context)) return 24.0;
    return 32.0;
  }

  static double getResponsiveFontSize(BuildContext context, double baseFontSize) {
    final screenWidth = MediaQuery.of(context).size.width;
    if (screenWidth < 360) return baseFontSize * 0.9;
    if (screenWidth > 400) return baseFontSize * 1.1;
    return baseFontSize;
  }

  static EdgeInsets getResponsiveMargin(BuildContext context) {
    final padding = getResponsivePadding(context);
    return EdgeInsets.all(padding);
  }

  static double getResponsiveCardWidth(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    if (isSmallScreen(context)) return screenWidth * 0.9;
    if (isMediumScreen(context)) return screenWidth * 0.7;
    return screenWidth * 0.5;
  }
}

/// A widget that prevents overflow by automatically wrapping content
class OverflowSafeWidget extends StatelessWidget {
  final Widget child;
  final Axis direction;

  const OverflowSafeWidget({
    super.key,
    required this.child,
    this.direction = Axis.horizontal,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: direction,
      child: child,
    );
  }
}

/// A responsive column that handles overflow gracefully
class ResponsiveColumn extends StatelessWidget {
  final List<Widget> children;
  final MainAxisAlignment mainAxisAlignment;
  final CrossAxisAlignment crossAxisAlignment;
  final bool scrollable;

  const ResponsiveColumn({
    super.key,
    required this.children,
    this.mainAxisAlignment = MainAxisAlignment.start,
    this.crossAxisAlignment = CrossAxisAlignment.center,
    this.scrollable = true,
  });

  @override
  Widget build(BuildContext context) {
    final column = Column(
      mainAxisAlignment: mainAxisAlignment,
      crossAxisAlignment: crossAxisAlignment,
      children: children,
    );

    if (scrollable) {
      return SingleChildScrollView(
        child: column,
      );
    }

    return column;
  }
}

/// A responsive row that wraps to multiple lines if needed
class ResponsiveRow extends StatelessWidget {
  final List<Widget> children;
  final MainAxisAlignment mainAxisAlignment;
  final WrapAlignment wrapAlignment;
  final double spacing;
  final double runSpacing;

  const ResponsiveRow({
    super.key,
    required this.children,
    this.mainAxisAlignment = MainAxisAlignment.start,
    this.wrapAlignment = WrapAlignment.start,
    this.spacing = 8.0,
    this.runSpacing = 8.0,
  });

  @override
  Widget build(BuildContext context) {
    if (ResponsiveUtils.isSmallScreen(context)) {
      return Wrap(
        alignment: wrapAlignment,
        spacing: spacing,
        runSpacing: runSpacing,
        children: children,
      );
    }

    return Row(
      mainAxisAlignment: mainAxisAlignment,
      children: children,
    );
  }
}

/// A container that automatically adjusts its constraints to prevent overflow
class ConstrainedContainer extends StatelessWidget {
  final Widget child;
  final double? maxWidth;
  final double? maxHeight;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;

  const ConstrainedContainer({
    super.key,
    required this.child,
    this.maxWidth,
    this.maxHeight,
    this.padding,
    this.margin,
  });

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    
    return Container(
      margin: margin,
      padding: padding,
      constraints: BoxConstraints(
        maxWidth: maxWidth ?? screenSize.width * 0.95,
        maxHeight: maxHeight ?? screenSize.height * 0.9,
      ),
      child: child,
    );
  }
}

/// A grid that automatically adjusts the number of columns based on screen size
class ResponsiveGrid extends StatelessWidget {
  final List<Widget> children;
  final double childAspectRatio;
  final double spacing;

  const ResponsiveGrid({
    super.key,
    required this.children,
    this.childAspectRatio = 1.0,
    this.spacing = 8.0,
  });

  @override
  Widget build(BuildContext context) {
    int crossAxisCount;
    
    if (ResponsiveUtils.isSmallScreen(context)) {
      crossAxisCount = 1;
    } else if (ResponsiveUtils.isMediumScreen(context)) {
      crossAxisCount = 2;
    } else {
      crossAxisCount = 3;
    }

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        childAspectRatio: childAspectRatio,
        crossAxisSpacing: spacing,
        mainAxisSpacing: spacing,
      ),
      itemCount: children.length,
      itemBuilder: (context, index) => children[index],
    );
  }
}

/// A flexible text widget that automatically adjusts font size to prevent overflow
class FlexibleText extends StatelessWidget {
  final String text;
  final TextStyle? style;
  final int maxLines;
  final TextAlign textAlign;

  const FlexibleText(
    this.text, {
    super.key,
    this.style,
    this.maxLines = 1,
    this.textAlign = TextAlign.center,
  });

  @override
  Widget build(BuildContext context) {
    return FittedBox(
      fit: BoxFit.scaleDown,
      child: Text(
        text,
        style: style,
        maxLines: maxLines,
        textAlign: textAlign,
        overflow: TextOverflow.ellipsis,
      ),
    );
  }
}
