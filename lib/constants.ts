// Unsplash API URLs
export const BASE_URL = "https://api.unsplash.com";
export const SEARCH_URL = `${BASE_URL}/search/photos`;
export const PHOTO_DETAIL_URL = `${BASE_URL}/photos`;

const ACCESS_KEY = process.env.NEXT_PUBLIC_ACCESS_KEY;

// 포즈목록
export async function fetchPoses(
  query: string = "pose",
  perPage: number = 10,
  page: number = 1
) {
  const response = await fetch(
    `${SEARCH_URL}?query=${query}&per_page=${perPage}&page=${page}&client_id=${ACCESS_KEY}`
  );

  const data = await response.json();

  // API 응답에서 전체 페이지 수(total_pages)를 반환
  return {
    results: data.results,
    totalPages: data.total_pages, // 전체 페이지 수를 포함
  };
}

export async function fetchRandomPoses(
  query: string = "pose",
  perPage: number = 10
) {
  // 페이지 번호를 랜덤하게 선택 (1부터 totalPages까지)
  const totalPages = 50; // 예시로 30 페이지라고 가정 (API에서 totalPages 값을 받아올 수 있다면 동적으로 처리 가능)
  const randomPage = Math.floor(Math.random() * totalPages) + 1;

  const response = await fetch(
    `${SEARCH_URL}?query=${query}&per_page=${perPage}&page=${randomPage}&client_id=${ACCESS_KEY}`
  );

  const data = await response.json();

  return {
    results: data.results,
    totalPages: data.total_pages, // 전체 페이지 수
  };
}

// 개별 포즈 불러오기
export async function fetchPoseById(id: string) {
  const response = await fetch(
    `${PHOTO_DETAIL_URL}/${id}?client_id=${ACCESS_KEY}`
  );

  return response.json();
}
