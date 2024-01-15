"use server";

import { Prisma } from "@prisma/client";

export type ScheduledDay = Prisma.ScheduledDayGetPayload<{
  select: {
    id: true;
    scheduleId: true;
    ordinalNum: true;
  };
}>;

export type ScheduleWithDaysAndExercises = Prisma.ScheduleGetPayload<{
  include: {
    days: {
      select: {
        id: true;
        ordinalNum: true;
        scheduleId: true;
        exercises: {
          select: {
            id: true;
            sets: true;
            reps: true;
            rpe: true;
            comment: true;
            exerciseId: true;
            scheduledDayId: true;
            ordinalNum: true;
          };
        };
      };
    };
  };
}>;

export type ScheduledDayWithExercises = Prisma.ScheduledDayGetPayload<{
  select: {
    id: true;
    ordinalNum: true;
    scheduleId: true;
    exercises: {
      select: {
        id: true;
        sets: true;
        reps: true;
        rpe: true;
        comment: true;
        exerciseId: true;
        scheduledDayId: true;
        ordinalNum: true;
      };
    };
  };
}>;

export type ScheduledExercisePreparedForExport = {
  Name: string;
  Number: number;
  Sets: string;
  Reps: string;
  Rpe: string;
  Comment: string;
  Demo: string;
};

export type ScheduledDayPreparedForExport = {
  exercises: ScheduledExercisePreparedForExport[];
};

export type SchedulePreparedForExport = {
  clientName: string;
  clientSurname: string;
  //TO DO: add date range for schedule once feature is ready
  days: ScheduledDayPreparedForExport[];
};

export type ScheduledExercise = Prisma.ScheduledExerciseGetPayload<{
  select: {
    id: true;
    sets: true;
    reps: true;
    rpe: true;
    exerciseId: true;
    comment: true;
    scheduledDayId: true;
    ordinalNum: true;
  };
}>;
