"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";

import { appointmentSchema } from "../schemas";

export const createAppointment = actionClient
  .inputSchema(appointmentSchema)
  .action(async ({ parsedInput }) => {
    const { patientId, date, doctorId, priceInCents } = parsedInput;

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

    try {
      await prisma.appointment.create({
        data: {
          patientId,
          date,
          clinicId,
          doctorId,
          priceInCents,
        },
      });

      revalidatePath("/appointments");
    } catch (error) {
      throw error;
    }
  });
