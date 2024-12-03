import axios from "axios";

function usePublishReview() {
  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  const publishReview = (request: PublishReviewRequest) => {
    return axios.post(`${BASE_URL}/reviews`, request).catch((error) => {
      console.error(error);
    });
  };

  return { publishReview };
}

export { usePublishReview };
