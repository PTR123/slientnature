// Species Model
// 物种数据模型

enum SpeciesCategory {
  insect,
  reptile,
  aquatic,
  amphibian,
  arachnid,
  other,
}

class EnvironmentParams {
  final double? minTemperature;
  final double? maxTemperature;
  final double? minHumidity;
  final double? maxHumidity;

  EnvironmentParams({
    this.minTemperature,
    this.maxTemperature,
    this.minHumidity,
    this.maxHumidity,
  });

  factory EnvironmentParams.fromJson(Map<String, dynamic> json) {
    return EnvironmentParams(
      minTemperature: json['minTemperature']?.toDouble(),
      maxTemperature: json['maxTemperature']?.toDouble(),
      minHumidity: json['minHumidity']?.toDouble(),
      maxHumidity: json['maxHumidity']?.toDouble(),
    );
  }
}

class Species {
  final int id;
  final String name;
  final String? scientificName;
  final String category;
  final String? description;
  final String? image;
  final EnvironmentParams? environmentParams;
  final String? diet;
  final String? lifecycle;
  final String? commonDiseases;

  Species({
    required this.id,
    required this.name,
    this.scientificName,
    required this.category,
    this.description,
    this.image,
    this.environmentParams,
    this.diet,
    this.lifecycle,
    this.commonDiseases,
  });

  factory Species.fromJson(Map<String, dynamic> json) {
    return Species(
      id: json['id'],
      name: json['name'],
      scientificName: json['scientificName'],
      category: json['category'],
      description: json['description'],
      image: json['image'],
      environmentParams: json['environmentParams'] != null
          ? EnvironmentParams.fromJson(json['environmentParams'])
          : null,
      diet: json['diet'],
      lifecycle: json['lifecycle'],
      commonDiseases: json['commonDiseases'],
    );
  }
}