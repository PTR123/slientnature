import 'user.dart';

class Post {
  final int id;
  final String title;
  final String content;
  final String? image;
  final String? tags;
  final int authorId;
  final User? author;
  final int likesCount;
  final int commentsCount;
  final DateTime createdAt;

  Post({
    required this.id,
    required this.title,
    required this.content,
    this.image,
    this.tags,
    required this.authorId,
    this.author,
    required this.likesCount,
    required this.commentsCount,
    required this.createdAt,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'],
      title: json['title'],
      content: json['content'],
      image: json['image'],
      tags: json['tags'],
      authorId: json['authorId'],
      author: json['author'] != null
          ? User.fromJson(json['author'])
          : null,
      likesCount: json['likesCount'] ?? 0,
      commentsCount: json['commentsCount'] ?? 0,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'content': content,
      'image': image,
      'tags': tags,
    };
  }
}

/// Comment Model
/// 评论数据模型

class Comment {
  final int id;
  final String content;
  final int postId;
  final int userId;
  final User? user;
  final DateTime createdAt;

  Comment({
    required this.id,
    required this.content,
    required this.postId,
    required this.userId,
    this.user,
    required this.createdAt,
  });

  factory Comment.fromJson(Map<String, dynamic> json) {
    return Comment(
      id: json['id'],
      content: json['content'],
      postId: json['postId'],
      userId: json['userId'],
      user: json['user'] != null
          ? User.fromJson(json['user'])
          : null,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'content': content,
      'postId': postId,
    };
  }
}