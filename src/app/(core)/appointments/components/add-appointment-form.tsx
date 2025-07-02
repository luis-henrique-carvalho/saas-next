"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Doctor, Patient } from "@/generated/prisma";
import { cn } from "@/lib/utils";

import { createAppointment } from "../actions";
import { AppointmentFormData, appointmentSchema } from "../schemas";

interface AddAppointmentFormProps {
    patients: Patient[];
    doctors: Doctor[];
    onSuccess?: () => void;
}

const AddAppointmentForm = ({
    patients,
    doctors,
    onSuccess,
}: AddAppointmentFormProps) => {
    const form = useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            patientId: "",
            doctorId: "",
            priceInCents: 0,
            date: undefined,
        },
    });

    // TODO: implementar action de criação de agendamento
    const createAppointmentAction = useAction(createAppointment, {
        onSuccess: () => {
            toast.success("Agendamento criado com sucesso!");
            onSuccess?.();
        },
        onError: (error: unknown) => {
            toast.error(
                error instanceof Error ? error.message : "Erro ao criar agendamento.",
            );
            console.error(error);
        },
    });

    const onSubmit = async (values: AppointmentFormData) => {
        await createAppointmentAction.execute({
            patientId: values.patientId,
            doctorId: values.doctorId,
            priceInCents: values.priceInCents * 100,
            date: values.date,
        });
    }

    const selectedDoctorId = form.watch("doctorId");
    const selectedPatientId = form.watch("patientId");
    // const selectedDate = form.watch("date");

    useEffect(() => {
        if (selectedDoctorId) {
            const selectedDoctor = doctors.find(
                (doctor) => doctor.id === selectedDoctorId,
            );

            if (selectedDoctor) {
                form.setValue(
                    "priceInCents",
                    selectedDoctor.appointPriceInCents / 100,
                );
            }
        }
    }, [selectedDoctorId, doctors, form]);

    const isDateAvailable = (date: Date) => {
        if (!selectedDoctorId) return false;

        const selectedDoctor = doctors.find(
            (doctor) => doctor.id === selectedDoctorId,
        );

        if (!selectedDoctor) return false;

        const dayOfWeek = date.getDay();

        return (
            dayOfWeek >= selectedDoctor?.availableFromWeekday &&
            dayOfWeek <= selectedDoctor?.availableToWeekday
        );
    };

    const isDateTimeEnabled = selectedPatientId && selectedDoctorId;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Novo Agendamento</DialogTitle>
                <DialogDescription>Preencha os detalhes do agendamento.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex max-h-[60vh] flex-col gap-6 overflow-y-auto pr-2 pb-4">
                        <FormField
                            control={form.control}
                            name="patientId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Paciente</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione um paciente" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {patients.map((patient) => (
                                                <SelectItem key={patient.id} value={patient.id}>
                                                    {patient.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="doctorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Médico</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione um médico" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {doctors.map((doctor) => (
                                                <SelectItem key={doctor.id} value={doctor.id}>
                                                    {doctor.name} - {doctor.specialty}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="priceInCents"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valor da consulta</FormLabel>
                                    <NumericFormat
                                        value={field.value}
                                        onValueChange={(value) => {
                                            field.onChange(value.floatValue);
                                        }}
                                        decimalScale={2}
                                        fixedDecimalScale
                                        decimalSeparator=","
                                        thousandSeparator="."
                                        prefix="R$ "
                                        allowNegative={false}
                                        disabled={true}
                                        customInput={Input}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Data</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    disabled={!isDateTimeEnabled}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !field.value && "text-muted-foreground",
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: ptBR })
                                                    ) : (
                                                        <span>Selecione uma data</span>
                                                    )}
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date() || !isDateAvailable(date)
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={createAppointmentAction.isPending}>
                                {createAppointmentAction.isPending
                                    ? "Criando..."
                                    : "Criar agendamento"}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </Form>
        </DialogContent>
    );
};

export default AddAppointmentForm;
