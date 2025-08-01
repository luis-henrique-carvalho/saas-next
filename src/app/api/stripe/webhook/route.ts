import { NextResponse } from "next/server";
import Stripe from "stripe";

import prisma from "@/lib/prisma";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe secret key not found");
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    throw new Error("Stripe signature not found");
  }

  const text = await request.text();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil",
  });

  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    case "invoice.paid": {
      if (!event.data.object.id) {
        throw new Error(
          `Subscription ID not found in event: ${JSON.stringify(event.data.object)}`,
        );
      }

      const parent = event.data.object.parent;

      if (!parent || !parent.subscription_details) {
        throw new Error(
          `subscription_details not found in parent: ${JSON.stringify(parent)}`,
        );
      }

      const subscriptionDetails = parent.subscription_details;

      const customer = event.data.object.customer;

      if (!customer) {
        throw new Error(
          `Customer not found in event: ${JSON.stringify(event.data.object)}`,
        );
      }

      const userId = subscriptionDetails.metadata?.userId;

      if (!userId) {
        throw new Error(
          `User ID not found in subscriptionDetails: ${JSON.stringify(subscriptionDetails)}`,
        );
      }

      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: customer as string,
            stripeSubscriptionId: subscriptionDetails?.subscription as string,
            plan: "essential",
          },
        });
      } catch (error) {
        throw new Error("Update user not found", { cause: error });
      }

      break;
    }
    case "customer.subscription.deleted": {
      if (!event.data.object.id) {
        throw new Error("Subscription ID not found");
      }

      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id,
      );

      if (!subscription) {
        throw new Error("Subscription not found");
      }

      const userId = subscription.metadata.userId;

      if (!userId) {
        throw new Error("User ID not found");
      }

      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: null,
            stripeSubscriptionId: null,
            plan: null,
          },
        });
      } catch (error) {
        throw new Error("Update user not found", { cause: error });
      }

      break;
    }
  }

  return NextResponse.json({
    received: true,
  });
};
