"use server";

import { ExercisePartial } from "@/app/dashboard/exercises/columns";
import { db } from "./db";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { ClientPartial } from "@/app/dashboard/clients/columns";

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
