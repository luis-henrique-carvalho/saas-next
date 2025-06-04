import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/layout/page-container";
import { DataTable } from "@/components/ui/data-table";
import prisma from "@/lib/prisma";

import AddPatientButton from "./components/add-patient-button";
import { columns } from "./components/table/table-coluns";
import { Patient } from "./types";

export default async function PatientsPage() {
  const dbPatients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
  });
  const patients: Patient[] = dbPatients.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>
            Gerencie os pacientes da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddPatientButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable columns={columns} data={patients} />
      </PageContent>
    </PageContainer>
  );
}
