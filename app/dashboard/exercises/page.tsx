import { Exercise, columns } from "./columns";
import { DataTable } from "../../../components/ui/data-table";
import { fetchExercises } from "@/lib/data";

const exercisesMock: Exercise[] = [
  {
    id: "1",
    name: "Bench press",
    muscleGroups: ["chest", "triceps"],
    demoLink: "#",
    usedBy: 5,
    created: "24.10.2022",
    modified: "25.10.2022",
  },
  {
    id: "2",
    name: "Barbell backsquat",
    muscleGroups: ["quadriceps", "hamstrings", "glutes"],
    demoLink: "#",
    usedBy: 4,
    created: "20.10.2022",
    modified: "20.10.2022",
  },
  {
    id: "3",
    name: "Deadlift",
    muscleGroups: ["hamstrings", "glutes", "back"],
    demoLink: "#",
    usedBy: 3,
    created: "20.10.2022",
    modified: "20.10.2022",
  },
  {
    id: "4",
    name: "Sumo deadlift",
    muscleGroups: ["hamstrings", "glutes", "back"],
    demoLink: "#",
    usedBy: 3,
    created: "20.10.2022",
    modified: "20.10.2022",
  },
  {
    id: "345",
    name: "Overhead press",
    muscleGroups: ["shoulders"],
    demoLink: "#",
    usedBy: 3,
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
      <DataTable columns={columns} data={parsedData} />
    </div>
  );
}
