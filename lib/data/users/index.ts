"use server";

import bcrypt from "bcrypt";

import { db } from "@/lib/db";

export async function createUser(userData: any) {
  try {
    const duplicate = await db.user.findFirst({
      where: {
        email: userData.email,
      },
    });

    if (duplicate) {
      throw Error;
    }

    const hashPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashPassword;
    await db.user.create({
      data: {
        ...userData,
        role: "trainer",
      },
    });
  } catch (err) {
    console.log(err);
  }
}
