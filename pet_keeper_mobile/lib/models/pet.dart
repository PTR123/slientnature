import 'species.dart';

class Pet {
  final int id;
  final String name;
  final String? image;
  final DateTime? birthDate;
  final DateTime? acquisitionDate;
  final int userId;
  final int speciesId;
  final Species? species;
  final List<Record>? records;
  final DateTime createdAt;

  Pet({
    required this.id,
    required this.name,
    this.image,
    this.birthDate,
    this.acquisitionDate,
    required this.userId,
    required this.speciesId,
    this.species,
    this.records,
    required this.createdAt,
  });

  factory Pet.fromJson(Map<String, dynamic> json) {
    return Pet(
      id: json['id'],
      name: json['name'],
      image: json['image'],
      birthDate: json['birthDate'] != null
          ? DateTime.parse(json['birthDate'])
          : null,
      acquisitionDate: json['acquisitionDate'] != null
          ? DateTime.parse(json['acquisitionDate'])
          : null,
      userId: json['userId'],
      speciesId: json['speciesId'],
      species: json['species'] != null
          ? Species.fromJson(json['species'])
          : null,
      records: json['records'] != null
          ? (json['records'] as List).map((r) => Record.fromJson(r)).toList()
          : null,
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'image': image,
      'birthDate': birthDate?.toIso8601String(),
      'acquisitionDate': acquisitionDate?.toIso8601String(),
      'speciesId': speciesId,
    };
  }
}

/// Record Model
/// 饲养记录数据模型

enum RecordType {
  feeding,
  shedding,
  weighing,
  measuring,
  health,
  other,
}

class Record {
  final int id;
  final String type;
  final DateTime date;
  final String? notes;
  final String? image;
  final double? weight;
  final double? length;
  final int petId;
  final DateTime createdAt;

  Record({
    required this.id,
    required this.type,
    required this.date,
    this.notes,
    this.image,
    this.weight,
    this.length,
    required this.petId,
    required this.createdAt,
  });

  factory Record.fromJson(Map<String, dynamic> json) {
    return Record(
      id: json['id'],
      type: json['type'],
      date: DateTime.parse(json['date']),
      notes: json['notes'],
      image: json['image'],
      weight: json['weight']?.toDouble(),
      length: json['length']?.toDouble(),
      petId: json['petId'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'type': type,
      'date': date.toIso8601String(),
      'notes': notes,
      'image': image,
      'weight': weight,
      'length': length,
    };
  }
}