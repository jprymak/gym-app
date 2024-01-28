"use server";

import bcrypt from "bcrypt";

import { initialExercises } from "@/lib/constants/exercise";
import { db } from "@/lib/db";
import type { User } from "@prisma/client";

interface NewUser extends Pick<User, "name" | "email"> {
  password: string;
}

export async function createUser(userData: NewUser) {
  try {
    const duplicate = await db.user.findFirst({
      where: {
        email: userData.email,
      },
    });

    if (duplicate) {
      throw new Error("Email address is already taken");
    }

    const hashPassword = await bcrypt.hash(userData.password, 10);

    const result = await db.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashPassword,
        role: "trainer",
        exercise: {
          create: initialExercises,
        },
      },
    });
    return result;
  } catch (err: unknown) {
    console.log(err);
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: "Something went wrong" };
  }
}
