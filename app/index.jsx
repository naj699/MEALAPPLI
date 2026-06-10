import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  Image, ActivityIndicator, StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../constants/colors';

export default function HomeScreen() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
      .then(r => r.json())
      .then(data => setCategories(data.categories))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={categories}
        keyExtractor={item => item.idCategory}
        numColumns={2}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/meals/${item.strCategory}`)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.strCategoryThumb }} style={styles.image} />
            <Text style={styles.name}>{item.strCategory}</Text>
            <Text style={styles.desc} numberOfLines={2}>
              {item.strCategoryDescription}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 12 },
  row: { justifyContent: 'space-between' },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: '48%',
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: '100%', height: 120 },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
    marginHorizontal: 10,
    marginTop: 8,
  },
  desc: {
    fontSize: 11,
    color: colors.subtext,
    marginHorizontal: 10,
    marginBottom: 10,
    lineHeight: 16,
  },
});