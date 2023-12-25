import { v4 as uuidv4 } from "uuid";

export const createInitialExerciseRow = () => ({
  id: "temp-" + uuidv4(),
  sets: "0",
  reps: "0",
  rpe: "0",
  comment: "",
  exerciseId: null,
  scheduledDayId: "",
  ordinalNumber: -1,
});

export const createInitialDay = () => ({
  id: "temp-" + uuidv4(),
  exercises: [createInitialExerciseRow()],
  created: null,
  modified: null,
  scheduleId: "",
});
