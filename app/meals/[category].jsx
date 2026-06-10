import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Image, ActivityIndicator, StyleSheet, TextInput
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/colors';

export default function MealsScreen() {
  const { category } = useLocalSearchParams();
  const [meals, setMeals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then(r => r.json())
      .then(data => {
        setMeals(data.meals || []);
        setFiltered(data.meals || []);
      })
      .finally(() => setLoading(false));
  }, [category]);

  const handleSearch = (text) => {
    setSearch(text);
    if (!text) return setFiltered(meals);
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${text}`)
      .then(r => r.json())
      .then(data => setFiltered(data.meals || []));
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="🔍 Rechercher une recette..."
          placeholderTextColor={colors.subtext}
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.idMeal}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/meals/detail/${item.idMeal}`)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.strMealThumb }} style={styles.image} />
            <Text style={styles.name}>{item.strMeal}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchBox: { paddingHorizontal: 14, paddingVertical: 10 },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  list: { padding: 14 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  image: { width: 90, height: 80 },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondary,
    marginHorizontal: 14,
  },
});