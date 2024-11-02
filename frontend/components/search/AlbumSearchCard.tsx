import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

interface AlbumSearchCardProps {
    rank: number;
    artist_name: string;
    album_name: string;
    cover: string;
}

const AlbumSearchCard: React.FC<AlbumSearchCardProps> = ({ rank, artist_name, album_name, cover }) => {
    const placeholderImage = "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png/220px-Taylor_Swift_-_1989_%28Taylor%27s_Version%29.png";

    return (
        <View style={styles.cardContainer}>
            <View style={styles.rankContainer}>
                <Text style={styles.rank}>{rank}.</Text>
            </View>
            <View style={styles.albumContainer}>
                {/* Album Cover Container */}
                <View style={styles.coverContainer}>
                    <Image 
                        source={{ uri: cover || placeholderImage }}
                        style={styles.albumCover}
                    />
                </View>
                {/* Record Container */}
                <View style={styles.recordContainer}>
                    <Image
                        source={require("@/assets/images/Profile/record.png")}
                        style={styles.recordImage}
                    />
                </View>
            </View>
            <Text style={styles.albumName}>{album_name}</Text>
            <Text style={styles.artistName}>{artist_name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        alignItems: "flex-start",
        marginRight: 25,
        marginBottom: 16, // Ensure space between cards vertically
        width: 140, // Fixed width to prevent flex overlap issues
        position: 'relative', // Enable absolute positioning of rank
    },
    rankContainer: {
        position: 'absolute', // Allows positioning it at the top left
        top: 0,
        left: -20,
        padding: 4, // Add some padding if desired
    },
    rank: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
        lineHeight: 20,
        fontFamily: "Inter",
    },
    albumContainer: {
        alignItems: "center", // Center align vertically
        position: "relative",  // Set position relative for stacking
    },
    coverContainer: {
        zIndex: 2, // Ensure cover is on top
    },
    recordContainer: {
        position: "absolute", // Position the record absolutely within the album container
        bottom: 5, // Align it to the bottom of the album cover, adjust as necessary
        left: "50%", // Center it horizontally
        transform: [{ translateX: -20 }], // Adjust to make it stick out
    },
    recordImage: {
        width: 100, // Size of the record image
        height: 100,
    },
    albumCover: {
        width: 110, // Size of the album cover image
        height: 110,
        borderRadius: 8,
    },
    albumName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#434343",
        marginTop: 4,
        textAlign: "left",
    },
    artistName: {
        fontSize: 14,
        color: "#434343", 
        textAlign: "left",
    },
});

export default AlbumSearchCard;
