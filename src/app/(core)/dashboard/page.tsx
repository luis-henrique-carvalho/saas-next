
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

  const [
    totalRevenueResult,
    totalAppointmentsResult,
    totalPatientsResult,
    totalDoctorsResult,
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
  ]);

  console.log("Total Revenue Result:", totalRevenueResult);
  console.log("Total Appointments Result:", totalAppointmentsResult);
  console.log("Total Patients Result:", totalPatientsResult);
  console.log("Total Doctors Result:", totalDoctorsResult);

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
      </PageContent>
    </PageContainer>
  );
};

export default Dashboard;
