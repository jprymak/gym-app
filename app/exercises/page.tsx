import { fetchExercises } from "@/lib/data/exercises";

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

  return <ExercisesDataTable data={parsedData} />;
}
