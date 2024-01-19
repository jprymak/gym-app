import { DialogContextProvider } from "@/lib/context/useDialogContext";
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

  return (
    <DialogContextProvider>
      <ExercisesDataTable data={parsedData} />
    </DialogContextProvider>
  );
}
