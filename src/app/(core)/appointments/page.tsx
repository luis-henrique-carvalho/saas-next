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

import AddAppointmentButton from "./components/add-appointment-button";
import { appointmentsTableColumns } from "./components/table/table-columns";

const AppointmentsPage = async () => {
  const session = await requireFullAuth()

  const clinicId = session.user.clinic?.id;

  if (!clinicId) {
    throw new Error("Usuário não está associado a uma clínica.");
  }

  const [patients, doctors, appointments] = await Promise.all([
    prisma.patient.findMany({
      where: { clinicId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.doctor.findMany({
      where: { clinicId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.appointment.findMany({
      where: { clinicId: session.user.clinic?.id },
      orderBy: { date: "desc" },
      include: {
        patient: true,
        doctor: true,
      },
    }),
  ]);

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>
            Gerencie os agendamentos da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddAppointmentButton patients={patients} doctors={doctors} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <DataTable data={appointments} columns={appointmentsTableColumns} />
      </PageContent>
    </PageContainer>
  );
};

export default AppointmentsPage;
