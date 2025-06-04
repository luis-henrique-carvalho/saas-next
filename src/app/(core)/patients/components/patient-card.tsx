"use client";

import { Mail, Phone, User } from "lucide-react";
import React, { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { Patient } from "../types";
import UpsertPatientForm from "./upsert-patient-form";

interface PatientCardProps {
    patient: Patient;
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export function PatientCard({ patient }: PatientCardProps) {
    const [isUpsertPatientDialogOpen, setIsUpsertPatientDialogOpen] = useState(false);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials(patient.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-sm font-medium">{patient.name}</h3>
                        <p className="text-muted-foreground text-sm">
                            {patient.sex === "MALE" ? "Masculino" : "Feminino"}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-2">
                <Badge variant="outline">
                    <Mail className="h-4 w-4" />
                    <span>{patient.email}</span>
                </Badge>
                <Badge variant="outline">
                    <Phone className="h-4 w-4" />
                    <span>{patient.phoneNumber}</span>
                </Badge>
                <Badge variant="outline">
                    <User className="h-4 w-4" />
                    <span>{patient.sex === "MALE" ? "Masculino" : "Feminino"}</span>
                </Badge>
            </CardContent>
            <Separator />
            <CardFooter className="flex flex-col gap-2">
                <Dialog
                    open={isUpsertPatientDialogOpen}
                    onOpenChange={setIsUpsertPatientDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button className="w-full">Ver detalhes</Button>
                    </DialogTrigger>
                    <UpsertPatientForm
                        patient={patient}
                        onSuccess={() => setIsUpsertPatientDialogOpen(false)}
                    />
                </Dialog>
                {/* Espaço para futuras ações, como deletar */}
            </CardFooter>
        </Card>
    );
}
