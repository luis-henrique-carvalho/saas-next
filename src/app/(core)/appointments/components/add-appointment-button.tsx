"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Doctor, Patient } from "@/generated/prisma";

import AddAppointmentForm from "./add-appointment-form";

interface AddAppointmentButtonProps {
    patients: Patient[];
    doctors: Doctor[];
}

const AddAppointmentButton = ({
    patients,
    doctors,
}: AddAppointmentButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Novo agendamento
                </Button>
            </DialogTrigger>
            <AddAppointmentForm
                patients={patients}
                doctors={doctors}
                onSuccess={() => setIsOpen(false)}
            />
        </Dialog>
    );
};

export default AddAppointmentButton;
