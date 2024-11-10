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
    tags: string[],
    draft: boolean,
  ) => {
    const body = {
      user_id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
      media_type: mediaType,
      media_id: mediaId,
      comment,
      rating,
      tags,
      draft,
    };
    console.log(body);
    return axios
      .post(`${BASE_URL}/reviews`, {
        user_id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        media_type: mediaType,
        media_id: mediaId,
        comment,
        rating,
        tags,
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
