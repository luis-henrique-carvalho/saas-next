"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import React from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
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

import { upsertPatient } from "../actions";
import {
  UpsertPatientFormData,
  upsertPatientSchema,
} from "../schemas/upsert-patient-schema";

interface UpsertPatientFormProps {
  onSuccess?: () => void;
  patient?: UpsertPatientFormData;
}

const UpsertPatientForm = ({ patient, onSuccess }: UpsertPatientFormProps) => {
  const form = useForm<UpsertPatientFormData>({
    shouldUnregister: true,
    resolver: zodResolver(upsertPatientSchema),
    defaultValues: {
      id: patient?.id,
      name: patient?.name || "",
      email: patient?.email || "",
      phoneNumber: patient?.phoneNumber || "",
      sex: patient?.sex || undefined,
    },
  });

  const upsertPatientAction = useAction(upsertPatient, {
    onSuccess: () => {
      toast.success(
        patient
          ? "Paciente atualizado com sucesso!"
          : "Paciente adicionado com sucesso!",
      );
      onSuccess?.();
    },
    onError: (error) => {
      if (error.error?.validationErrors) {
        const errors = error.error.validationErrors;

        Object.entries(errors).forEach(([field, fieldErrors]) => {
          form.setError(field as keyof UpsertPatientFormData, {
            type: "manual",
            message: Array.isArray(
              (fieldErrors as { _errors?: string[] })._errors,
            )
              ? (fieldErrors as { _errors: string[] })._errors.join(", ")
              : "",
          });
        });

        return;
      }

      toast.error(
        patient ? "Erro ao atualizar paciente." : "Erro ao adicionar paciente.",
      );
    },
  });

  const onSubmit = async (values: UpsertPatientFormData) => {
    await upsertPatientAction.execute({ ...values, id: patient?.id });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {patient ? "Editar Paciente" : "Adicionar Paciente"}
        </DialogTitle>
        <DialogDescription>
          {patient
            ? "Edite os detalhes do paciente."
            : "Preencha os detalhes do novo paciente."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex max-h-[60vh] flex-col gap-6 overflow-y-auto pr-2 pb-4">
            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do paciente</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Digite o nome do paciente"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* E-mail */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Digite o e-mail"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Telefone */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de telefone</FormLabel>
                  <FormControl>
                    <PatternFormat
                      value={field.value}
                      customInput={Input}
                      placeholder="(99) 99999-9999"
                      onValueChange={(values) => field.onChange(values.value)}
                      format="(##) #####-####"
                      mask="_"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sexo */}
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sexo</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Masculino</SelectItem>
                        <SelectItem value="FEMALE">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={upsertPatientAction.status === "executing"}
            >
              {upsertPatientAction.status === "executing" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {patient ? "Salvar alterações" : "Adicionar paciente"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpsertPatientForm;
