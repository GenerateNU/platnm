import { View, Text, Touchable } from "react-native";
import { Dimensions } from "react-native";
import Cross from "@/assets/images/Icons/Cross";
import Heart from "@/assets/images/Icons/Heart";
import { TouchableOpacity } from "react-native";

type Props = {
  icon: any;
};

export const RatingButton = ({ icon }: Props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log("pressed some rating button");
      }}
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
