import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

const DoctorsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }


  if (session.user.clinic === null) {
    redirect("/clinic/create");
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button>
            Adicionar Médico
          </Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <p>This is where you can manage your doctors.</p>
      </PageContent>
    </PageContainer>);
};

export default DoctorsPage;
