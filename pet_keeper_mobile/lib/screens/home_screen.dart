// Home Screen
// 主页面，包含底部导航栏

import 'package:flutter/material.dart';
import 'species_screen.dart';
import 'pets_screen.dart';
import 'community_screen.dart';
import 'profile_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    SpeciesScreen(),
    PetsScreen(),
    CommunityScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Color(0xFF4a784a),
        unselectedItemColor: Colors.grey,
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.category),
            label: '物种图鉴',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.pets),
            label: '我的宠物',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.forum),
            label: '社区',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: '我的',
          ),
        ],
      ),
    );
  }
}