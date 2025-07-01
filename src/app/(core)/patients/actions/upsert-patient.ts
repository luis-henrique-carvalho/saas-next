"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { returnValidationErrors } from "next-safe-action";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";

import { upsertPatientSchema } from "../schemas/upsert-patient-schema";

export const upsertPatient = actionClient
  .inputSchema(upsertPatientSchema)
  .action(async ({ parsedInput }) => {
    const { id, name, email, phoneNumber, sex } = parsedInput;

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
      await prisma.patient.upsert({
        where: { id: id || "" },
        update: { name, email, phoneNumber, sex },
        create: {
          name,
          email,
          phoneNumber,
          sex,
          clinicId,
        },
      });

      revalidatePath("/patients");
    } catch (error) {
      if ((error as { code?: string })?.code === "P2002") {
        returnValidationErrors(upsertPatientSchema, {
          email: {
            _errors: ["Email already registered"],
          },
        });
      }

      throw error;
    }
  });
