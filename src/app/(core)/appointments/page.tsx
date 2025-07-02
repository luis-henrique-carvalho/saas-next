import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

import AddAppointmentButton from "./components/add-appointment-button";
import { columns } from "./components/table/table-columns";

const AppointmentsPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        redirect("/authentication");
    }
    if (!session.user.clinic) {
        redirect("/clinic-form");
    }
    // if (!session.user.plan) {
    //     redirect("/new-subscription");
    // }
    const [patients, doctors, appointments] = await Promise.all([
        prisma.patient.findMany({
            where: { clinicId: session.user.clinic.id },
            orderBy: { createdAt: "desc" },
        }),
        prisma.doctor.findMany({
            where: { clinicId: session.user.clinic.id },
            orderBy: { createdAt: "desc" },
        }),
        prisma.appointment.findMany({
            where: { clinicId: session.user.clinic.id },
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
                <DataTable data={appointments} columns={columns} />
            </PageContent>
        </PageContainer>
    );
};

export default AppointmentsPage;
