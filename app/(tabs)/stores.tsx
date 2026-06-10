import GridTile from "@/components/GridTile";
import Loading from "@/components/Loading";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocale } from "@/contexts/LocaleContext";
import { useQuery } from "@/hooks/useQueryStore";
import { STORES_QUERY } from "@/sanity/queries";
import { StoreListItem } from "@/types/sanity";
import { getImageUrl } from "@/utils/image_url";
import { clean, createDataAttributeProp } from "@/utils/preview";
import { ScrollView, StyleSheet } from "react-native";

export default function StoresScreen() {
  const { locale } = useLocale();
  const { data } = useQuery<StoreListItem[]>(STORES_QUERY, { locale });

  if (!data) {
    return <Loading />;
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Stores</ThemedText>
          <ThemedText type="default">Find a Boot Barn near you</ThemedText>
        </ThemedView>

        {data.length === 0 ? (
          <ThemedText type="default">
            No stores found for this locale.
          </ThemedText>
        ) : (
          <ThemedView style={styles.grid}>
            {data.map((store) => (
              <GridTile
                key={store._id}
                title={store.title}
                subtitle={[store.address?.city, store.address?.state]
                  .filter(Boolean)
                  .join(", ")}
                imageUrl={getImageUrl(store.image, 600)}
                href={{
                  pathname: "/store/[id]",
                  params: { id: clean(store._id) },
                }}
                dataAttr={createDataAttributeProp({
                  id: clean(store._id),
                  type: store._type,
                  path: "image",
                })}
              />
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
});
