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

function parseTimeToUtc(time: string) {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return dayjs()
    .set("hours", hours)
    .set("minutes", minutes)
    .set("seconds", seconds)
    .utc();
}

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

    const availableFromTimeUtc = parseTimeToUtc(parsedInput.availableFromTime);
    const availableToTimeUtc = parseTimeToUtc(parsedInput.availableToTime);

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

    revalidatePath("/doctors");
  });
