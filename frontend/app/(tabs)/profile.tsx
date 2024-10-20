import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import axios from "axios";
import TopReview from '@/components/media/TopReview';
import Section from '@/components/profile/Section';

export default function ProfileScreen() {
  
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [userReviews, setUserReviews] = useState<Review[]>();
  const userId = '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d'; // Hardcoding - Get userId from navigation
  const [sections, setSections] = useState([{ title: 'Section 1', items: ['Item title', 'Item title', 'Item title'] }, { title: 'Section 2', items: ['Item title', 'Item title', 'Item title'] }]); //TODO depending on what we do with sections
  const hasNotification = true; // Hardcoding - Get notification status from somewhere else

  useEffect(() => {

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/profile/${userId}`);
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    const fetchUserReviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/reviews/${userId}`);
        setUserReviews(response.data);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
      }
    };

    fetchUserProfile();
    fetchUserReviews();
  }, [userId]);

  const handleActivityPress = () => {
    console.log('Activity icon pressed');
    // Add activity icon press handling logic here
  };

  const handleSettingsPress = () => {
    console.log('Settings icon pressed');
    // Add settings icon press handling logic here
  };

  const handleSharePress = () => {
    console.log('Share icon pressed');
    // Add share icon press handling logic here
  };

  const handleEditPress = () => {
    console.log('Edit icon pressed');
    // Add edit icon press handling logic here
  };

  const handleAddSection = () => {
    const newSectionIndex = sections.length + 1;
    const newSection = {
      title: `Section ${newSectionIndex}`,
      items: ['New item title 1', 'New item title 2', 'New item title 3'],
    };
    setSections([...sections, newSection]);
  };

  return (
    userProfile && (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Top icons */}
        <View style={styles.topIconsContainer}>
        {/* Activity icon with notification badge */}
        <TouchableOpacity onPress={handleActivityPress} style={styles.activityIconContainer}>
          <Icon name="activity" size={24} color="#000" />
          {hasNotification && <View style={styles.notificationBadge} />}
        </TouchableOpacity>

        {/* Grouping the settings and share icons on the right */}
        <View style={styles.rightIconsContainer}>
          <TouchableOpacity onPress={handleSettingsPress}>
            <Icon name="settings" size={24} color="#000" style={styles.rightIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSharePress}>
            <Icon name="share" size={24} color="#000" style={styles.rightIcon} />
          </TouchableOpacity>
        </View>
      </View>
        {/* Profile Picture */}
        <View style={styles.profileContainer}>
          <Image source={require('@/assets/images/Profile/record.png')} style={styles.recordImage} />
          <Image source={{ uri: userProfile.profile_picture }} style={styles.profileImage} />
          <TouchableOpacity onPress={handleEditPress} style={styles.editIcon}>
          <Icon name="edit-2" size={20} color="#888" />
          </TouchableOpacity>
        </View>
        {/* Username and Bio */}
        <Text style={styles.name}>{userProfile.display_name}</Text>
        <View style={styles.usernameContainer}>
          <Text style={styles.username}>@{userProfile.username}</Text>
          <TouchableOpacity onPress={handleEditPress} style={styles.editIcon}>
            <Icon name="edit-2" size={15} color="#888" />
          </TouchableOpacity>
        </View>
        <View style={styles.stats}>
          <View style={styles.statItemContainer}>
            <Text style={styles.statNumber}>{userProfile.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItemContainer}>
            <Text style={styles.statNumber}>{userProfile.followed}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItemContainer}>
            <Text style={styles.statNumber}>{userProfile.score}</Text>
            <Text style={styles.statLabel}>Platinum</Text>
          </View>
        </View>
        <Text style={styles.aboutMe}>{userProfile.bio ? userProfile.bio : 'About me...'}</Text>
      </View>

      {/* On Queue Button */}
      <TouchableOpacity style={styles.queueButton}>
        <Text style={styles.queueButtonText}>▶ On Queue</Text>
      </TouchableOpacity>

      {/* User Reviews Section */}
      {userReviews && userReviews.length > 0 ? (
          userReviews.map((review) => {
            const reviews = [review];
            return <TopReview key={review.id} reviews={reviews} />;
          })
        ) : (
          <Text style={styles.noReviewsText}>No reviews found.</Text>
        )}

      {/* Sections */}
      <Section title="Section 1" items={['Item title', 'Item title', 'Item title']} onEditPress={handleEditPress} />

      <Section title="Section 2" items={['Item title', 'Item title', 'Item title']} onEditPress={handleEditPress} />

      {/* Button to Add a New Section */}
      <TouchableOpacity onPress={handleAddSection} style={styles.addSectionButton}>
        <Text style={styles.addSectionButtonText}>Add Section</Text>
        <Icon name="plus-circle" size={24} color="#000" />
      </TouchableOpacity>
      
    </ScrollView>
  )
);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  topIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Spread the icons across the container
    alignItems: 'center',
    width: SCREEN_WIDTH,  // Make the container span the full width of the screen
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  activityIconContainer: {
    position: 'relative', // Necessary for absolute positioning of the badge
  },
  notificationBadge: {
    position: 'absolute',
    top: 5, // Adjust the position as needed
    right: -2,
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightIcon: {
    marginLeft: 15, // Adds spacing between settings and share icons
  },
  profileContainer: {
    width: 120,  // Adjust size to match your record image
    height: 120, // Adjust size to match your record image
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileImage: {
    position: 'absolute', // Overlay the profile picture on the record
    width: 60,  // Adjust size to fit within the center of the record
    height: 60, // Adjust size to fit within the center of the record
    borderRadius: 30,  // To make it circular
    borderWidth: 2,    // Optional: add a border around the profile image
    borderColor: '#fff', // Optional: white border
  },
  editIcon: {
    position: 'absolute',
    right: -25,
    bottom: 20,
    backgroundColor: 'transparent',
    padding: 4,
    borderRadius: 50,
  },
  editText: {
    fontSize: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  username: {
    fontSize: 16,
    color: '#888',
  },
  usernameContainer: {
    width: 120,  // Adjust size to match your record image
    height: 20, // Adjust size to match your record image
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  statItem: {
    fontSize: 14,
    color: '#666',
  },
  statItemContainer: {
    alignItems: 'center', // Center align the items in each stat item container
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  aboutMe: {
    fontSize: 16,
    marginTop: 10,
    color: '#666',
  },
  queueButton: {
    backgroundColor: '#666',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: 20,
  },
  queueButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  itemsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    width: '100%',
  },
  itemTitle: {
    fontSize: 16,
  },
  noReviewsText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
  },
  addSectionButton: {
    backgroundColor: '#888',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    alignSelf: 'center',
  },
  addSectionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});