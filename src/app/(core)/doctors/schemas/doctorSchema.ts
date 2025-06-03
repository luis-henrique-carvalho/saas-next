import z from "zod";

export const doctorSchema = z
  .object({
    id: z.coerce.string().optional(),
    name: z.coerce.string({ required_error: "É necessário informar o nome!" }),
    avatar: z
      .string()
      .url("Avatar deve ser uma URL válida")
      .optional()
      .or(z.literal("").transform(() => undefined)),
    specialty: z
      .string({ required_error: "É necessário informar a especialidade!" })
      .min(3, "A especialidade deve ter pelo menos 3 caracteres"),
    availableFromWeekday: z.coerce.string({
      required_error: "Informe o dia inicial de atendimento",
    }),
    availableToWeekday: z.coerce.string({
      required_error: "Informe o dia final de atendimento",
    }),
    availableFromTime: z.string({
      required_error: "Informe o horário inicial de atendimento",
    }),
    availableToTime: z.string({
      required_error: "Informe o horário final de atendimento",
    }),
    appointPriceInCents: z.coerce.number({
      required_error: "Informe o valor da consulta em centavos",
    }),
  })
  .refine(
    (data) => {
      // Assume formato HH:mm
      if (!data.availableFromTime || !data.availableToTime) return true;
      return data.availableFromTime < data.availableToTime;
    },
    {
      message: "O horário inicial deve ser menor que o horário final",
      path: ["availableFromTime"],
    },
  )
  .refine(
    (data) => {
      if (!data.availableFromTime || !data.availableToTime) return true;
      return data.availableFromTime < data.availableToTime;
    },
    {
      message: "O horário final deve ser maior que o horário inicial",
      path: ["availableToTime"],
    },
  );

export type DoctorFormData = z.infer<typeof doctorSchema>;
