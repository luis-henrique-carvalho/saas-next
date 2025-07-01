"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";

export const deletePatient = actionClient
  .inputSchema(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const clinicId = session.user.clinic?.id;

    if (!clinicId) {
      throw new Error("Clinic ID is required");
    }

    // Check if patient exists and belongs to the clinic through appointments
    const patient = await prisma.patient.findUnique({
      where: { id: parsedInput.id },
    });

    console.log(patient);

    if (!patient) {
      throw new Error("Patient not found");
    }

    await prisma.patient.delete({
      where: { id: parsedInput.id },
    });

    revalidatePath("/patients");

    return { success: true };
  });
