import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import LogoutButton from "@/app/(auth)/components/logout-button";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const clincUsers = await prisma.clinicUser.findMany({
    where: {
      userId: session?.user.id,
    },
  });

  if (clincUsers.length === 0) {
    redirect("/clinic-form");
  }

  return (
    <div>
      Dashboard
      <h2>{session?.user.name}</h2>
      <h2>{session?.user.email}</h2>
      {session && <LogoutButton />}
    </div>
  );
};

export default Dashboard;
