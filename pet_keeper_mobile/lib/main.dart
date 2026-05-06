// 自然不语 - Flutter移动端
// 异宠饲养管理平台

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/providers.dart';
import 'screens/screens.dart';

void main() {
  runApp(const NatureApp());
}

class NatureApp extends StatelessWidget {
  const NatureApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: MaterialApp(
        title: '自然不语',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: Color(0xFF4a784a), // 森林绿
          ),
          useMaterial3: true,
          appBarTheme: AppBarTheme(
            backgroundColor: Color(0xFF4a784a),
            foregroundColor: Colors.white,
          ),
        ),
        home: AuthWrapper(),
      ),
    );
  }
}

/// Auth Wrapper
/// 认证包装器，根据登录状态显示不同页面
class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    // 使用addPostFrameCallback延迟初始化，避免在build过程中调用notifyListeners
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initializeAuth();
    });
  }

  Future<void> _initializeAuth() async {
    final authProvider = context.read<AuthProvider>();
    await authProvider.initialize();
    setState(() {
      _initialized = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!_initialized) {
      return Scaffold(
        body: Center(
          child: CircularProgressIndicator(
            color: Color(0xFF4a784a),
          ),
        ),
      );
    }

    final authProvider = context.watch<AuthProvider>();

    if (authProvider.isAuthenticated) {
      return const HomeScreen();
    } else {
      return const LoginScreen();
    }
  }
}