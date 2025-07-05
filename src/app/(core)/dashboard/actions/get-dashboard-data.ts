"use server";

import dayjs from "dayjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";

const dashboardDataSchema = z.object({
  from: z.string(),
  to: z.string(),
});

export const getDashboardData = actionClient
  .inputSchema(dashboardDataSchema)
  .action(async ({ parsedInput }) => {
    const session = await getValidSession();
    const { from, to } = getValidDateRange(parsedInput);

    const chartStartDate = dayjs().subtract(10, "day").startOf("day").toDate();
    const chartEndDate = dayjs().add(10, "day").endOf("day").toDate();

    const [
      totalRevenueResult,
      totalAppointmentsResult,
      totalPatientsResult,
      totalDoctorsResult,
      dailyAppointmentsDataRaw,
      topDoctorsRaw,
      topSpecialtiesRaw,
    ] = await Promise.all([
      getTotalRevenue(session.user.clinic!.id, from, to),
      getTotalAppointments(session.user.clinic!.id, from, to),
      getTotalPatients(session.user.clinic!.id),
      getTotalDoctors(session.user.clinic!.id),
      getDailyAppointmentsData(
        session.user.clinic!.id,
        chartStartDate,
        chartEndDate,
      ),
      getTopDoctors(session.user.clinic!.id),
      getTopSpecialties(session.user.clinic!.id),
    ]);

    return {
      totalRevenue: totalRevenueResult._sum.priceInCents || 0,
      totalAppointments: totalAppointmentsResult._count || 0,
      totalPatients: totalPatientsResult._count || 0,
      totalDoctors: totalDoctorsResult._count || 0,
      dailyAppointmentsData: dailyAppointmentsDataRaw.map((item) => ({
        date: dayjs(item.date).format("YYYY-MM-DD"),
        appointments: Number(item.appointments),
        revenue: Number(item.revenue),
      })),
      topDoctors: topDoctorsRaw,
      topSpecialties: topSpecialtiesRaw.map((specialty) => ({
        specialty: specialty.specialty,
        appointments: Number(specialty.appointments),
      })),
    };
  });

async function getValidSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/login");
  if (!session.user.clinic) redirect("/clinic/create");
  return session;
}

function getValidDateRange(searchParams: { from: string; to: string }) {
  const { from, to } = searchParams;
  if (!from || !to) {
    redirect(
      `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`,
    );
  }
  return { from: new Date(from), to: new Date(to) };
}

async function getTotalRevenue(clinicId: string, from: Date, to: Date) {
  return prisma.appointment.aggregate({
    _sum: { priceInCents: true },
    where: {
      clinicId,
      date: { gte: from, lte: to },
    },
  });
}

async function getTotalAppointments(clinicId: string, from: Date, to: Date) {
  return prisma.appointment.aggregate({
    _count: true,
    where: {
      clinicId,
      date: { gte: from, lte: to },
    },
  });
}

async function getTotalPatients(clinicId: string) {
  return prisma.patient.aggregate({
    _count: true,
    where: { clinicId },
  });
}

async function getTotalDoctors(clinicId: string) {
  return prisma.doctor.aggregate({
    _count: true,
    where: { clinicId },
  });
}

async function getDailyAppointmentsData(
  clinicId: string,
  from: Date,
  to: Date,
) {
  return prisma.$queryRaw<
    {
      date: Date;
      appointments: number;
      revenue: number;
    }[]
  >`
    SELECT
      DATE_TRUNC('day', "date") AS "date",
      COUNT(id) as "appointments",
      SUM("priceInCents") as "revenue"
    FROM "appointment"
    WHERE
      "clinicId" = ${clinicId}
      AND "date" >= ${from}
      AND "date" <= ${to}
    GROUP BY
      DATE_TRUNC('day', "date")
    ORDER BY
      "date" ASC`;
}

async function getTopDoctors(clinicId: string) {
  return prisma.$queryRaw<
    {
      id: string;
      name: string;
      avatar: string | null;
      specialty: string;
      appointments: number;
    }[]
  >`
    SELECT
      d.id,
      d.name,
      d."avatar",
      d.specialty,
      COUNT(a.id) AS "appointments"
    FROM
      "doctor" d
    LEFT JOIN
      "appointment" a ON d.id = a."doctorId" AND a."clinicId" = ${clinicId}
    GROUP BY
      d.id
    ORDER BY
      "appointments" DESC
    LIMIT 5
  `;
}

async function getTopSpecialties(clinicId: string) {
  return prisma.$queryRaw<
    {
      specialty: string;
      appointments: bigint;
    }[]
  >`
    SELECT
      d.specialty,
      COUNT(a.id) AS "appointments"
    FROM
      "doctor" d
    LEFT JOIN
      "appointment" a ON d.id = a."doctorId" AND a."clinicId" = ${clinicId}
    GROUP BY
      d.specialty
    ORDER BY
      "appointments" DESC
    LIMIT 5
  `;
}
