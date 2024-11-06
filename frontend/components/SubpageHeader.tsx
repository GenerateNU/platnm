import { View, Text, Touchable, TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";
import Back from "@/assets/images/Icons/Back";

type Props = {
  title: string;
  backButton?: boolean;
};

export const SubpageHeader = ({ title, backButton }: Props) => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        height: Dimensions.get("window").height * 0.12,
        borderBottomColor: "#EFF1F5",
        borderBottomWidth: 1,
        borderStyle: "solid",
      }}
    >
      <View
        style={{
          marginVertical: "auto",
          paddingLeft: 20,
          paddingTop: 20,
          flexDirection: "row",
          gap: 20,
        }}
      >
        <TouchableOpacity>
          <Back
            width={24}
            height={24}
            style={{ color: "#000", marginVertical: "auto", marginTop: 5 }}
          />
        </TouchableOpacity>
        <Text
          style={{
            bottom: -10,
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          {title}
        </Text>
      </View>
    </View>
  );
};
