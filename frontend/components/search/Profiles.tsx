import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import ProfileChip from "@/components/search/ProfileChip";
import { ScrollView } from "react-native";


type ProfileChipProps = {
  profiles: UserProfile[];
};

const Profiles = ({ profiles }: ProfileChipProps) => {
  return (
    <View>
      <Text style={styles.title}>Profiles</Text>
      <ScrollView>
        {profiles?.map((profile) => (
          <ProfileChip
            profile_picture={profile.profile_picture} 
            id={profile.id}
            display_name={profile.display_name}
            />
        ))}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
  },
  container: {
    flexDirection: "row",
    paddingHorizontal: 24,
  },
  songName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#434343",
    marginBottom: 4,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#434343",
    marginBottom: 4,
  },
});

export default Profiles;
