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

export const createInitialDay = () => {
  const id = "temp-" + uuidv4();
  return {
    id,
    exercises: [
      { ...createInitialExerciseRow(), ordinalNum: 1, scheduledDayId: id },
    ],
    scheduleId: "",
    ordinalNum: -1,
  };
};
