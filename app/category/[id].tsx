import GridTile from "@/components/GridTile";
import Loading from "@/components/Loading";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useLocale } from "@/contexts/LocaleContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useQuery } from "@/hooks/useQueryStore";
import {
  ALL_CATEGORIES_QUERY,
  CATEGORY_BY_ID_QUERY,
  PRODUCTS_IN_CATEGORIES_QUERY,
  SUBCATEGORIES_QUERY,
} from "@/sanity/queries";
import {
  Category,
  CategoryListItem,
  CategoryTreeNode,
  ProductListItem,
} from "@/types/sanity";
import { getDescendantIds } from "@/utils/categoryTree";
import { getImageUrl } from "@/utils/image_url";
import { clean, createDataAttributeProp } from "@/utils/preview";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";

export default function CategoryScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = clean(Array.isArray(params.id) ? params.id[0] : params.id);
  const { locale } = useLocale();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const tint = Colors[colorScheme].tint;

  const { data: category } = useQuery<Category>(CATEGORY_BY_ID_QUERY, { id });
  const { data: subcategories } = useQuery<CategoryListItem[]>(
    SUBCATEGORIES_QUERY,
    { locale, id },
  );
  const { data: allCategories } = useQuery<CategoryTreeNode[]>(
    ALL_CATEGORIES_QUERY,
    { locale },
  );

  const ids = useMemo(() => {
    if (!allCategories) return [id];
    const nodes = allCategories.map((c) => ({
      _id: clean(c._id),
      parentId: c.parentId ? clean(c.parentId) : null,
    }));
    return getDescendantIds(nodes, id);
  }, [allCategories, id]);

  const { data: products } = useQuery<ProductListItem[]>(
    PRODUCTS_IN_CATEGORIES_QUERY,
    { locale, ids },
  );

  if (!category) {
    return <Loading />;
  }

  return (
    <ThemedView style={styles.screen}>
      <Stack.Screen options={{ title: category.title ?? "Category" }} />
      <ScrollView contentContainerStyle={styles.content}>
        {category.parent ? (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/category/[id]",
                params: { id: clean(category.parent!._id) },
              })
            }
          >
            <ThemedText
              type="defaultSemiBold"
              style={[styles.breadcrumb, { color: tint }]}
            >
              ‹ {category.parent.title}
            </ThemedText>
          </Pressable>
        ) : null}

        <ThemedText type="title">{category.title}</ThemedText>

        {subcategories && subcategories.length > 0 ? (
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle">Subcategories</ThemedText>
            <ThemedView style={styles.pills}>
              {subcategories.map((sub) => (
                <Pressable
                  key={sub._id}
                  {...createDataAttributeProp({
                    id: clean(sub._id),
                    type: sub._type,
                    path: "title",
                  })}
                  style={[styles.pill, { borderColor: tint }]}
                  onPress={() =>
                    router.push({
                      pathname: "/category/[id]",
                      params: { id: clean(sub._id) },
                    })
                  }
                >
                  <ThemedText type="default" style={{ color: tint }}>
                    {sub.title}
                  </ThemedText>
                </Pressable>
              ))}
            </ThemedView>
          </ThemedView>
        ) : null}

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Products</ThemedText>
          {!products ? (
            <Loading />
          ) : products.length === 0 ? (
            <ThemedText type="default">
              No products in this category yet.
            </ThemedText>
          ) : (
            <ThemedView style={styles.grid}>
              {products.map((product) => (
                <GridTile
                  key={product._id}
                  title={product.title}
                  imageUrl={getImageUrl(product.image, 600)}
                  href={{
                    pathname: "/product/[id]",
                    params: { id: clean(product._id) },
                  }}
                  dataAttr={createDataAttributeProp({
                    id: clean(product._id),
                    type: product._type,
                    path: "title",
                  })}
                />
              ))}
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 64,
    gap: 16,
  },
  breadcrumb: {
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    gap: 12,
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
});
