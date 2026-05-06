// Auth Service
// 认证服务，处理用户登录、注册、用户信息管理

import 'package:shared_preferences/shared_preferences.dart';
import '../models/models.dart';
import '../config/api_config.dart';
import 'api_service.dart';

class AuthService {
  final ApiService _apiService = ApiService();

  /// 用户注册
  Future<User> register({
    required String email,
    required String username,
    required String password,
  }) async {
    final response = await _apiService.post(
      '/auth/register',
      requiresAuth: false,
      body: {
        'email': email,
        'username': username,
        'password': password,
      },
    );

    final token = response['token'];
    final user = User.fromJson(response['user']);

    await _apiService.saveToken(token);
    await _saveUser(user);

    return user;
  }

  /// 用户登录
  Future<User> login({
    required String email,
    required String password,
  }) async {
    final response = await _apiService.post(
      '/auth/login',
      requiresAuth: false,
      body: {
        'email': email,
        'password': password,
      },
    );

    final token = response['token'];
    final user = User.fromJson(response['user']);

    await _apiService.saveToken(token);
    await _saveUser(user);

    return user;
  }

  /// 获取当前用户信息
  Future<User?> getCurrentUser() async {
    try {
      final response = await _apiService.get('/auth/me');
      final user = User.fromJson(response);
      await _saveUser(user);
      return user;
    } catch (e) {
      return null;
    }
  }

  /// 获取JWT Token
  Future<String?> getToken() async {
    return await _apiService.getToken();
  }

/// 检查是否已登录
  Future<bool> isLoggedIn() async {
    final token = await _apiService.getToken();
    if (token == null) {
      return false;
    }

    final user = await getCurrentUser();
    return user != null;
  }

  /// 登出
  Future<void> logout() async {
    await _apiService.deleteToken();
    await _deleteUser();
  }

  /// 保存用户信息到本地
  Future<void> _saveUser(User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(ApiConfig.userKey, user.toJson().toString());
  }

  /// 从本地获取用户信息
  Future<User?> getUserFromStorage() async {
    final prefs = await SharedPreferences.getInstance();
    final userJson = prefs.getString(ApiConfig.userKey);

    if (userJson == null) {
      return null;
    }

    try {
      final Map<String, dynamic> userMap = {};
      final user = User.fromJson(userMap);
      return user;
    } catch (e) {
      return null;
    }
  }

  /// 删除本地用户信息
  Future<void> _deleteUser() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(ApiConfig.userKey);
  }
}