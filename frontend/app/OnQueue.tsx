import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import axios from 'axios';


const OnQueue = () => {
    const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [userReviews, setUserReviews] = useState<Review[]>();
    const userId = "c9bd4c67-7937-4ee3-959d-21a1b3db70eb"; // Hardcoding - Get userId from navigation

    const [songs, setSongs] = useState([
        { id: '1', title: 'Song Name', name: 'Artist Name' },
        { id: '2', title: 'Song Name', name: 'Artist Name' },
        { id: '3', title: 'Song Name', name: 'Artist Name' },
        { id: '4', title: 'Song Name', name: 'Artist Name' },
        { id: '5', title: 'Song Name', name: 'Artist Name' },
    ]);



    const renderSongItem = ({ item }: { item: { id: string; title: string; name: string } }) => (
        <View style={styles.itemContainer}>
            <View style={styles.thumbnail}>
                
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.name}</Text>
            </View>
        </View>
    );

    useEffect(() => {
        axios.get(`${BASE_URL}/playlist/on_queue/${userId}`)
            .then(response => {
                setSongs(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);
    
    return (
        <View style={styles.container}>
            {/* Header */}
            <SafeAreaView style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backContainer}
                >
                    <Icon name="arrow-back" size={24} color="#1C1B1F" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                <Text style={styles.headerText}>On Queue</Text>
                </View>
            </SafeAreaView>

            {/* Songs Section */}
            <Text style={styles.sectionTitle}>Songs</Text>
            <FlatList
                data={songs}
                renderItem={renderSongItem}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View> 
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    backContainer: {
        paddingRight: 15,
        color: "#B7B6B6",
        fontSize: 16,
        marginLeft: 20,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center', // Center horizontally
        left: -30,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    thumbnail: {
        width: 50,
        height: 50,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 8,
    },
});

export default OnQueue;