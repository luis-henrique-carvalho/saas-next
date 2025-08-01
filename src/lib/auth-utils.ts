import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "./auth";

export async function getValidSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireClinic() {
  const session = await getValidSession();

  if (!session.user.clinic) {
    redirect("/clinic/create");
  }

  return session;
}

export async function requirePlan() {
  const session = await requireClinic();

  if (!session.user.plan) {
    redirect("/new-subscription");
  }

  return session;
}

export async function requireFullAuth() {
  const session = await requirePlan();

  return session;
}
