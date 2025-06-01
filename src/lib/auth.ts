import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession } from "better-auth/plugins";

import prisma from "./prisma";

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    customSession(async ({ user, session }) => {
      const userClinic = await prisma.clinicUser.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          clinic: true,
        },
      });

      return {
        ...session,
        user: {
          ...user,
          clinic: userClinic?.clinic || null,
        },
      };
    }),
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
});
