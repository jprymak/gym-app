import { ScheduledExercise } from "@/lib/data";
import { Exercise } from "@prisma/client";

import {
  ScheduledDayWithExercises,
  ScheduleWithDaysAndExercises,
} from "../data";

export interface ScheduleProps {
  scheduleData: ScheduleWithDaysAndExercises;
  exercises: Exercise[];
}

export interface PreparedScheduledDay extends ScheduledDayWithExercises {
  taggedForDelete?: boolean;
}

export interface PreparedScheduledExercise extends ScheduledExercise {
  taggedForDelete?: boolean;
}

export type ScheduleItems<T> = T extends PreparedScheduledDay
  ? PreparedScheduledDay
  : PreparedScheduledExercise;
