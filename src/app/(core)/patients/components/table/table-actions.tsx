import { EditIcon, MoreHorizontalIcon, Trash2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React from "react";
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
import { Patient } from "@/generated/prisma";

import { deletePatient } from "../../actions/deletePatient";
import UpsertPatientForm from "../upsert-patient-form";

interface Props {
  patient: Patient;
}

const TableActions = ({ patient }: Props) => {
  const [upsertDialogIsOpen, setUpsertDialogIsOpen] = React.useState(false);

  const deletePatientAction = useAction(deletePatient, {
    onSuccess: () => {
      toast.success("Paciente deletado com sucesso.");
    },
    onError: () => {
      toast.error("Erro ao deletar paciente.");
    },
  });

  const handleDeletePatientClick = () => {
    if (!patient) return;
    deletePatientAction.execute({ id: patient.id });
  };

  const handleEditPatientClick = () => {
    setUpsertDialogIsOpen(false);
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
                  Tem certeza que deseja deletar esse paciente?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser revertida. Isso irá deletar o paciente
                  e todas as consultas agendadas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeletePatientClick}>
                  Deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>

        <UpsertPatientForm
          onSuccess={handleEditPatientClick}
          patient={patient}
        />
      </DropdownMenu>
    </Dialog>
  );
};

export default TableActions;
