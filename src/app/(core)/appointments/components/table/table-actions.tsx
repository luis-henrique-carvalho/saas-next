import { EditIcon, MoreHorizontalIcon, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React from 'react'
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

import { deleteAppointment } from "../../actions/delete-appointment";
import { Appointment } from "../../types";

interface Props {
    appointment: Appointment
}

const TableActions = ({ appointment }: Props) => {
    const [editDialogIsOpen, setEditDialogIsOpen] = React.useState(false);

    const deleteAppointmentAction = useAction(deleteAppointment, {
        onSuccess: () => {
            toast.success("Agendamento deletado com sucesso.");
        },
        onError: () => {
            toast.error("Erro ao deletar agendamento.");
        },
    });

    const handleDeleteAppointmentClick = () => {
        if (!appointment) return;
        deleteAppointmentAction.execute({ id: appointment.id });
    };

    return (
        <Dialog open={editDialogIsOpen} onOpenChange={setEditDialogIsOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        Agendamento - {appointment.patient.name}
                    </DropdownMenuLabel>
                    <Separator className="my-1" />
                    <DropdownMenuItem onClick={() => setEditDialogIsOpen(true)}>
                        <EditIcon className="mr-2" />
                        Editar
                    </DropdownMenuItem>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2" />
                                Excluir
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Tem certeza que deseja deletar esse agendamento?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Essa ação não pode ser revertida. Isso irá deletar o agendamento permanentemente.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAppointmentClick}>
                                    Deletar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>

                {/* TODO: Add EditAppointmentForm component when created */}
                {/* <EditAppointmentForm onSuccess={handleEditAppointmentClick} appointment={appointment} /> */}
            </DropdownMenu>
        </Dialog>
    )
}

export default TableActions
