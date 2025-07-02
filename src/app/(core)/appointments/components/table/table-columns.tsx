"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Prisma } from "@/generated/prisma";
import { formatCurrencyInCents } from "@/helpers/currency";

import TableActions from "./table-actions";

type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
    include: { patient: true, doctor: true }
}>;

export const columns: ColumnDef<AppointmentWithRelations>[] = [
    {
        id: "patient",
        header: "Paciente",
        accessorKey: "patient.name",
        cell: ({ row }) => {
            return <div>{row.original.patient.name}</div>;
        },
    },
    {
        id: "doctor",
        header: "Médico",
        accessorKey: "doctor.name",
        cell: ({ row }) => {
            return <div>{row.original.doctor.name}</div>;
        },
    },
    {
        id: "date",
        header: "Data",
        accessorKey: "date",
        cell: ({ row }) => {
            const date = new Date(row.original.date);
            return (
                <div>
                    {date.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })}
                </div>
            );
        },
    },
    {
        id: "time",
        header: "Horário",
        accessorKey: "date",
        cell: ({ row }) => {
            const date = new Date(row.original.date);
            return (
                <div>
                    {date.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </div>
            );
        },
    },
    {
        id: "price",
        header: "Valor",
        accessorKey: "priceInCents",
        cell: ({ row }) => {
            return <div>{formatCurrencyInCents(row.original.priceInCents)}</div>;
        },
    },
    {
        id: "actions",
        header: "Ações",
        accessorKey: "actions",
        cell: (params) => {
            const appointment = params.row.original;
            return <TableActions appointment={appointment} />;
        },
    },
];
