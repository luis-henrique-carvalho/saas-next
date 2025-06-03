"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

import { ClinicFormData } from "../schemas";

export const createClinic = async (data: ClinicFormData) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const result = await prisma.$transaction(async (tx) => {
    const clinic = await tx.clinic.create({
      data,
    });

    await tx.clinicUser.create({
      data: {
        userId: session.user.id,
        clinicId: clinic.id,
      },
    });

    return clinic;
  });

  return result;
};
