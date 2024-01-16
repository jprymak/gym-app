"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

import {
  ScheduledDay,
  ScheduledDayPreparedForExport,
  ScheduledDayWithExercises,
  ScheduledExercise,
  SchedulePreparedForExport,
  ScheduleWithDaysAndExercises,
} from "../types";

export async function fetchSchedule(clientId: string) {
  try {
    const result = await db.schedule.findFirst({
      where: {
        clientId,
      },
      include: {
        days: {
          select: {
            id: true,
            scheduleId: true,
            ordinalNum: true,
            exercises: {
              select: {
                id: true,
                sets: true,
                reps: true,
                rpe: true,
                exerciseId: true,
                comment: true,
                scheduledDayId: true,
                ordinalNum: true,
              },
              orderBy: [
                {
                  ordinalNum: "asc",
                },
              ],
            },
          },
          orderBy: [
            {
              ordinalNum: "asc",
            },
          ],
        },
      },
    });
    if (!result) throw Error;
    revalidatePath("/schedule");
    return result;
  } catch (e) {
    console.error(e);
  }
}

export async function updateSchedule(schedule: ScheduleWithDaysAndExercises) {
  const daysToAdd: ScheduledDayWithExercises[] = [];
  const daysToUpdate: ScheduledDay[] = [];
  const daysToDelete: string[] = [];

  const scheduledExercisesToCreate: ScheduledExercise[] = [];
  const scheduledExercisesToUpdate: ScheduledExercise[] = [];
  const scheduledExercisesToCreateInExistingScheduledDay: ScheduledExercise[] =
    [];
  const scheduledExercisesToDelete: string[] = [];

  schedule.days.forEach((day) => {
    if (day.id.startsWith("temp")) {
      daysToAdd.push(day);
    } else if ("taggedForDelete" in day) {
      daysToDelete.push(day.id);
    } else {
      daysToUpdate.push(day);
    }
  });

  const preparedExercises = schedule.days.reduce<ScheduledExercise[]>(
    (total, curr) => {
      const exercisesWithDayId = curr.exercises.map((ex) => ({
        ...ex,
        scheduledDayId: curr.id,
      }));

      return [...total, ...exercisesWithDayId];
    },
    []
  );

  preparedExercises.forEach((ex) => {
    if ("taggedForDelete" in ex) {
      scheduledExercisesToDelete.push(ex.id);
    } else if (
      ex.id.startsWith("temp") &&
      !ex.scheduledDayId?.startsWith("temp")
    ) {
      scheduledExercisesToCreateInExistingScheduledDay.push(ex);
    } else if (ex.id.startsWith("temp")) {
      scheduledExercisesToCreate.push(ex);
    } else {
      scheduledExercisesToUpdate.push(ex);
    }
  });

  try {
    const transaction = await db.$transaction([
      ...daysToAdd.map((day) =>
        db.scheduledDay.create({
          data: {
            ordinalNum: day.ordinalNum,
            schedule: {
              connect: { id: schedule.id },
            },
            exercises: {
              create: [
                ...day.exercises.map((ex) => ({
                  sets: ex.sets,
                  reps: ex.reps,
                  rpe: ex.rpe,
                  comment: ex.comment,
                  ordinalNum: ex.ordinalNum,
                  ...(ex.exerciseId && {
                    exercise: {
                      connect: {
                        id: ex.exerciseId,
                      },
                    },
                  }),
                })),
              ],
            },
          },
          include: {
            exercises: true,
          },
        })
      ),
      ...daysToUpdate.map((day) =>
        db.scheduledDay.update({
          where: {
            id: day.id,
          },
          data: {
            ordinalNum: day.ordinalNum,
          },
        })
      ),
      ...scheduledExercisesToUpdate.map((ex) =>
        db.scheduledExercise.update({
          where: {
            id: ex.id,
          },
          data: {
            sets: ex.sets,
            reps: ex.reps,
            rpe: ex.rpe,
            comment: ex.comment,
            ordinalNum: ex.ordinalNum,
            ...(ex.exerciseId && {
              exercise: {
                connect: {
                  id: ex.exerciseId,
                },
              },
            }),
          },
        })
      ),
      ...scheduledExercisesToCreateInExistingScheduledDay.map((ex) =>
        db.scheduledExercise.create({
          data: {
            sets: ex.sets,
            reps: ex.reps,
            rpe: ex.rpe,
            comment: ex.comment,
            ordinalNum: ex.ordinalNum,
            ...(ex.scheduledDayId && {
              scheduledDay: {
                connect: {
                  id: ex.scheduledDayId,
                },
              },
            }),
            ...(ex.exerciseId && {
              exercise: {
                connect: {
                  id: ex.exerciseId,
                },
              },
            }),
          },
        })
      ),
      db.scheduledExercise.deleteMany({
        where: {
          id: {
            in: scheduledExercisesToDelete,
          },
        },
      }),
      db.scheduledDay.deleteMany({
        where: {
          id: {
            in: daysToDelete,
          },
        },
      }),
    ]);

    revalidatePath(`/schedule/${schedule.clientId}`);
    return { data: transaction };
  } catch (e) {
    console.log(e);
    const result = {
      error: "Schedule could not be updated.",
    };
    return result;
  }
}

export async function prepareScheduleForExport(clientId: string) {
  const schedule = await fetchSchedule(clientId);
  const client = await db.client.findFirst({
    where: {
      id: clientId,
    },
  });

  if (!schedule || !client) {
    return;
  }

  const exerciseIDs = schedule?.days.reduce<string[]>((prev, curr) => {
    curr.exercises.forEach((exercise) => {
      if (!prev.includes(exercise.exerciseId)) {
        prev.push(exercise.exerciseId);
      }
    });

    return prev;
  }, []);

  const exercises = await db.exercise.findMany({
    where: {
      id: {
        in: exerciseIDs,
      },
    },
  });

  const daysPreparedForExport: ScheduledDayPreparedForExport[] =
    schedule?.days.map((day) => {
      const newExercises = day.exercises.map((scheduledExercise) => {
        const exerciseMatch = exercises.find((exercise) => {
          return scheduledExercise.exerciseId === exercise.id;
        });
        return {
          Number: scheduledExercise.ordinalNum,
          Name: exerciseMatch?.name || "",
          Sets: scheduledExercise.sets,
          Reps: scheduledExercise.reps,
          Rpe: scheduledExercise.rpe,
          Demo: exerciseMatch?.demoLink || "",
          Comment: scheduledExercise.comment,
        };
      });
      return { ...day, exercises: newExercises };
    });

  const schedulePreparedForExport: SchedulePreparedForExport = {
    clientName: client.name,
    clientSurname: client.surname,
    days: daysPreparedForExport,
  };

  return schedulePreparedForExport;
}
