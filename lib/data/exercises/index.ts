"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { options } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/lib/db";
import { ExercisePartial } from "@/lib/types/exercise";
import { Prisma } from "@prisma/client";

export async function fetchExercises() {
  try {
    const session = await getServerSession(options);
    const userId = session?.user?.id;

    if (!userId) throw Error;

    const exercises = await db.exercise.findMany({
      where: {
        userId,
      },
      include: {
        scheduledExercise: {
          select: {
            id: true,
          },
        },
      },
    });
    return exercises;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch exercises!");
  }
}

export async function createExercise(formData: ExercisePartial) {
  try {
    const session = await getServerSession(options);
    const userId = session?.user?.id;

    if (!userId) throw Error;

    const result = await db.exercise.create({
      data: {
        ...formData,
        userId,
      },
    });
    revalidatePath("/exercises");
    return result;
  } catch (e) {
    console.log(e);
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
    revalidatePath("/exercises");
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
    revalidatePath("/exercises");
    return result;
  } catch (e) {
    console.log(e);
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
    revalidatePath("/exercises");
    return result;
  } catch (e) {
    return {
      error: "Failed to delete exercises.",
    };
  }
}
