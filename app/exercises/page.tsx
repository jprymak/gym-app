import { DialogContextProvider } from "@/lib/context/useDialogContext";
import { fetchExercises } from "@/lib/data/exercises";

import { ExercisesDataTable } from "./exercisesDataTable";

export default async function DemoPage() {
  const data = await fetchExercises();

  return (
    <DialogContextProvider>
      <ExercisesDataTable data={data} />
    </DialogContextProvider>
  );
}

export const dynamic = "force-dynamic";
