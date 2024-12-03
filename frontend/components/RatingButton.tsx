import { View } from "react-native";
import Cross from "@/assets/images/Icons/Cross.svg";
import Heart from "@/assets/images/Icons/Heart.svg";

import { TouchableOpacity } from "react-native";

type RatingButtonProps = {
  icon: any;
  handlePress: () => void;
};

export const RatingButton = ({ icon, handlePress }: RatingButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        width: 64,
        height: 64,
        backgroundColor: "#FAFCFB",
        filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        borderRadius: 32,
      }}
    >
      <View style={{ margin: "auto" }}>
        {icon == "cross" && <Cross width={24} height={24} />}
        {icon == "heart" && <Heart width={24} height={24} />}
      </View>
    </TouchableOpacity>
  );
};
