import { fetchExercises } from "@/lib/data/exercises";
import { fetchSchedule } from "@/lib/data/schedule";

import { Schedule } from "./schedule";

export default async function SchedulePage({
  params,
}: {
  params: { clientId: string };
}) {
  const exercises = await fetchExercises();
  const schedule = await fetchSchedule(params?.clientId);
  return (
    <>
      {schedule && <Schedule scheduleData={schedule} exercises={exercises} />}
    </>
  );
}
