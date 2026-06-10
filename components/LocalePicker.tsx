import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { useLocale } from '@/contexts/LocaleContext'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useQuery } from '@/hooks/useQueryStore'
import { LOCALES_QUERY } from '@/sanity/queries'
import { Locale } from '@/types/sanity'
import { clean } from '@/utils/preview'
import { useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet } from 'react-native'

export default function LocalePicker() {
  const { locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)
  const { data: locales } = useQuery<Locale[]>(LOCALES_QUERY)
  const colorScheme = useColorScheme() ?? 'light'
  const tint = Colors[colorScheme].tint

  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={styles.button} accessibilityLabel="Choose locale">
        <ThemedText type="defaultSemiBold" style={{ color: tint }}>
          {locale} ▾
        </ThemedText>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <ThemedView style={styles.sheet}>
            <ThemedText type="subtitle">Choose locale</ThemedText>
            <ScrollView style={styles.list}>
              {locales?.map((l) => {
                const code = clean(l.code)
                const selected = code === locale
                return (
                  <Pressable
                    key={l._id}
                    onPress={() => {
                      setLocale(code)
                      setOpen(false)
                    }}
                    style={[styles.row, selected && { backgroundColor: tint + '22' }]}
                  >
                    <ThemedText type="default">{l.title}</ThemedText>
                    <ThemedText type="default" style={styles.code}>
                      {code}
                      {selected ? '  ✓' : ''}
                    </ThemedText>
                  </Pressable>
                )
              })}
            </ScrollView>
          </ThemedView>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  sheet: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 14,
    padding: 20,
    gap: 12,
  },
  list: {
    maxHeight: 360,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 12,
  },
  code: {
    opacity: 0.6,
  },
})
