import CategoryList from "@/components/CategoryList";

export default async function Home() {
  return (
    <div className="flex flex-col ">
      <div className="w-1/2 flex flex-wrap">
        <CategoryList query="pose" />
        <CategoryList query="hand" />
        <CategoryList query="face" />
        <CategoryList query="animal" />
      </div>
    </div>
  );
}
