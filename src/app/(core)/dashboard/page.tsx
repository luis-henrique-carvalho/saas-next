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
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";

import { getDashboardData } from "./actions/get-dashboard-data";
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

  const dashboardDataResult = await getDashboardData(await searchParams);

  if (dashboardDataResult.serverError) {
    throw new Error(dashboardDataResult.serverError);
  }

  const data = dashboardDataResult.data;

  if (!data) {
    throw new Error("Erro ao carregar dados do dashboard");
  }

  const {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    dailyAppointmentsData,
    topDoctors,
    topSpecialties,
  } = data;

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
          totalRevenue={totalRevenue}
          totalAppointments={totalAppointments}
          totalPatients={totalPatients}
          totalDoctors={totalDoctors}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2.25fr_1fr]">
          <AppointmentChart dailyAppointmentsData={dailyAppointmentsData} />
          <TopDoctors doctors={topDoctors} />
        </div>

        <div className="grid grid-cols-[2.25fr_1fr] gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="text-muted-foreground" />
                <CardTitle className="text-base">
                  Agendamentos de hoje
                </CardTitle>
              </div>
            </CardHeader>
            {/* <CardContent>
              <DataTable
                columns={appointmentsTableColumns}
                data={todayAppointments}
              />
            </CardContent> */}
          </Card>
          <TopSpecialties topSpecialties={topSpecialties} />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default Dashboard;
