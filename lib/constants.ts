// Unsplash API URLs
export const BASE_URL = "https://api.unsplash.com";
export const SEARCH_URL = `${BASE_URL}/search/photos`;
export const PHOTO_DETAIL_URL = `${BASE_URL}/photos`;

const ACCESS_KEY = process.env.NEXT_PUBLIC_ACCESS_KEY;

// 포즈 목록을 가져오는 함수
export async function fetchPoses(
  query: string = "pose",
  perPage: number = 10,
  page: number = 1
) {
  const response = await fetch(
    `${SEARCH_URL}?query=${query}&per_page=${perPage}&page=${page}&client_id=${ACCESS_KEY}`
  );

  const data = await response.json();

  // API 응답에서 results와 total_pages를 반환
  return {
    results: data.results,
    totalPages: data.total_pages, // 전체 페이지 수를 반환
  };
}

// 개별 포즈 불러오기
export async function fetchPoseById(id: string) {
  const response = await fetch(
    `${PHOTO_DETAIL_URL}/${id}?client_id=${ACCESS_KEY}`
  );

  return response.json();
}
