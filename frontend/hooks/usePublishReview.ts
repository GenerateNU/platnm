import axios from "axios";
import { useNavigation } from "expo-router";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

function usePublishReview() {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const publishReview = (
    mediaType: string,
    mediaId: number,
    comment: string,
    rating: number,
    draft: boolean,
  ) => {
    return axios
      .post(`${BASE_URL}/reviews`, {
        user_id: "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
        media_type: mediaType,
        media_id: mediaId,
        comment,
        rating,
        draft,
      })
      .then(() => navigation.navigate("explore"))
      .catch((error) => {
        console.error(error);
      });
  };

  return { publishReview };
}

export { usePublishReview };
