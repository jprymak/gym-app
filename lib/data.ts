import { db } from "./db";

export async function fetchExercises() {
  try {
    const exercises = await db.exercise.findMany();
    return exercises;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch exercises!");
  }
}
