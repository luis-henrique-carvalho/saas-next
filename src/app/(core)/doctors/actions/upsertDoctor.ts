"use server";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";

import { doctorSchema } from "../schemas";

dayjs.extend(utc);

export const upsertDoctor = actionClient
  .inputSchema(doctorSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const availableFromTimeUtc = dayjs()
      .set("hours", parseInt(parsedInput.availableFromTime.split(":")[0]))
      .set("minutes", parseInt(parsedInput.availableFromTime.split(":")[1]))
      .set("seconds", parseInt(parsedInput.availableFromTime.split(":")[2]))
      .utc();

    const availableToTimeUtc = dayjs()
      .set("hours", parseInt(parsedInput.availableToTime.split(":")[0]))
      .set("minutes", parseInt(parsedInput.availableToTime.split(":")[1]))
      .set("seconds", parseInt(parsedInput.availableToTime.split(":")[2]))
      .utc();

    if (!session) {
      throw new Error("Unauthorized");
    }

    const clinicId = session.user.clinic?.id;

    if (!clinicId) {
      throw new Error("Clinic ID is required");
    }

    await prisma.doctor.upsert({
      where: { id: parsedInput.id || "" },
      update: {
        ...parsedInput,
        availableFromWeekday: parseInt(parsedInput.availableFromWeekday),
        availableToWeekday: parseInt(parsedInput.availableToWeekday),
        availableFromTime: availableFromTimeUtc.format("HH:mm:ss"),
        availableToTime: availableToTimeUtc.format("HH:mm:ss"),
        appointPriceInCents: parsedInput.appointPriceInCents * 100,
      },
      create: {
        ...parsedInput,
        availableFromWeekday: parseInt(parsedInput.availableFromWeekday),
        availableToWeekday: parseInt(parsedInput.availableToWeekday),
        availableFromTime: availableFromTimeUtc.format("HH:mm:ss"),
        availableToTime: availableToTimeUtc.format("HH:mm:ss"),
        appointPriceInCents: parsedInput.appointPriceInCents * 100,
        clinicId: clinicId,
      },
    });

    console.log("Doctor upserted successfully");

    revalidatePath("/doctors");
  });
