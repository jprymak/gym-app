export const SCHEDULED_EXERCISE_DAY_LIMIT = 8;
export const SCHEDULE_DAY_LIMIT = 7;

export enum Direction {
  Up = "UP",
  Down = "DOWN",
}

export const MARGINAL_VALUES = {
  sets: {
    min: 1,
    max: 10,
  },
  reps: {
    min: 1,
    max: 99,
  },
  rpe: {
    min: 1,
    max: 10,
  },
  comment: {
    max: 100,
    min: 0,
  },
};
