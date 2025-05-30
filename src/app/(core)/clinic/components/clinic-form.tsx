"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ClinicFormData, clinicSchema } from "../schemas";

const ClinicForm = () => {
  const form = useForm<ClinicFormData>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => console.log(data))}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Clínica</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="text"
                  placeholder="Digite o nome da clínica"
                  className="input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ClinicForm;
