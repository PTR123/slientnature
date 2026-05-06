// User Model
// 用户数据模型

class User {
  final String id;  // 改为String类型，API返回的是UUID
  final String email;
  final String username;
  final String? avatar;
  final String? role;
  final DateTime? createdAt;  // 改为可选

  User({
    required this.id,
    required this.email,
    required this.username,
    this.avatar,
    this.role,
    this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      username: json['username'] ?? '',
      avatar: json['avatar'],
      role: json['role'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'username': username,
      'avatar': avatar,
      'role': role,
      'createdAt': createdAt?.toIso8601String(),
    };
  }
}