import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { clean, isWeb } from '@/utils/preview'
import * as WebBrowser from 'expo-web-browser'
import { Linking, Pressable, StyleSheet } from 'react-native'

export type SocialPostItem = {
  _key?: string
  url?: string
  dataAttr?: Record<string, any>
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
      {valid.map((post, i) => {
        const url = clean(post.url as string)
        return (
          <Pressable
            key={post._key ?? `${url}-${i}`}
            onPress={() => open(post.url as string)}
            {...(post.dataAttr || {})}
            style={styles.card}
          >
            <ThemedText type="defaultSemiBold">{platformFromUrl(url)}</ThemedText>
            <ThemedText type="default" numberOfLines={1} style={styles.url}>
              {url}
            </ThemedText>
          </Pressable>
        )
      })}
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
    padding: 12,
    gap: 4,
  },
  url: {
    opacity: 0.6,
    fontSize: 13,
  },
})
