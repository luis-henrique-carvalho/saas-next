"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";

export const deleteAppointment = actionClient
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

    const appointment = await prisma.appointment.findUnique({
      where: { id: parsedInput.id },
      select: { clinicId: true },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.clinicId !== clinicId) {
      throw new Error("Appointment does not belong to the clinic");
    }

    await prisma.appointment.delete({
      where: { id: parsedInput.id },
    });

    revalidatePath("/appointments");
    revalidatePath("/dashboard");
  });
