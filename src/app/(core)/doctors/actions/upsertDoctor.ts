"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";

import { doctorSchema } from "../schemas";

export const upsertDoctor = actionClient
  .inputSchema(doctorSchema)
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

    const result = await prisma.doctor.upsert({
      where: { id: parsedInput.id || "" },
      update: {
        ...parsedInput,
        availableFromWeekday: parseInt(parsedInput.availableFromWeekday),
        availableToWeekday: parseInt(parsedInput.availableToWeekday),
        appointPriceInCents: parsedInput.appointPriceInCents * 100,
      },
      create: {
        ...parsedInput,
        availableFromWeekday: parseInt(parsedInput.availableFromWeekday),
        availableToWeekday: parseInt(parsedInput.availableToWeekday),
        appointPriceInCents: parsedInput.appointPriceInCents * 100,
        clinicId: clinicId,
      },
    });

    return result;
  });
