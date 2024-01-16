"use server";

import { revalidatePath } from "next/cache";

import { ClientPartial } from "@/app/clients/columns";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

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
    revalidatePath("/clients");
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
    revalidatePath("/clients");
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
    revalidatePath("/clients");
    return result;
  } catch (e) {
    console.error(e);
    const result = {
      error: "Client could not be deleted.",
    };
    return result;
  }
}
