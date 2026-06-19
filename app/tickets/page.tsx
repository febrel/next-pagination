import { Button } from "@/components/ui/button";
import { LucidePlusCircle } from "lucide-react";
import { getTickets } from "./tickets.api";
import { TicketCard } from "@/components/ticket-card";
import Link from "next/link";
import { redirect } from "next/navigation";
import { TicketPagination } from "@/components/ticket-pagination";

interface Params {
  searchParams: Promise<{
    page: number;
    limit: number;
  }>;
}

export default async function TicketsPage({ searchParams }: Params) {
  // Envia params de url
  const page = Number((await searchParams)?.page || 1);
  const limit = Number((await searchParams)?.limit || 3);

  const { tickets, totalPages } = await getTickets({ page, limit });

  // Si la pagina actual no tiene tickets y no es la primera, redirige a la ultima pagina valida
  if (tickets.length === 0 && page > 1) {
    redirect(`/tickets?page=${totalPages}&limit=${limit}`);
  }

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

      <div>
        <TicketPagination
          currentPage={page}
          totalPages={totalPages}
          limit={limit}
        />
      </div>
    </div>
  );
}
