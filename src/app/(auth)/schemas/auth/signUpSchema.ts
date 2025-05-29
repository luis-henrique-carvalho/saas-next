import z from "zod";

export const signUpSchema = z
  .object({
    name: z.coerce.string({ required_error: "É necessário informar o nome!" }),
    email: z.coerce
      .string({ required_error: "É necessário informar o email!" })
      .trim()
      .email({ message: "O email deve ser válido" }),
    password: z.coerce
      .string({ required_error: "É necessário informar a senha!" })
      .min(6, "A senha precisa ter o mínimo de 6 caracteres"),
    confirmPassword: z.coerce.string({
      required_error: "É necessário confirmar a senha!",
    }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type signUpFormData = z.infer<typeof signUpSchema>;
