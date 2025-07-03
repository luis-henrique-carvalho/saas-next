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

import { DatePicker } from "./components/date-picker";

const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (!session.user.clinic) {
    redirect("/clinic/create");
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>Gerencie os médicos da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <DatePicker />
        </PageActions>
      </PageHeader>
      <PageContent>
        Dashboard
      </PageContent>
    </PageContainer>
  );
};

export default Dashboard;
