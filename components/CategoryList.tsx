import { fetchPoses } from "@/lib/constants";
import Link from "next/link";

interface CategoryListProps {
  query: string;
}

export default async function CategoryList({ query }: CategoryListProps) {
  const data = await fetchPoses(query);
  const pose = data.results[0];

  // 동적인 링크 생성: [category]/[id] 구조로 링크
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
