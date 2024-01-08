import { fetchExercises } from "@/lib/data";

import { DataTable } from "../../../components/ui/data-table";

import { columns,Exercise } from "./columns";
import { ExercisesDataTable } from "./exercisesDataTable";

const exercisesMock: Exercise[] = [
  {
    id: "1",
    name: "Bench press",
    muscleGroups: ["chest", "triceps"],
    demoLink: "#",
    created: "24.10.2022",
    modified: "25.10.2022",
  },
  {
    id: "2",
    name: "Barbell backsquat",
    muscleGroups: ["quadriceps", "hamstrings", "glutes"],
    demoLink: "#",
    created: "20.10.2022",
    modified: "20.10.2022",
  },
  {
    id: "3",
    name: "Deadlift",
    muscleGroups: ["hamstrings", "glutes", "back"],
    demoLink: "#",
    created: "20.10.2022",
    modified: "20.10.2022",
  },
  {
    id: "4",
    name: "Sumo deadlift",
    muscleGroups: ["hamstrings", "glutes", "back"],
    demoLink: "#",
    created: "20.10.2022",
    modified: "20.10.2022",
  },
  {
    id: "345",
    name: "Overhead press",
    muscleGroups: ["shoulders"],
    demoLink: "#",
    created: "20.10.2022",
    modified: "20.10.2022",
  },
];

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
