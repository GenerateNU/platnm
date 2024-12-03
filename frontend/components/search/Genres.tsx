import { StyleSheet, View, Text } from "react-native";
import { useRef } from "react";
import GenreBox from "./GenreBox";

const Genres = () => {
  // Take only the first 9 songs
  const genres = useRef<string[]>([
    "Pop",
    "Rock",
    "Hip-Hop",
    "Jazz",
    "Classical",
    "Electronic",
    "Country",
    "Latin",
  ]);

  const myTop = genres?.current.slice(0, 4);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Your Top Genres</Text>
      <View style={styles.genres}>
        {myTop.map((genre: string, key) => {
          return <GenreBox key={key} genre={genre} />;
        })}
      </View>
      <Text style={styles.title}>Browse All</Text>
      <View style={styles.genres}>
        {genres.current
          .slice()
          .reverse()
          .map((genre: string, key: number) => {
            return <GenreBox key={key} genre={genre} />;
          })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    gap: 2,
    padding: 3,
  },
  title: {
    fontSize: 22,
    paddingHorizontal: 21,
    paddingBottom: 12,
    paddingTop: 32,
    fontWeight: "bold",
  },
});

export default Genres;
