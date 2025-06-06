"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Patient } from "@/generated/prisma";
import { formatPhoneNumber } from "@/helpers/utils";

import TableActions from "./table-actions";

export const columns: ColumnDef<Patient>[] = [
  {
    id: "name",
    header: "Nome",
    accessorKey: "name",
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
  },
  {
    id: "phoneNumber",
    header: "Telefone",
    accessorKey: "phoneNumber",
    cell: ({ row }) => {
      return <div>{formatPhoneNumber(row.original.phoneNumber)}</div>;
    },
  },
  {
    id: "sex",
    header: "Sexo",
    accessorKey: "sex",
    cell: ({ row }) => {
      return (
        <div>{row.original.sex === "MALE" ? "Masculino" : "Feminino"}</div>
      );
    },
  },
  {
    id: "actions",
    header: "Ações",
    accessorKey: "actions",
    cell: (params) => {
      const patient = params.row.original;
      return <TableActions patient={patient} />;
    },
  },
];
