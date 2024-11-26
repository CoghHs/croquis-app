export const POSE_URL = `https://api.unsplash.com/search/photos?query=pose&per_page=10&client_id=${process.env.NEXT_PUBLIC_ACCESS_KEY}`;
export const PHOTO_DETAIL_URL = `https://api.unsplash.com/photos`;
export async function fetchPoseById(id: string) {
  const response = await fetch(`${POSE_URL}&id=${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch pose details");
  }
  return response.json();
}
