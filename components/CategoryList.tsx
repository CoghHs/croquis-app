import { fetchPoses } from "@/lib/constants";
import Link from "next/link";

interface CategoryListProps {
  query: string;
  text: string;
}

export default async function CategoryList({ query, text }: CategoryListProps) {
  const data = await fetchPoses(query);
  const pose = data.results[0];
  const dynamicLink = `/${query}/${pose.id}`;

  return (
    <div>
      <li key={pose.id}>
        <Link href={dynamicLink}>
          <img
            className="w-80 h-96 object-cover"
            src={pose.urls.full}
            alt={pose.alt_description}
          />
        </Link>
      </li>
    </div>
  );
}
