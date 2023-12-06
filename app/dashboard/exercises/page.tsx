import { Exercise, columns } from "./columns";
import { DataTable } from "../../../components/ui/data-table";

const exercisesMock: Exercise[] = [
  {
    id: "1",
    number: 1,
    name: "Bench press",
    muscleGroups: "chest",
    demoLink: "#",
    usedBy: 5,
    created: "24.10.2022",
    modified: "25.10.2022",
  },
  {
    id: "2",
    number: 2,
    name: "Barbell backsquat",
    muscleGroups: "legs",
    demoLink: "#",
    usedBy: 4,
    created: "20.10.2022",
    modified: "20.10.2022",
  },
  {
    id: "3",
    number: 3,
    name: "Deadlift",
    muscleGroups: "legs, glutes",
    demoLink: "#",
    usedBy: 3,
    created: "20.10.2022",
    modified: "20.10.2022",
  },
  {
    id: "4",
    number: 4,
    name: "Sumo deadlift",
    muscleGroups: "legs, glutes",
    demoLink: "#",
    usedBy: 3,
    created: "20.10.2022",
    modified: "20.10.2022",
  },
  {
    id: "345",
    number: 5,
    name: "Overhead press",
    muscleGroups: "shoulders",
    demoLink: "#",
    usedBy: 3,
    created: "20.10.2022",
    modified: "20.10.2022",
  },
];

export default async function DemoPage() {
  const data = exercisesMock;

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
