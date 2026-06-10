import Loading from "@/components/Loading";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useLocale } from "@/contexts/LocaleContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useQuery } from "@/hooks/useQueryStore";
import { TOP_CATEGORIES_QUERY } from "@/sanity/queries";
import { CategoryListItem } from "@/types/sanity";
import { clean, createDataAttributeProp } from "@/utils/preview";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet } from "react-native";

export default function StoreScreen() {
  const { locale } = useLocale();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const tint = Colors[colorScheme].tint;
  const { data } = useQuery<CategoryListItem[]>(TOP_CATEGORIES_QUERY, {
    locale,
  });

  if (!data) {
    return <Loading />;
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Store</ThemedText>
          <ThemedText type="default">Shop by category</ThemedText>
        </ThemedView>

        {data.length === 0 ? (
          <ThemedText type="default">
            No categories found for this locale.
          </ThemedText>
        ) : (
          <ThemedView style={styles.list}>
            {data.map((category) => (
              <Pressable
                key={category._id}
                {...createDataAttributeProp({
                  id: clean(category._id),
                  type: category._type,
                  path: "title",
                })}
                style={[styles.row, { borderColor: tint + "33" }]}
                onPress={() =>
                  router.push({
                    pathname: "/category/[id]",
                    params: { id: clean(category._id) },
                  })
                }
              >
                <ThemedText type="defaultSemiBold" style={styles.rowTitle}>
                  {category.title}
                </ThemedText>
                <ThemedText type="defaultSemiBold" style={{ color: tint }}>
                  ›
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    padding: 16,
    paddingBottom: 64,
    gap: 16,
  },
  header: {
    gap: 4,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowTitle: {
    fontSize: 16,
  },
});
