import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ClinicForm = () => {
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

          <DialogFooter>
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicForm;
