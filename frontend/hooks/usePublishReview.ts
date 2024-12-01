import { useAuthContext } from "@/components/AuthProvider";
import axios from "axios";

function usePublishReview() {
  const { userId } = useAuthContext();
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const publishReview = (
    mediaType: string,
    mediaId: number,
    comment: string,
    rating: number,
    tags: string[],
    draft: boolean,
  ) => {
    return axios
      .post(`${BASE_URL}/reviews`, {
        user_id: userId,
        media_type: mediaType,
        media_id: mediaId,
        comment,
        rating,
        tags,
        draft,
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return { publishReview };
}

export { usePublishReview };
