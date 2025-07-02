"use server";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { headers } from "next/headers";
import z from "zod";

import { generateTimeSlots } from "@/helpers/time";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getAvailableTimes = actionClient
  .inputSchema(
    z.object({
      id: z.string().uuid(),
      data: z.string().date(),
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
    });

    console.log(doctor);

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const selectedDayOfWeek = dayjs(parsedInput.data).day();

    const doctorIsAvailable =
      selectedDayOfWeek >= doctor.availableFromWeekday &&
      selectedDayOfWeek <= doctor.availableToWeekday;

    console.log("Doctor is available:", doctorIsAvailable);

    if (!doctorIsAvailable) {
      return [];
    }

    console.log("parsedInput.data", parsedInput.data);

    const startDate = dayjs(parsedInput.data).startOf("day").toDate();
    const endDate = dayjs(parsedInput.data).endOf("day").toDate();

    console.log("startDate", startDate);
    console.log("endDate", endDate);

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: parsedInput.id,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    console.log("Appointments:", appointments);

    const appointmentsDates = appointments.map((appointment) =>
      dayjs(appointment.date).format("HH:mm:ss"),
    );

    const timeSlots = generateTimeSlots();

    const doctorAvailableFrom = dayjs()
      .utc()
      .set("hour", Number(doctor.availableFromTime.split(":")[0]))
      .set("minute", Number(doctor.availableFromTime.split(":")[1]))
      .set("second", 0)
      .local();

    const doctorAvailableTo = dayjs()
      .utc()
      .set("hour", Number(doctor.availableToTime.split(":")[0]))
      .set("minute", Number(doctor.availableToTime.split(":")[1]))
      .set("second", 0)
      .local();

    const doctorTimeSlots = timeSlots.filter((time) => {
      const date = dayjs()
        .utc()
        .set("hour", Number(time.split(":")[0]))
        .set("minute", Number(time.split(":")[1]))
        .set("second", 0);

      return (
        date.format("HH:mm:ss") >= doctorAvailableFrom.format("HH:mm:ss") &&
        date.format("HH:mm:ss") <= doctorAvailableTo.format("HH:mm:ss")
      );
    });

    return doctorTimeSlots.map((time) => {
      return {
        value: time,
        available: !appointmentsDates.includes(time),
        label: time.substring(0, 5),
      };
    });
  });
