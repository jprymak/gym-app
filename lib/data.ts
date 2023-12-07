import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function fetchExercises() {

try{
    const exercises = await prisma.exercise.findMany()
   return exercises

}catch(error){
    console.error(error);
    throw new Error("Failed to fetch exercises!");
}
}

