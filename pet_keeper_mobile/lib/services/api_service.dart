// API Service
// HTTP请求服务，处理所有API调用

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';

class ApiException implements Exception {
  final int statusCode;
  final String message;

  ApiException(this.statusCode, this.message);

  @override
  String toString() => 'ApiException: $statusCode - $message';
}

class ApiService {
  final String baseUrl = ApiConfig.baseUrl;
  final int timeout = ApiConfig.timeoutDuration;

  /// 获取JWT Token
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(ApiConfig.tokenKey);
  }

  /// 存储JWT Token
  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(ApiConfig.tokenKey, token);
  }

  /// 删除JWT Token
  Future<void> deleteToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(ApiConfig.tokenKey);
  }

  /// 构建请求头
  Future<Map<String, String>> _buildHeaders({bool requiresAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      final token = await getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  /// GET请求
  Future<Map<String, dynamic>> get(
    String path,
    {bool requiresAuth = true, Map<String, String>? queryParams}
  ) async {
    try {
      final uri = Uri.parse('$baseUrl$path').replace(queryParameters: queryParams);
      final headers = await _buildHeaders(requiresAuth: requiresAuth);

      final response = await http.get(
        uri,
        headers: headers,
      ).timeout(Duration(milliseconds: timeout));

      return _handleResponse(response);
    } catch (e) {
      if (e is ApiException) {
        rethrow;
      }
      throw ApiException(0, '网络请求失败: ${e.toString()}');
    }
  }

  /// POST请求
  Future<Map<String, dynamic>> post(
    String path,
    {bool requiresAuth = true, Map<String, dynamic>? body}
  ) async {
    try {
      final uri = Uri.parse('$baseUrl$path');
      final headers = await _buildHeaders(requiresAuth: requiresAuth);

      // Debug: 打印请求信息
      print('API POST Request: $uri');
      print('Headers: $headers');
      print('Body: $body');

      final response = await http.post(
        uri,
        headers: headers,
        body: body != null ? jsonEncode(body) : null,
      ).timeout(Duration(milliseconds: timeout));

      // Debug: 打印响应信息
      print('Response Status: ${response.statusCode}');
      print('Response Body: ${response.body}');

      return _handleResponse(response);
    } catch (e) {
      if (e is ApiException) {
        rethrow;
      }
      throw ApiException(0, '网络请求失败: ${e.toString()}');
    }
  }

  /// PUT请求
  Future<Map<String, dynamic>> put(
    String path,
    {bool requiresAuth = true, Map<String, dynamic>? body}
  ) async {
    try {
      final uri = Uri.parse('$baseUrl$path');
      final headers = await _buildHeaders(requiresAuth: requiresAuth);

      final response = await http.put(
        uri,
        headers: headers,
        body: body != null ? jsonEncode(body) : null,
      ).timeout(Duration(milliseconds: timeout));

      return _handleResponse(response);
    } catch (e) {
      if (e is ApiException) {
        rethrow;
      }
      throw ApiException(0, '网络请求失败: ${e.toString()}');
    }
  }

  /// DELETE请求
  Future<Map<String, dynamic>> delete(
    String path,
    {bool requiresAuth = true}
  ) async {
    try {
      final uri = Uri.parse('$baseUrl$path');
      final headers = await _buildHeaders(requiresAuth: requiresAuth);

      final response = await http.delete(
        uri,
        headers: headers,
      ).timeout(Duration(milliseconds: timeout));

      return _handleResponse(response);
    } catch (e) {
      if (e is ApiException) {
        rethrow;
      }
      throw ApiException(0, '网络请求失败: ${e.toString()}');
    }
  }

  /// 处理响应
  Map<String, dynamic> _handleResponse(http.Response response) {
    final statusCode = response.statusCode;
    final body = response.body;

    if (statusCode >= 200 && statusCode < 300) {
      if (body.isEmpty) {
        return {};
      }
      return jsonDecode(body);
    } else {
      String errorMessage;
      try {
        final errorBody = jsonDecode(body);
        errorMessage = errorBody['error'] ?? errorBody['message'] ?? '请求失败';
      } catch (e) {
        errorMessage = '请求失败 (状态码: $statusCode)';
      }
      throw ApiException(statusCode, errorMessage);
    }
  }

  /// 上传图片
  Future<String?> uploadImage(String imagePath) async {
    try {
      final uri = Uri.parse('$baseUrl/upload/image');
      final headers = await _buildHeaders(requiresAuth: true);

      final request = http.MultipartRequest('POST', uri);
      request.headers.addAll(headers);
      request.files.add(await http.MultipartFile.fromPath('image', imagePath));

      final response = await request.send().timeout(Duration(milliseconds: timeout));
      final responseBody = await response.stream.bytesToString();

      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = jsonDecode(responseBody);
        return data['url'];
      } else {
        final errorBody = jsonDecode(responseBody);
        throw ApiException(response.statusCode, errorBody['error'] ?? '图片上传失败');
      }
    } catch (e) {
      if (e is ApiException) {
        rethrow;
      }
      throw ApiException(0, '图片上传失败: ${e.toString()}');
    }
  }
}