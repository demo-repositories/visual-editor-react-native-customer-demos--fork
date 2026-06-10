import Loading from "@/components/Loading";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import SocialPosts, { SocialPostItem } from "@/components/SocialPosts";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useQuery } from "@/hooks/useQueryStore";
import { EVENT_BY_ID_QUERY } from "@/sanity/queries";
import { EventDoc } from "@/types/sanity";
import { getImageUrl } from "@/utils/image_url";
import { clean, toSanityAttr } from "@/utils/preview";
import { PortableText } from "@portabletext/react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet } from "react-native";

function formatDate(date?: string) {
  if (!date) return undefined;
  const cleaned = clean(date);
  const parsed = new Date(cleaned);
  if (isNaN(parsed.getTime())) return cleaned;
  return parsed.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function EventScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = clean(Array.isArray(params.id) ? params.id[0] : params.id);
  const colorScheme = useColorScheme() ?? "light";
  const tint = Colors[colorScheme].tint;

  const { data: event, encodeDataAttribute } = useQuery<EventDoc>(
    EVENT_BY_ID_QUERY,
    { id },
  );

  if (!event) {
    return <Loading />;
  }

  const imageUrl = getImageUrl(event.image, 1200);
  const dateLabel = formatDate(event.date);

  const socialItems: SocialPostItem[] = (event.socialPosts ?? []).map(
    (post, i) => ({
      _key: post._key,
      url: post.url,
      dataAttr: toSanityAttr(encodeDataAttribute(["socialPosts", i, "url"])),
    }),
  );

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
              {event.title}
            </ThemedText>
          </ThemedView>
        )
      }
      headerBackgroundColor={{ light: "#FFF", dark: "#1D3D47" }}
    >
      <Stack.Screen options={{ title: event.title ?? "Event" }} />

      <ThemedView style={styles.section}>
        <ThemedText type="title">{event.title}</ThemedText>
        {dateLabel ? (
          <ThemedText type="defaultSemiBold">{dateLabel}</ThemedText>
        ) : null}
        {event.location ? (
          <ThemedText type="default">📍 {event.location}</ThemedText>
        ) : null}
      </ThemedView>

      {event.description ? (
        <ThemedView style={styles.section}>
          <PortableText value={event.description} />
        </ThemedView>
      ) : null}

      <SocialPosts posts={socialItems} />
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
