import z from "zod";

export const upsertPatientSchema = z.object({
  id: z.string().optional(),
  name: z
    .string({ required_error: "É necessário informar o nome do paciente!" })
    .min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z
    .string({ required_error: "É necessário informar o e-mail!" })
    .email("E-mail inválido"),
  phoneNumber: z
    .string({ required_error: "É necessário informar o número de telefone!" })
    .min(10, "Telefone inválido"),
  sex: z.enum(["MALE", "FEMALE"], { required_error: "Selecione o sexo" }),
});

export type UpsertPatientFormData = z.infer<typeof upsertPatientSchema>;
