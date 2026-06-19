"use client";

import { Button } from "@/components/ui/button";
import { LogOut, TicketCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.valid) setUser(data.user.name);
      } catch {
        // not authenticated
      }
    })();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out");
      router.push("/");
    } catch {
      toast.error("Error logging out");
    }
  };

  return (
    <header className="border-b">
      <div className="  px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <TicketCheck className="size-6" />
          Tickets
        </div>
        <div className="flex items-center gap-4">
          {user && <span className="text-sm text-muted-foreground">Welcome: {user}</span>}
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="size-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
