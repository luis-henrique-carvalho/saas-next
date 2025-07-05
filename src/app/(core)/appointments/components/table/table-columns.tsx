"use client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Prisma } from "@/generated/prisma";
import { formatCurrencyInCents } from "@/helpers/currency";

import TableActions from "./table-actions";

type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
  include: { patient: true; doctor: true };
}>;

export const appointmentsTableColumns: ColumnDef<AppointmentWithRelations>[] = [
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
    accessorKey: "date",
    header: "Data e Hora",
    cell: (params) => {
      const appointment = params.row.original;
      return format(new Date(appointment.date), "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      });
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
