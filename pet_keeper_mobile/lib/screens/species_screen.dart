// Species Screen
// 物种图鉴页面

import 'package:flutter/material.dart';

class SpeciesScreen extends StatelessWidget {
  const SpeciesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('物种图鉴'),
        backgroundColor: Color(0xFF4a784a),
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.category,
              size: 64,
              color: Colors.grey,
            ),
            SizedBox(height: 16),
            Text(
              '物种图鉴功能',
              style: TextStyle(
                fontSize: 20,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 8),
            Text(
              '浏览异宠物种信息、饲养指南',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[400],
              ),
            ),
          ],
        ),
      ),
    );
  }
}