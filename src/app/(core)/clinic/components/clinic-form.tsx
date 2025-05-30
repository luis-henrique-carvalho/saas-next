"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { createClinicAction } from "../actions";
import { ClinicFormData, clinicSchema } from "../schemas";

const ClinicForm = () => {
  const form = useForm<ClinicFormData>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: ClinicFormData) => {
    try {
      await createClinicAction(data);
      toast.success("Clínica criada com sucesso!");
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message || "Erro ao criar clínica");
      } else {
        toast.error("Erro ao criar clínica");
      }
    } finally {
      redirect("/dashboard");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome da clinica" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="submit">
            {form.formState.isSubmitting ? (
              <Loader2 className="m-2 h-4 w-4 animate-spin" />
            ) : (
              "Adicionar Clínica"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default ClinicForm;
