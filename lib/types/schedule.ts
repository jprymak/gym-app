import type { ScheduledDayWithExercises, ScheduledExercise } from "../data/types";

export interface PreparedScheduledDay extends ScheduledDayWithExercises {
  taggedForDelete?: boolean;
}

export interface PreparedScheduledExercise extends ScheduledExercise {
  taggedForDelete?: boolean;
}

export type ScheduleItem = PreparedScheduledDay | PreparedScheduledExercise;
