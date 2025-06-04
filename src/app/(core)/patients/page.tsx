import { PageContainer } from "@/components/layout/page-container";
import prisma from "@/lib/prisma";

import AddPatientButton from "./components/add-patient-button";
import { PatientCard } from "./components/patient-card";
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
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Pacientes</h1>
                <AddPatientButton />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {patients.length === 0 ? (
                    <div className="text-muted-foreground col-span-full">Nenhum paciente cadastrado.</div>
                ) : (
                    patients.map((patient) => (
                        <PatientCard key={patient.id} patient={patient} />
                    ))
                )}
            </div>
        </PageContainer>
    );
}
