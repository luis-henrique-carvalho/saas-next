"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertPatientForm from "./upsert-patient-form";

const AddPatientButton = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Adicionar Paciente</Button>
      </DialogTrigger>

      <UpsertPatientForm
        onSuccess={() => {
          setIsOpen(false);
        }}
      />
    </Dialog>
  );
};

export default AddPatientButton;
