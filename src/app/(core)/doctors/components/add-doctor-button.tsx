"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertDoctorForm from "./upsert-doctor-form";

const AddDoctorButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Adicionar Médico</Button>
      </DialogTrigger>

      <UpsertDoctorForm />
    </Dialog>
  );
};

export default AddDoctorButton;
