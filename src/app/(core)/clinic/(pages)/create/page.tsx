import { redirect } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getValidSession } from "@/lib/auth-utils";

import ClinicForm from "../../components/clinic-form";

const ClinicCreate = async () => {
  const session = await getValidSession()

  if (session.user.clinic) {
    redirect("/dashboard");
  }

  return (
    <div>
      <Dialog open>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Clinica</DialogTitle>
            <DialogDescription>
              Adicione uma clinica para continuar
            </DialogDescription>
          </DialogHeader>

          <ClinicForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicCreate;
