import { fetchExercises, fetchSchedule } from "@/lib/data";
import { Schedule } from "./schedule";

export default async function SchedulePage({
  params,
}: {
  params: { clientId: string };
}) {
  const exercises = await fetchExercises();
  const schedule = await fetchSchedule(params?.clientId);
  return (
    <div>
      My User: {params?.clientId}
      {schedule && <Schedule scheduleData={schedule} exercises={exercises} />}
    </div>
  );
}
