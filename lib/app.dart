// Main App File
import 'package:flutter/material.dart';
import 'package:greentoad_app/routes/router.dart';
import 'package:greentoad_app/config/theme.dart';

class GreenToadApp extends StatelessWidget {
  const GreenToadApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      // loads all app routes configured with go_router
      routerConfig: AppRouter.router,

      // removing debug banner
      debugShowCheckedModeBanner: false,

      // applying custom themes
      theme: AppThemes.lightTheme,
      darkTheme: AppThemes.darkTheme,
      themeMode: ThemeMode.system,
    );
  }
}
