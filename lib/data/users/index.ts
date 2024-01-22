"use server";

import bcrypt from "bcrypt";

import { db } from "@/lib/db";
import { User } from "@prisma/client";

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
      },
    });
    return result;
  } catch (err: unknown) {
    console.log(err);
    if (err instanceof Error) {
      console.log("lol");
      return { error: err.message };
    }
    return { error: "Something went wrong" };
  }
}
