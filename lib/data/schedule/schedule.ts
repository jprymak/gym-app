"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/lib/db";
import type { Schedule } from "@prisma/client";

import type {
  ScheduleChanges,
  ScheduledDayPreparedForExport,
  SchedulePreparedForExport,
  ScheduleWithDaysAndExercises,
} from "../types";

function prepareScheduleChanges(
  schedule: ScheduleWithDaysAndExercises
): ScheduleChanges {
  const changes: ScheduleChanges = {
    daysToAdd: [],
    daysToUpdate: [],
    daysToDelete: [],
    scheduledExercisesToCreate: [],
    scheduledExercisesToUpdate: [],
    scheduledExercisesToCreateInExistingScheduledDay: [],
    scheduledExercisesToDelete: [],
  };

  for (const day of schedule.days) {
    if (day.id.startsWith("temp")) {
      changes.daysToAdd.push(day);
    } else if ("taggedForDelete" in day) {
      changes.daysToDelete.push(day.id);
    } else {
      changes.daysToUpdate.push(day);
    }

    for (const exercise of day.exercises) {
      if ("taggedForDelete" in exercise) {
        changes.scheduledExercisesToDelete.push(exercise.id);
      } else if (exercise.id.startsWith("temp")) {
        if (exercise.scheduledDayId?.startsWith("temp")) {
          changes.scheduledExercisesToCreate.push(exercise);
        } else {
          changes.scheduledExercisesToCreateInExistingScheduledDay.push(
            exercise
          );
        }
      } else {
        changes.scheduledExercisesToUpdate.push({
          ...exercise,
          scheduledDayId: day.id,
        });
      }
    }
  }
  return changes;
}

async function applyScheduleChanges(
  schedule: Schedule,
  changes: ScheduleChanges
) {
  const transaction = await db.$transaction([
    ...changes.daysToAdd.map((day) =>
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
    ...changes.daysToUpdate.map((day) =>
      db.scheduledDay.update({
        where: {
          id: day.id,
        },
        data: {
          ordinalNum: day.ordinalNum,
        },
      })
    ),
    ...changes.scheduledExercisesToUpdate.map((ex) =>
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
    ...changes.scheduledExercisesToCreateInExistingScheduledDay.map((ex) =>
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
          in: changes.scheduledExercisesToDelete,
        },
      },
    }),
    db.scheduledDay.deleteMany({
      where: {
        id: {
          in: changes.daysToDelete,
        },
      },
    }),
  ]);

  revalidatePath(`/schedule/${schedule.clientId}`);
  return { data: transaction };
}

export async function fetchSchedule(clientId: string) {
  const session = await getServerSession(options);
  const userId = session?.user?.id;

  if (!userId) throw Error;

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

    revalidatePath("/schedule");
    return result;
  } catch (e) {
    console.error(e);
    return notFound();
  }
}

export async function updateSchedule(schedule: ScheduleWithDaysAndExercises) {
  try {
    return applyScheduleChanges(schedule, prepareScheduleChanges(schedule));
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
