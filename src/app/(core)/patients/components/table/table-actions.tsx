import { EditIcon, MoreHorizontalIcon, Trash2 } from "lucide-react";
import React from 'react'

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Patient } from "@/generated/prisma";

import UpsertPatientForm from "../upsert-patient-form";
interface Props {
    patient: Patient
}

const TableActions = ({ patient }: Props) => {
    const [upsertDialogIsOpen, setUpsertDialogIsOpen] = React.useState(false);

    const handleDeletePatientClick = () => {
        if (!patient) return;
    };

    return (
        <Dialog open={upsertDialogIsOpen} onOpenChange={setUpsertDialogIsOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>{patient.name}</DropdownMenuLabel>
                    <Separator className="my-1" />
                    <DropdownMenuItem onClick={() => setUpsertDialogIsOpen(true)}>
                        <EditIcon className="mr-2" />
                        Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Trash2 className="mr-2" />
                        Excluir
                    </DropdownMenuItem>
                </DropdownMenuContent>

                <UpsertPatientForm onSuccess={handleDeletePatientClick} patient={patient} />
            </DropdownMenu>
        </Dialog>
    )
}

export default TableActions
