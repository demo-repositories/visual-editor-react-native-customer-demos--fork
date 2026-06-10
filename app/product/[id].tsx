import Loading from '@/components/Loading';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import SocialPosts, { SocialPostItem } from '@/components/SocialPosts';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useQuery } from '@/hooks/useQueryStore';
import { PRODUCT_BY_ID_QUERY } from '@/sanity/queries';
import { Product, ProductMediaImage, ProductMediaSocial, ProductMediaVideo } from '@/types/sanity';
import { getImageUrl } from '@/utils/image_url';
import { clean, createDataAttributeProp, toSanityAttr } from '@/utils/preview';
import { PortableText } from '@portabletext/react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';

export default function ProductScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = clean(Array.isArray(params.id) ? params.id[0] : params.id);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const tint = Colors[colorScheme].tint;

  const { data: product, encodeDataAttribute } = useQuery<Product>(PRODUCT_BY_ID_QUERY, { id });

  if (!product) {
    return <Loading />;
  }

  const media = product.imagesAndVideos ?? [];
  const images = media
    .map((m, index) => ({ m, index }))
    .filter((x): x is { m: ProductMediaImage; index: number } => x.m._type === 'image');
  const videos = media
    .map((m, index) => ({ m, index }))
    .filter((x): x is { m: ProductMediaVideo; index: number } => x.m._type === 'video');

  const hero = images[0];
  const heroUrl = getImageUrl(hero?.m, 1200);

  // Social posts come from the dedicated socialPosts[] field AND any socialPost
  // members embedded in imagesAndVideos[]. Each carries its own edit path.
  const socialItems: SocialPostItem[] = [
    ...(product.socialPosts ?? []).map((post, i) => ({
      _key: post._key,
      url: post.url,
      dataAttr: toSanityAttr(encodeDataAttribute(['socialPosts', i, 'url'])),
    })),
    ...media
      .map((m, index) => ({ m, index }))
      .filter((x): x is { m: ProductMediaSocial; index: number } => x.m._type === 'socialPost')
      .map(({ m, index }) => ({
        _key: m._key,
        url: m.url,
        dataAttr: toSanityAttr(encodeDataAttribute(['imagesAndVideos', index, 'url'])),
      })),
  ];

  return (
    <ParallaxScrollView
      headerImage={
        heroUrl ? (
          <Image
            {...toSanityAttr(encodeDataAttribute(['imagesAndVideos', hero.index]))}
            source={{ uri: heroUrl }}
            style={styles.heroImage}
            resizeMode="contain"
          />
        ) : (
          <ThemedView style={[styles.heroImage, styles.heroPlaceholder, { backgroundColor: tint + '22' }]}>
            <ThemedText type="subtitle" style={{ color: tint }}>
              {product.title}
            </ThemedText>
          </ThemedView>
        )
      }
      headerBackgroundColor={{ light: '#FFF', dark: '#1D3D47' }}
    >
      <Stack.Screen options={{ title: product.title ?? 'Product' }} />

      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.push('/'))}
        style={styles.backButton}
        hitSlop={8}
      >
        <ThemedText type="defaultSemiBold" style={[styles.backText, { color: tint }]}>
          ‹ Back
        </ThemedText>
      </Pressable>

      <ThemedView style={styles.section}>
        <ThemedText type="title">{product.title}</ThemedText>
      </ThemedView>

      {product.parents && product.parents.length > 0 ? (
        <ThemedView style={styles.pills}>
          {product.parents.map((parent) => (
            <Pressable
              key={parent._id}
              style={[styles.pill, { borderColor: tint }]}
              onPress={() =>
                router.push({ pathname: '/category/[id]', params: { id: clean(parent._id) } })
              }
            >
              <ThemedText type="default" style={[styles.pillText, { color: tint }]}>
                {parent.title}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      ) : null}

      {product.description && product.description.length > 0 ? (
        <ThemedView
          style={styles.section}
          {...toSanityAttr(encodeDataAttribute(['description']))}
        >
          <PortableText value={product.description} />
        </ThemedView>
      ) : null}

      {images.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gallery}>
          {images.map(({ m, index }) => {
            const thumb = getImageUrl(m, 400);
            if (!thumb) return null;
            return (
              <Image
                key={m._key ?? index}
                {...toSanityAttr(encodeDataAttribute(['imagesAndVideos', index]))}
                source={{ uri: thumb }}
                style={styles.thumb}
                resizeMode="cover"
              />
            );
          })}
        </ScrollView>
      ) : null}

      {videos.length > 0 ? (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Videos</ThemedText>
          {videos.map(({ m, index }) => (
            <ThemedView
              key={m._key ?? index}
              {...createDataAttributeProp({ id: clean(product._id), type: product._type, path: `imagesAndVideos[_key=="${m._key}"]` })}
              style={styles.videoCard}
            >
              <ThemedText type="defaultSemiBold">🎬 {m.title || 'Video'}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      ) : null}

      <SocialPosts posts={socialItems} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    gap: 8,
  },
  gallery: {
    gap: 10,
    paddingVertical: 4,
  },
  thumb: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  videoCard: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8884',
    borderRadius: 10,
    padding: 12,
  },
});
