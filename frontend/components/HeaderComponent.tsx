import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from "expo-router";


interface HeaderComponentProps {
    title: string;
}


const HeaderComponent: React.FC<HeaderComponentProps> = ({ title }) => {

    const navigation = useNavigation();
    
    return (
        <SafeAreaView style={styles.headerContainer}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.headerTitle}>{title}</Text>
            </SafeAreaView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
  },
  backText: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    color: '#B7B6B6',
    fontSize: 16,
    marginLeft: 10,
  },
  safeArea: {
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,

  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#434343',
    fontFamily: 'Roboto',
    borderRadius: 5,
    padding: 5,
  },
});

export default HeaderComponent;