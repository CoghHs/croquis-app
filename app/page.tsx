import { POSE_URL } from "@/lib/constants";
import Link from "next/link";

async function getPoses() {
  const response = await fetch(POSE_URL);
  const json = await response.json();
  return json.results;
}

export default async function Home() {
  const poses = await getPoses();
  return (
    <div>
      {poses.map((pose: any) => (
        <li key={pose.id}>
          <Link href={`/pose/${pose.id}`}>
            <img src={pose.urls.small} alt={pose.alt_description} />
          </Link>
        </li>
      ))}
    </div>
  );
}
