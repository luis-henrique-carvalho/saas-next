import z from "zod";

export const signInSchema = z.object({
  email: z.coerce
    .string({ required_error: "É necessário informar o email!" })
    .trim()
    .email({ message: "O email deve ser válido" }),
  password: z.coerce
    .string({ required_error: "É necessário informar a senha!" })
    .min(6, "A senha precisa ter o mínimo de 6 caracteres")
    .trim(),
});

export type signInFormData = z.infer<typeof signInSchema>;
