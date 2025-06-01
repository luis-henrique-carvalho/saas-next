import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/lib/auth";

const Dashboard = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (!session.user.clinic) {
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
        <li key={session.user.clinic.id}>{session.user.clinic.name}</li>
      </ul>
    </div>
  );
};

export default Dashboard;
