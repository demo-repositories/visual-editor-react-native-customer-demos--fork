import Loading from "@/components/Loading";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useQuery } from "@/hooks/useQueryStore";
import { STORE_BY_ID_QUERY } from "@/sanity/queries";
import { StoreDoc } from "@/types/sanity";
import { getImageUrl } from "@/utils/image_url";
import { clean, toSanityAttr } from "@/utils/preview";
import { Stack, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet } from "react-native";

export default function StoreScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = clean(Array.isArray(params.id) ? params.id[0] : params.id);
  const colorScheme = useColorScheme() ?? "light";
  const tint = Colors[colorScheme].tint;

  const { data: store, encodeDataAttribute } = useQuery<StoreDoc>(
    STORE_BY_ID_QUERY,
    { id },
  );

  if (!store) {
    return <Loading />;
  }

  const imageUrl = getImageUrl(store.image, 1200);
  const address = store.address;
  const addressLines = [
    address?.street,
    [address?.city, address?.state, address?.postalCode]
      .filter(Boolean)
      .join(", "),
    address?.country,
  ].filter(Boolean);

  return (
    <ParallaxScrollView
      headerImage={
        imageUrl ? (
          <Image
            {...toSanityAttr(encodeDataAttribute(["image"]))}
            source={{ uri: imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : (
          <ThemedView
            style={[
              styles.heroImage,
              styles.heroPlaceholder,
              { backgroundColor: tint + "22" },
            ]}
          >
            <ThemedText type="subtitle" style={{ color: tint }}>
              {store.title}
            </ThemedText>
          </ThemedView>
        )
      }
      headerBackgroundColor={{ light: "#FFF", dark: "#1D3D47" }}
    >
      <Stack.Screen options={{ title: store.title ?? "Store" }} />

      <ThemedView style={styles.section}>
        <ThemedText type="title">{store.title}</ThemedText>
      </ThemedView>

      {addressLines.length > 0 ? (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Address</ThemedText>
          {addressLines.map((line, i) => (
            <ThemedText key={i} type="default">
              {line}
            </ThemedText>
          ))}
        </ThemedView>
      ) : null}

      {store.phone ? (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Phone</ThemedText>
          <ThemedText type="default">{store.phone}</ThemedText>
        </ThemedView>
      ) : null}

      {store.hours ? (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Hours</ThemedText>
          <ThemedText type="default">{store.hours}</ThemedText>
        </ThemedView>
      ) : null}

      {store.location ? (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Location</ThemedText>
          <ThemedText type="default">
            {store.location.lat?.toFixed?.(5)},{" "}
            {store.location.lng?.toFixed?.(5)}
          </ThemedText>
        </ThemedView>
      ) : null}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  section: {
    gap: 8,
  },
});
