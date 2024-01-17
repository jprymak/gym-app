"use server";

import { revalidatePath } from "next/cache";

export const revalidateServerSide = async (url: string) => {
  revalidatePath(url);
};
