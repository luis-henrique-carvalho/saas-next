"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";

import { upsertPatientSchema } from "../schemas/upsert-patient-schema";

export const upsertPatient = actionClient
  .inputSchema(upsertPatientSchema)
  .action(async ({ parsedInput }) => {
    const { id, name, email, phoneNumber, sex } = parsedInput;

    const patient = await prisma.patient.upsert({
      where: { id: id || "" },
      update: { name, email, phoneNumber, sex },
      create: { name, email, phoneNumber, sex },
    });

    revalidatePath("/patients");
    return patient;
  });
