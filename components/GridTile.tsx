import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Href, useRouter } from 'expo-router'
import { Image, Pressable, StyleSheet } from 'react-native'

type Props = {
  title: string
  href: Href
  imageUrl?: string | null
  subtitle?: string
  dataAttr?: Record<string, any>
}

export default function GridTile({ title, href, imageUrl, subtitle, dataAttr }: Props) {
  const colorScheme = useColorScheme() ?? 'light'
  const tint = Colors[colorScheme].tint
  const router = useRouter()

  return (
    <Pressable style={styles.tile} onPress={() => router.push(href)}>
      <ThemedView style={styles.card}>
        {imageUrl ? (
          <Image {...dataAttr} source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <ThemedView {...dataAttr} style={[styles.image, styles.placeholder, { backgroundColor: tint + '22' }]}>
            <ThemedText type="defaultSemiBold" numberOfLines={2} style={{ color: tint, textAlign: 'center' }}>
              {title}
            </ThemedText>
          </ThemedView>
        )}
        <ThemedText type="defaultSemiBold" numberOfLines={2} style={styles.title}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="default" numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </ThemedText>
        ) : null}
      </ThemedView>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  tile: {
    width: '48%',
  },
  card: {
    gap: 6,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 15,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.6,
  },
})
