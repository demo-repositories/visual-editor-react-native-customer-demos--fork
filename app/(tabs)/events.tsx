import GridTile from '@/components/GridTile';
import Loading from '@/components/Loading';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocale } from '@/contexts/LocaleContext';
import { useQuery } from '@/hooks/useQueryStore';
import { EVENTS_QUERY } from '@/sanity/queries';
import { EventListItem } from '@/types/sanity';
import { getImageUrl } from '@/utils/image_url';
import { clean, createDataAttributeProp } from '@/utils/preview';
import { ScrollView, StyleSheet } from 'react-native';

function formatDate(date?: string) {
  if (!date) return undefined;
  const cleaned = clean(date);
  const parsed = new Date(cleaned);
  if (isNaN(parsed.getTime())) return cleaned;
  return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function EventsScreen() {
  const { locale } = useLocale();
  const { data } = useQuery<EventListItem[]>(EVENTS_QUERY, { locale });

  if (!data) {
    return <Loading />;
  }

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Events</ThemedText>
          <ThemedText type="default">What&apos;s happening near you</ThemedText>
        </ThemedView>

        {data.length === 0 ? (
          <ThemedText type="default">No events found for this locale.</ThemedText>
        ) : (
          <ThemedView style={styles.grid}>
            {data.map((event) => (
              <GridTile
                key={event._id}
                title={event.title}
                subtitle={[formatDate(event.date), event.location ? clean(event.location) : undefined]
                  .filter(Boolean)
                  .join(' · ')}
                imageUrl={getImageUrl(event.image, 600)}
                href={{ pathname: '/event/[id]', params: { id: clean(event._id) } }}
                dataAttr={createDataAttributeProp({ id: clean(event._id), type: event._type, path: 'image' })}
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
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    padding: 16,
    paddingBottom: 64,
    gap: 16,
  },
  header: {
    gap: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
});
