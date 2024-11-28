import CategoryList from "@/components/CategoryList";

export default async function Home() {
  return (
    <div className="flex flex-col ">
      <div className="w-1/2 flex flex-wrap">
        <CategoryList text="Pose" query="pose" />
        <CategoryList text="Hand" query="hand" />
        <CategoryList text="Face" query="face" />
        <CategoryList text="Animal" query="animal" />
      </div>
    </div>
  );
}
