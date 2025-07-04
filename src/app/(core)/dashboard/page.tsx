
import dayjs from "dayjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/layout/page-container";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

import AppointmentChart from "./components/chart/appointment-chart";
import { DatePicker } from "./components/date-picker";
import StatsCards from "./components/status-card";

interface DashboardPageProps {
  searchParams: Promise<{
    from: string;
    to: string;
  }>;
}

const Dashboard = async ({ searchParams }: DashboardPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (!session.user.clinic) {
    redirect("/clinic/create");
  }

  const { from, to } = await searchParams

  if (!from || !to) {
    redirect(
      `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`,
    );
  }

  const fromDate = new Date(from)
  const toDate = new Date(to)

  const chartStarDate = dayjs().subtract(10, "day").startOf("day").toDate();
  const chartEndDate = dayjs().add(10, "day").endOf("day").toDate();

  const [
    totalRevenueResult,
    totalAppointmentsResult,
    totalPatientsResult,
    totalDoctorsResult,
    dailyAppointmentsDataRaw,
    topDoctorsRaw
  ] = await Promise.all([
    prisma.appointment.aggregate({
      _sum: { priceInCents: true },
      where: {
        clinicId: session.user.clinic.id,
        date: {
          gte: fromDate,
          lte: toDate,
        },
      },
    }),
    prisma.appointment.aggregate({
      _count: true,
      where: {
        clinicId: session.user.clinic.id,
        date: {
          gte: fromDate,
          lte: toDate,
        },
      },
    }),
    prisma.patient.aggregate({
      _count: true,
      where: {
        clinicId: session.user.clinic.id,
      },
    }),
    prisma.doctor.aggregate({
      _count: true,
      where: {
        clinicId: session.user.clinic.id,
      },
    }),
    prisma.$queryRaw<
      {
        date: Date;
        appointments: number;
        revenue: number;
      }[]>
      `SELECT
        DATE_TRUNC('day', "date") AS "date",
        COUNT(id) as "appointments",
        SUM("priceInCents") as "revenue"
      FROM "appointment"
      WHERE
        "clinicId" = ${session.user.clinic.id}
        AND "date" >= ${chartStarDate}
        AND "date" <= ${chartEndDate}
      GROUP BY
        DATE_TRUNC('day', "date")
      ORDER BY
        "date" ASC`,
    prisma.$queryRaw<
      { doctorId: string; doctorName: string; appointments: number }[]
    >`
    SELECT
      d.id AS "doctorId",
      d.name AS "doctorName",
      COUNT(a.id) AS "appointments"
    FROM "appointment" a
    JOIN "doctor" d ON d.id = a."doctorId"
    WHERE a."clinicId" = ${session.user.clinic.id}
    GROUP BY d.id, d.name
    ORDER BY "appointments" ASC
    LIMIT 5
  `
  ]);

  console.log("Top Doctors Raw Data:", topDoctorsRaw);

  const dailyAppointmentsData = dailyAppointmentsDataRaw.map((item) => ({
    date: dayjs(item.date).format("YYYY-MM-DD"),
    appointments: Number(item.appointments),
    revenue: Number(item.revenue),
  }));

  const totalAppointment = totalRevenueResult._sum.priceInCents

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>Tenha a visão geral do seu negócio</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        <StatsCards
          totalRevenue={totalAppointment ? Number(totalAppointment) : null}
          totalAppointments={totalAppointmentsResult._count}
          totalPatients={totalPatientsResult._count}
          totalDoctors={totalDoctorsResult._count}
        />

        <div className="grid grid-cols-[2.25fr_1fr] gap-4">
          <AppointmentChart
            dailyAppointmentsData={dailyAppointmentsData}
          />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default Dashboard;
