import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { clean, isWeb } from '@/utils/preview'
import * as WebBrowser from 'expo-web-browser'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Linking, Pressable, StyleSheet } from 'react-native'

export type SocialPostItem = {
  _key?: string
  url?: string
  dataAttr?: Record<string, any>
}

type Preview = {
  image?: string | null
  title?: string | null
  description?: string | null
  aspectRatio?: number
}

function platformFromUrl(url: string): string {
  const u = url.toLowerCase()
  if (u.includes('instagram')) return 'Instagram'
  if (u.includes('tiktok')) return 'TikTok'
  if (u.includes('youtube') || u.includes('youtu.be')) return 'YouTube'
  if (u.includes('twitter') || u.includes('x.com')) return 'X'
  if (u.includes('facebook') || u.includes('fb.')) return 'Facebook'
  if (u.includes('pinterest')) return 'Pinterest'
  return 'Link'
}

// In-memory cache so we don't re-fetch the same preview while navigating.
const previewCache = new Map<string, Preview>()

async function fetchPreview(url: string): Promise<Preview> {
  if (previewCache.has(url)) return previewCache.get(url) as Preview
  const endpoint = `https://api.microlink.io/?url=${encodeURIComponent(url)}`
  const res = await fetch(endpoint)
  const json = await res.json()
  const data = json?.data ?? {}
  const img = data?.image ?? data?.logo
  const aspectRatio =
    img?.width && img?.height ? img.width / img.height : undefined
  const preview: Preview = {
    image: img?.url ?? null,
    title: data?.title ?? null,
    description: data?.description ?? null,
    aspectRatio,
  }
  previewCache.set(url, preview)
  return preview
}

function SocialPostCard({
  post,
  onPress,
}: {
  post: SocialPostItem
  onPress: (url: string) => void
}) {
  const url = clean(post.url as string)
  const platform = platformFromUrl(url)
  const [preview, setPreview] = useState<Preview | null>(
    previewCache.get(url) ?? null,
  )
  const [loading, setLoading] = useState(!previewCache.has(url))

  useEffect(() => {
    let active = true
    if (previewCache.has(url)) {
      setPreview(previewCache.get(url) as Preview)
      setLoading(false)
      return
    }
    setLoading(true)
    fetchPreview(url)
      .then((p) => {
        if (active) setPreview(p)
      })
      .catch(() => {
        if (active) setPreview(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [url])

  return (
    <Pressable
      onPress={() => onPress(post.url as string)}
      {...(post.dataAttr || {})}
      style={styles.card}
    >
      {preview?.image ? (
        <Image
          source={{ uri: preview.image }}
          style={[styles.image, preview.aspectRatio ? { aspectRatio: preview.aspectRatio } : null]}
          resizeMode="cover"
        />
      ) : loading ? (
        <ThemedView style={[styles.image, styles.imageFallback]}>
          <ActivityIndicator />
        </ThemedView>
      ) : (
        <ThemedView style={[styles.image, styles.imageFallback]}>
          <ThemedText type="defaultSemiBold">{platform}</ThemedText>
        </ThemedView>
      )}
      <ThemedView style={styles.meta}>
        <ThemedText type="defaultSemiBold">{platform}</ThemedText>
        {preview?.title ? (
          <ThemedText type="default" numberOfLines={2} style={styles.metaTitle}>
            {preview.title}
          </ThemedText>
        ) : null}
        <ThemedText type="default" numberOfLines={1} style={styles.url}>
          {url}
        </ThemedText>
      </ThemedView>
    </Pressable>
  )
}

export default function SocialPosts({
  posts,
  title = 'Social posts',
}: {
  posts: SocialPostItem[]
  title?: string
}) {
  const valid = (posts || []).filter((p) => !!p?.url)
  if (valid.length === 0) return null

  const open = (rawUrl: string) => {
    const url = clean(rawUrl)
    if (!url) return
    if (isWeb) {
      Linking.openURL(url)
      return
    }
    WebBrowser.openBrowserAsync(url).catch(() => Linking.openURL(url))
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">{title}</ThemedText>
      {valid.map((post, i) => (
        <SocialPostCard
          key={post._key ?? `${clean(post.url as string)}-${i}`}
          post={post}
          onPress={open}
        />
      ))}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginTop: 8,
  },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8884',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  imageFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  meta: {
    padding: 12,
    gap: 4,
  },
  metaTitle: {
    fontSize: 14,
  },
  url: {
    opacity: 0.6,
    fontSize: 13,
  },
})
