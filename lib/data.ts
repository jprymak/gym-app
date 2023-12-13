"use server";

import { ExercisePartial } from "@/app/dashboard/exercises/columns";
import { db } from "./db";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

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
