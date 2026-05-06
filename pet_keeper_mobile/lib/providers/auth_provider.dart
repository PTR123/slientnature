// Auth Provider
// 认证状态管理

import 'package:flutter/foundation.dart';
import '../models/models.dart';
import '../services/auth_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;

  /// 初始化，检查是否已登录
  Future<void> initialize() async {
    _isLoading = true;
    notifyListeners();

    try {
      // 只检查token是否存在，不立即验证
      final token = await _authService.getToken();
      if (token != null) {
        // 尝试获取用户信息
        _user = await _authService.getCurrentUser();
      }
    } catch (e) {
      // 初始化失败不显示错误，清除token
      await _authService.logout();
      _user = null;
    }

    _isLoading = false;
    notifyListeners();
  }

  /// 用户注册
  Future<bool> register({
    required String email,
    required String username,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await _authService.register(
        email: email,
        username: username,
        password: password,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// 用户登录
  Future<bool> login({
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await _authService.login(
        email: email,
        password: password,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  /// 用户登出
  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    await _authService.logout();
    _user = null;

    _isLoading = false;
    notifyListeners();
  }

  /// 清除错误信息
  void clearError() {
    _error = null;
    notifyListeners();
  }
}