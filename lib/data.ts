"use server";

import { ExercisePartial } from "@/app/dashboard/exercises/columns";
import { db } from "./db";
import { revalidatePath } from "next/cache";
import { Prisma, ScheduledDay } from "@prisma/client";
import { ClientPartial } from "@/app/dashboard/clients/columns";

export type ScheduleWithDaysAndExercises = Prisma.ScheduleGetPayload<{
  include: {
    days: {
      include: {
        exercises: {
          select: {
            id: true;
            sets: true;
            reps: true;
            rpe: true;
            exerciseId: true;
            comment: true;
            scheduledDayId: true;
          };
        };
      };
    };
  };
}>;

export type ScheduledExercise = Prisma.ScheduledExerciseGetPayload<{
  select: {
    id: true;
    sets: true;
    reps: true;
    rpe: true;
    exerciseId: true;
    comment: true;
    scheduledDayId: true;
  };
}>;

export async function fetchExercises() {
  try {
    const exercises = await db.exercise.findMany();
    return exercises;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch exercises!");
  }
}

export async function createExercise(formData: ExercisePartial) {
  try {
    const result = await db.exercise.create({
      data: {
        ...formData,
      },
    });
    revalidatePath("/dashboard/exercises");
    return result;
  } catch (e) {
    const result = {
      error: "Something went wrong!",
    };
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        result.error = "Exercise name is already taken";
      }
    }
    return result;
  }
}

export async function updateExercise(formData: ExercisePartial, id: string) {
  try {
    const result = await db.exercise.update({
      where: {
        id,
      },
      data: {
        ...formData,
      },
    });
    revalidatePath("/dashboard/exercises");
    return result;
  } catch (e) {
    const result = {
      error: "Something went wrong!",
    };
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        result.error = "Exercise name is already taken";
      }
    }
    return result;
  }
}

export async function deleteExercise(id: string) {
  try {
    const result = await db.exercise.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/exercises");
    return result;
  } catch (e) {
    const result = {
      error: "Failed to delete exercise.",
    };
    return result;
  }
}

export async function bulkDeleteExercise(idsToDelete: string[]) {
  try {
    const result = await db.exercise.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    });
    revalidatePath("/dashboard/exercises");
    return result;
  } catch (e) {
    return {
      error: "Failed to delete exercises.",
    };
  }
}

export async function fetchClients() {
  try {
    const clients = await db.client.findMany();
    return clients;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch clients!");
  }
}

export async function addClient(formData: ClientPartial) {
  try {
    const result = await db.client.create({
      data: {
        ...formData,
        schedule: {
          create: {
            days: {
              create: [],
            },
          },
        },
      },
    });
    revalidatePath("/dashboard/clients");
    return result;
  } catch (e) {
    console.log(e);
    const result = {
      error: "Something went wrong!",
    };
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        result.error =
          "This email address is already taken. Please try another.";
      }
    }
    return result;
  }
}

export async function updateClient(formData: ClientPartial, id: string) {
  try {
    const result = await db.client.update({
      where: {
        id,
      },
      data: {
        ...formData,
      },
    });
    revalidatePath("/dashboard/clients");
    return result;
  } catch (e) {
    const result = {
      error: "Something went wrong!",
    };
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        result.error =
          "This email address is already taken. Please try another.";
      }
    }
    return result;
  }
}

export async function deleteClient(id: string) {
  try {
    const result = await db.client.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/clients");
    return result;
  } catch (e) {
    console.error(e);
    const result = {
      error: "Client could not be deleted.",
    };
    return result;
  }
}

export async function fetchSchedule(clientId: string) {
  try {
    const result = await db.schedule.findFirst({
      where: {
        clientId,
      },
      include: {
        days: {
          include: {
            exercises: {
              select: {
                id: true,
                sets: true,
                reps: true,
                rpe: true,
                exerciseId: true,
                comment: true,
              },
            },
          },
        },
      },
    });
    if (!result) throw Error;
    revalidatePath("/dashboard/schedule");
    return result;
  } catch (e) {
    console.error(e);
  }
}

export async function updateSchedule(schedule: ScheduleWithDaysAndExercises) {
  const daysToAdd: ScheduledDay[] = [];

  const scheduledExercisesToCreate: ScheduledExercise[] = [];
  const scheduledExercisesToUpdate: ScheduledExercise[] = [];
  const scheduledExercisesToCreateInScheduledDay: ScheduledExercise[] = [];
  const scheduledExercisesToDelete: string[] = [];

  schedule.days.forEach((day) => {
    if (day.id.startsWith("temp")) {
      daysToAdd.push(day);
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
      scheduledExercisesToCreateInScheduledDay.push(ex);
    } else if (ex.id.startsWith("temp")) {
      scheduledExercisesToCreate.push(ex);
    } else {
      scheduledExercisesToUpdate.push(ex);
    }
  });
  try {
    const transaction = await db.$transaction([
      ...daysToAdd.map(() =>
        db.scheduledDay.create({
          data: {
            schedule: {
              connect: { id: schedule.id },
            },
            exercises: {
              create: [
                ...scheduledExercisesToCreate.map((ex) => ({
                  sets: ex.sets,
                  reps: ex.reps,
                  rpe: ex.rpe,
                  comment: ex.comment,
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
      ...scheduledExercisesToCreateInScheduledDay.map((ex) =>
        db.scheduledExercise.create({
          data: {
            sets: ex.sets,
            reps: ex.reps,
            rpe: ex.rpe,
            comment: ex.comment,
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
    ]);

    revalidatePath(`/dashboard/schedule/${schedule.clientId}`);
  } catch (e) {
    console.error(e);
  }
}
