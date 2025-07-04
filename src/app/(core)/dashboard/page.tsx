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
import TopDoctors from "./components/top-doctors";
import TopSpecialties from "./components/top-specialties";

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

  const { from, to } = await searchParams;

  if (!from || !to) {
    redirect(
      `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`,
    );
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  const chartStarDate = dayjs().subtract(10, "day").startOf("day").toDate();
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
      }[]
    >`
    SELECT
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
      (
        {
          id: string;
          name: string;
          avatar: string | null;
          specialty: string;
          appointments: number;
        }
      )[]
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
        "appointment" a ON d.id = a."doctorId" AND a."clinicId" = ${session.user.clinic.id}
      GROUP BY
        d.id
      ORDER BY
        "appointments" DESC
      LIMIT 5
    `,
    prisma.$queryRaw<
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
        "appointment" a ON d.id = a."doctorId" AND a."clinicId" = ${session.user.clinic.id}
      GROUP BY
        d.specialty
      ORDER BY
        "appointments" DESC
      LIMIT 5
    `,
  ]);

  const dailyAppointmentsData = dailyAppointmentsDataRaw.map((item) => ({
    date: dayjs(item.date).format("YYYY-MM-DD"),
    appointments: Number(item.appointments),
    revenue: Number(item.revenue),
  }));

  const totalAppointment = totalRevenueResult._sum.priceInCents;

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

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-[2.25fr_1fr]">
          <AppointmentChart dailyAppointmentsData={dailyAppointmentsData} />
          <TopDoctors
            doctors={topDoctorsRaw.map((doctor) => ({
              ...doctor,
              appointments: Number(doctor.appointments),
            }))}
          />
          <TopSpecialties
            topSpecialties={topSpecialtiesRaw.map((specialty) => ({
              ...specialty,
              appointments: Number(specialty.appointments),
            }))}
          />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default Dashboard;
