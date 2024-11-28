// Unsplash API URLs
export const BASE_URL = "https://api.unsplash.com";
export const SEARCH_URL = `${BASE_URL}/search/photos`;
export const PHOTO_DETAIL_URL = `${BASE_URL}/photos`;

const ACCESS_KEY = process.env.NEXT_PUBLIC_ACCESS_KEY;

// 포즈목록
export async function fetchPoses(query: string = "pose", perPage: number = 10) {
  const response = await fetch(
    `${SEARCH_URL}?query=${query}&per_page=${perPage}&client_id=${ACCESS_KEY}`
  );
  return response.json();
}

// 개별 포즈 불러오기
export async function fetchPoseById(id: string) {
  const response = await fetch(
    `${PHOTO_DETAIL_URL}/${id}?client_id=${ACCESS_KEY}`
  );

  return response.json();
}
