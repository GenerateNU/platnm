import { StyleSheet, View, Text, ScrollView } from "react-native";
import SongChip from "@/components/search/SongChip";

type SongCardProp = {
  songs: MediaResponse[];
};

const TopSongs = ({ songs }: SongCardProp) => {
  // Take only the first 9 songs
  const topNineSongs = songs?.slice(0, 9);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Top Songs</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.gridContainer}>
        {topNineSongs?.map((song, id) => (
          <View key={song.media.id} style={styles.gridItem}>
            <SongChip
              rank={id + 1}
              id={song.media.id}
              title={song.media.title}
              artist_name={song.media.artist_name}
              cover={song.media.cover}
            />
          </View>
        ))}
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    width: 500, // Fixed width 
  },
  gridItem: {
    width: '33.33%',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
  },
});

export default TopSongs;