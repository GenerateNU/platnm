import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import ProfileChip from "@/components/search/ProfileChip";

type ProfileChipProps = {
  profiles: UserProfile[];
};

const Profiles = ({ profiles }: ProfileChipProps) => {
  const limitedProfiles = profiles?.slice(0, 2);
  return (
    <View>
      <Text style={styles.title}>Profiles</Text>
      <ScrollView>
        <View style={styles.profileRow}>
          {limitedProfiles?.map((profile) => (
            <ProfileChip
              profile_picture={profile.profile_picture} 
              id={profile.id}
              display_name={profile.display_name}
            />
          ))}
        </View>
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
  profileRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
  },
});

export default Profiles;