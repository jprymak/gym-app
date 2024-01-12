import { v4 as uuidv4 } from "uuid";

export const createInitialExerciseRow = (scheduledDayId = "") => ({
  id: "temp-" + uuidv4(),
  sets: "1",
  reps: "1",
  rpe: "1",
  comment: "",
  exerciseId: "",
  scheduledDayId,
  ordinalNum: -1,
});

export const createInitialDay = () => ({
  id: "temp-" + uuidv4(),
  exercises: [createInitialExerciseRow()],
  scheduleId: "",
  ordinalNum: -1,
});
