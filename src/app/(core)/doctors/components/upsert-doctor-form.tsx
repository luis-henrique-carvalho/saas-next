import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { upsertDoctor } from "../actions";
import { DoctorFormData, doctorSchema } from "../schemas";
import { medicalSpecialties } from "../types";
import TimeSelectField from "./time-selector-field";

interface UpsertDoctorFormProps {
  onSuccess?: () => void;
}

const UpsertDoctorForm = ({ onSuccess }: UpsertDoctorFormProps) => {
  const form = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      name: "",
      appointPriceInCents: 0,
      availableFromTime: "08:00:00",
      availableToTime: "09:00:00",
      availableFromWeekday: "1",
      availableToWeekday: "5",
      avatar: "",
      specialty: "",
    },
  });

  const upsertDoctorAction = useAction(upsertDoctor, {
    onSuccess: () => {
      toast.success("Médico adicionado com sucesso!");
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Error creating doctor:", error);
      toast.error("Erro ao adicionar médico. Tente novamente.");
    },
  });

  const onSubmit = async (data: DoctorFormData) => {
    await upsertDoctorAction.execute(data);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Médico</DialogTitle>
        <DialogDescription>Adicione um novo médico</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex max-h-[60vh] flex-col gap-6 overflow-y-auto pr-2 pb-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Digite o nome do médico"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Specialty */}
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidade</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a especialidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicalSpecialties.map((specialty) => (
                          <SelectItem
                            key={specialty.value}
                            value={specialty.value}
                          >
                            {specialty.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Appointment Price */}
            <FormField
              control={form.control}
              name="appointPriceInCents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Consulta</FormLabel>
                  <NumericFormat
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value.floatValue);
                    }}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    thousandSeparator="."
                    customInput={Input}
                    prefix="R$"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Available From Weekday */}
            <FormField
              control={form.control}
              name="availableFromWeekday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia Inicial de Atendimento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="0-6 (Domingo-Sábado)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Domingo</SelectItem>
                      <SelectItem value="1">Segunda-feira</SelectItem>
                      <SelectItem value="2">Terça-feira</SelectItem>
                      <SelectItem value="3">Quarta-feira</SelectItem>
                      <SelectItem value="4">Quinta-feira</SelectItem>
                      <SelectItem value="5">Sexta-feira</SelectItem>
                      <SelectItem value="6">Sábado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Available To Weekday */}
            <FormField
              control={form.control}
              name="availableToWeekday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dia Final de Atendimento</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="0-6 (Domingo-Sábado)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Domingo</SelectItem>
                        <SelectItem value="1">Segunda-feira</SelectItem>
                        <SelectItem value="2">Terça-feira</SelectItem>
                        <SelectItem value="3">Quarta-feira</SelectItem>
                        <SelectItem value="4">Quinta-feira</SelectItem>
                        <SelectItem value="5">Sexta-feira</SelectItem>
                        <SelectItem value="6">Sábado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <TimeSelectField
              label="Horário inicial de disponibilidade"
              name="availableFromTime"
              control={form.control}
            />

            <TimeSelectField
              label="Horário final de disponibilidade"
              name="availableToTime"
              control={form.control}
            />

            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="URL do avatar" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="m-2 h-4 w-4 animate-spin" />
              ) : (
                "Criar Médico"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertDoctorForm;
