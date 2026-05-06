// API Configuration
// 配置后端API地址和相关参数

class ApiConfig {
  // NAS生产环境API地址 (通过Tailscale)
  static const String nasBaseUrl = 'http://100.84.59.9:3001/api';

  // 开发环境API地址
  static const String devBaseUrl = 'http://localhost:3001/api';

  // 生产环境API地址
  static const String prodBaseUrl = 'https://your-production-api.com/api';

  // 当前使用的API地址 - 使用NAS后端
  static const String baseUrl = nasBaseUrl;

  // HTTP请求超时时间（毫秒）
  static const int timeoutDuration = 30000;

  // JWT Token存储key
  static const String tokenKey = 'jwt_token';

  // 用户信息存储key
  static const String userKey = 'user_info';

  // 图片上传最大大小（5MB）
  static const int maxImageSize = 5 * 1024 * 1024;

  // 支持的图片格式
  static const List<String> supportedImageFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
}