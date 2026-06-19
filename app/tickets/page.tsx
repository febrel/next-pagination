import { Button } from "@/components/ui/button";
import { LucidePlusCircle } from "lucide-react";
import { getTickets } from "./tickets.api";
import { TicketCard } from "@/components/ticket-card";
import Link from "next/link";

export default async function TicketsPage() {
  const { tickets } = await getTickets();

  return (
    <div className="w-full max-w-5xl mx-auto p-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tickets</h1>
        <Button>
          <Link href="/tickets/new" className="flex items-center gap-2">
            Add new ticket
            <LucidePlusCircle className="size-4" />
          </Link>
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}
