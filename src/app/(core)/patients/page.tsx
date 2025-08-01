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
import { requireFullAuth } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";

import AddPatientButton from "./components/add-patient-button";
import { columns } from "./components/table/table-columns";
import { Patient } from "./types";

export default async function PatientsPage() {
  const session = await requireFullAuth();

  const dbPatients = await prisma.patient.findMany({
    where: {
      clinicId: session.user.clinic?.id,
    }
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
          <PageTitle>Pacientes</PageTitle>
          <PageDescription>
            Gerencie os pacientes da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddPatientButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable
          columns={columns}
          data={patients.map((p) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
          }))}
        />
      </PageContent>
    </PageContainer>
  );
}
