import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useWatchlistStore } from '../../store/watchlistStore';
import type { Movie } from '../../api/types/movie';
import { Colors, Spacing } from '../../theme/theme';
import { DETAILS_SCREEN } from '../../constants/screens';
import { Typography } from '../../components/Typography';
import type { RootStackNavigationProp } from '../../navigation/types';
import WatchlistRow from './components/WatchlistRow';

const Separator = () => <View style={styles.separator} />;

export default function WatchlistScreen() {
  const { items, remove } = useWatchlistStore();
  const navigation = useNavigation<RootStackNavigationProp>();

  const goToDetail = useCallback(
    (movie: Movie) => {
      navigation.navigate(DETAILS_SCREEN, { movieId: movie.id, movie });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Movie }) => {
      return (
        <WatchlistRow
          movie={item}
          onPress={() => goToDetail(item)}
          onRemove={() => remove(item.id)}
        />
      );
    },
    [goToDetail, remove],
  );
  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Typography variant="heading">WATCHLIST</Typography>
          <Typography variant="caption" color={Colors.textMuted}>
            {items.length} {items.length === 1 ? 'film' : 'films'}
          </Typography>
        </View>
        {items.length === 0 ? (
          <View style={styles.empty}>
            <Typography variant="heading">🎬</Typography>
            <Typography variant="title" style={styles.emptyTitle}>
              Your watchlist is empty
            </Typography>
            <Typography
              variant="body"
              color={Colors.textMuted}
              style={styles.emptySubtitle}
            >
              Add films from the home screen to curate your premiere night
              lineup.
            </Typography>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            ItemSeparatorComponent={Separator}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  logo: {
    fontSize: 20,
    fontWeight: '300',
    letterSpacing: 6,
    color: Colors.text,
    fontStyle: 'italic',
  },
  count: { fontSize: 12, color: Colors.textMuted, fontWeight: '600' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  list: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl },
  separator: { height: 1, backgroundColor: Colors.border, marginLeft: 80 },
});
