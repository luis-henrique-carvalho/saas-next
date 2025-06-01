// TODO: change to outher folder
"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

const LogoutButton = () => {
  const router = useRouter();

  return (
    <DropdownMenuItem
      variant="destructive"
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success("You have been signed out successfully!");
              router.push("/login");
            },
            onError: (ctx) => {
              toast.error(ctx.error.message || "Sign out failed!");
            },
          },
        })
      }
    >
      <LogOut />
      Sair
    </DropdownMenuItem>
  );
};

export default LogoutButton;
