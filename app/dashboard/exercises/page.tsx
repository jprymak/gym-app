import { fetchExercises } from "@/lib/data";

import { ExercisesDataTable } from "./exercisesDataTable";

export default async function DemoPage() {
  const data = await fetchExercises();
  const parsedData = data.map((item) => {
    return {
      ...item,
      created: item.created.toLocaleDateString(),
      modified: item.modified.toLocaleDateString(),
    };
  });

  return (
    <div className="container mx-auto py-10">
      <ExercisesDataTable data={parsedData} />
    </div>
  );
}
