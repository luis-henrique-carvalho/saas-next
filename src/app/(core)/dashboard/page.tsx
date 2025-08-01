import dayjs from "dayjs";
import { Calendar } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { requireFullAuth } from "@/lib/auth-utils";

import { appointmentsTableColumns } from "../appointments/components/table/table-columns";
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
  await requireFullAuth();

  const { from, to } = await searchParams;

  if (!from || !to) {
    redirect(
      `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`,
    );
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
    todayAppointments,
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

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2.25fr_1fr]">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="text-muted-foreground" />
                <CardTitle className="text-base">
                  Agendamentos de hoje
                </CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <DataTable
                columns={appointmentsTableColumns}
                data={todayAppointments}
              />
            </CardContent>
          </Card>

          <TopSpecialties topSpecialties={topSpecialties} />
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default Dashboard;
