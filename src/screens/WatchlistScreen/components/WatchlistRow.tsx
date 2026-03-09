import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../components/Typography';
import { Colors, Radius, Spacing } from '../../../theme/theme';
import { getPosterUrl } from '../../../utils/image';
import type { Movie } from '../../../api/types/movie';

function WatchlistRow({
  movie,
  onPress,
  onRemove,
}: {
  movie: Movie;
  onPress: () => void;
  onRemove: () => void;
}) {
  const uri = getPosterUrl(movie.poster_path ?? '', 'w185');
  const year = movie.release_date?.slice(0, 4) ?? '';
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.75}>
      {uri ? (
        <Image source={{ uri }} style={styles.thumb} resizeMode="cover" />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]}>
          <Typography variant="caption" color={Colors.textMuted}>
            {movie.title[0]}
          </Typography>
        </View>
      )}
      <View style={styles.rowInfo}>
        <Typography variant="title" numberOfLines={2}>
          {movie.title}
        </Typography>
        {year ? <Typography variant="caption">{year}</Typography> : null}
        {movie.vote_average > 0 && (
          <Typography variant="caption" color={Colors.accent}>
            ★ {movie.vote_average.toFixed(1)}
          </Typography>
        )}
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={onRemove}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Typography variant="caption" color={Colors.danger}>
          Remove
        </Typography>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  thumb: { width: 56, height: 84, borderRadius: Radius.sm },
  thumbPlaceholder: {
    backgroundColor: Colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowInfo: { flex: 1, marginHorizontal: Spacing.md },
  rowTitle: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '600',
    lineHeight: 20,
  },
  rowYear: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  rowRating: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '700',
    marginTop: 2,
  },
  removeBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: Radius.full,
  },
  removeBtnText: { color: Colors.danger, fontSize: 11, fontWeight: '600' },
});

export default WatchlistRow;
