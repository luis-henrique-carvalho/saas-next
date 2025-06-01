import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

import LogoutButton from "@/app/(auth)/components/logout-button";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const clincUsers = await prisma.clinicUser.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      clinic: true,
    },
  });

  if (clincUsers.length === 0) {
    redirect("/clinic/create");
  }

  return (
    <div>
      Dashboard
      <h2>{session?.user.name}</h2>
      <h2>{session?.user.email}</h2>
      {session?.user.image && (
        <Image
          src={session.user.image}
          alt="User Avatar"
          width={100}
          height={100}
          className="rounded-full"
        />
      )}
      <h3>Clinics:</h3>
      <ul>
        {clincUsers.map((clinicUser) => (
          <li key={clinicUser.clinic.id}>{clinicUser.clinic.name}</li>
        ))}
      </ul>
      {session && <LogoutButton />}
    </div>
  );
};

export default Dashboard;
