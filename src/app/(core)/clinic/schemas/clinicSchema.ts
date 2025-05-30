import z from "zod";

export const clinicSchema = z.object({
  name: z.coerce
    .string({ required_error: "É necessário informar o nome da clínica!" })
    .trim()
    .min(3, "O nome da clínica deve ter no mínimo 3 caracteres"),
});

export type ClinicFormData = z.infer<typeof clinicSchema>;
