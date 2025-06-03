"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";

export const deleteDoctor = actionClient
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

    const doctor = await prisma.doctor.findUnique({
      where: { id: parsedInput.id },
      select: { clinicId: true },
    });

    if (doctor?.clinicId !== clinicId) {
      throw new Error("Doctor does not belong to the clinic");
    }

    await prisma.doctor.delete({
      where: { id: parsedInput.id },
    });

    revalidatePath("/doctors");

    return { success: true };
  });
