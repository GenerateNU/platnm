import axios from "axios";

function usePublishReview() {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const publishReview = (
    mediaType: string,
    mediaId: number,
    comment: string,
    rating: number,
    tags: string[],
    draft: boolean
  ) => {
    console.log("rating");
    return (
      axios
        .post(`${BASE_URL}/reviews`, {
          user_id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
          media_type: mediaType,
          media_id: mediaId,
          comment,
          rating,
          tags,
          draft,
        })
        // .then(() => navigation.navigate("explore"))
        .catch((error) => {
          console.error(error);
        })
    );
  };

  return { publishReview };
}

export { usePublishReview };
