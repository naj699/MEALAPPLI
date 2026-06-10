import { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView,
  ActivityIndicator, StyleSheet, Linking, TouchableOpacity
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../../constants/colors';

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then(r => r.json())
      .then(data => setMeal(data.meals?.[0]))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  if (!meal) return (
    <View style={styles.center}>
      <Text style={styles.error}>Recette introuvable.</Text>
    </View>
  );

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim()) ingredients.push(`${meas?.trim() || ''} ${ing.trim()}`);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.hero} />
      <View style={styles.body}>
        <Text style={styles.title}>{meal.strMeal}</Text>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>🍽️ {meal.strCategory}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>🌍 {meal.strArea}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Ingrédients</Text>
        <View style={styles.ingBox}>
          {ingredients.map((ing, i) => (
            <View key={i} style={styles.ingRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.ingText}>{ing}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructions}>{meal.strInstructions}</Text>

        {meal.strYoutube ? (
          <TouchableOpacity
            style={styles.ytBtn}
            onPress={() => Linking.openURL(meal.strYoutube)}
          >
            <Text style={styles.ytText}>▶ Voir la vidéo YouTube</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: colors.subtext, fontSize: 16 },
  hero: { width: '100%', height: 260 },
  body: { padding: 18 },
  title: { fontSize: 22, fontWeight: '800', color: colors.secondary, marginBottom: 10 },
  tags: { flexDirection: 'row', gap: 8, marginBottom: 18, flexWrap: 'wrap' },
  tag: {
    backgroundColor: colors.accent + '33',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: { fontSize: 13, color: colors.secondary, fontWeight: '600' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 10,
    marginTop: 4,
  },
  ingBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    elevation: 1,
  },
  ingRow: { flexDirection: 'row', marginBottom: 4, alignItems: 'flex-start' },
  bullet: { color: colors.primary, fontSize: 16, marginRight: 8 },
  ingText: { fontSize: 14, color: colors.text, flex: 1 },
  instructions: { fontSize: 14, color: colors.text, lineHeight: 22 },
  ytBtn: {
    backgroundColor: '#FF0000',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  ytText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});