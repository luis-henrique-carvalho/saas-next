"use server";

import dayjs from "dayjs";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";

import { getAvailableTimes } from "../../doctors/actions/get-available-times";
import { appointmentSchema } from "../schemas";

export const createAppointment = actionClient
  .inputSchema(appointmentSchema)
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

    const availableTimes = await getAvailableTimes({
      id: parsedInput.doctorId,
      data: dayjs(parsedInput.date).format("YYYY-MM-DD"),
    });

    if (!availableTimes?.data) {
      throw new Error("No available times");
    }

    const isTimeAvailable = availableTimes.data?.some(
      (time) => time.value === parsedInput.time && time.available,
    );

    if (!isTimeAvailable) {
      throw new Error("Time not available");
    }

    await getAvailableTimes({
      id: parsedInput.doctorId,
      data: dayjs(parsedInput.date).format("YYYY-MM-DD"),
    });

    const appointmentDateTime = dayjs(parsedInput.date)
      .set("hour", parseInt(parsedInput.time.split(":")[0]))
      .set("minute", parseInt(parsedInput.time.split(":")[1]))
      .toDate();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { time, ...appointmentData } = parsedInput;

    try {
      await prisma.appointment.create({
        data: {
          ...appointmentData,
          clinicId: clinicId,
          date: appointmentDateTime,
        },
      });

      revalidatePath("/appointments");
      revalidatePath("/dashboard");
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw new Error("Failed to create appointment");
    }
  });
