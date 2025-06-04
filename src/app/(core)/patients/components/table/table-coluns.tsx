"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPhoneNumber } from "@/helpers/utils";

import { Patient } from "../../types";

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
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Excluir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
