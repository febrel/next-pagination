"use client";

import { Ticket, TicketStatus } from "@/app/tickets/tickets.interface";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { Button } from "@/components/ui/button";
import { LucideTrash } from "lucide-react";
import { deleteTicket } from "@/app/tickets/tickets.api";
import { revalidate } from "@/lib/actions";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MouseEvent } from "react";

const TICKET_STATUS_VARIANTS = {
  TODO: "default",
  IN_PROGRESS: "secondary",
  REJECTED: "destructive",
  DONE: "success",
} as const;

const getStatusVariant = (
  status: TicketStatus,
): "default" | "secondary" | "destructive" | "outline" | "success" => {
  return TICKET_STATUS_VARIANTS[status];
};

const getStatusName = (status: TicketStatus) => {
  const names = {
    TODO: "To do",
    IN_PROGRESS: "In progress",
    REJECTED: "Rejected",
    DONE: "Done",
  };

  return names[status] ?? "unknown";
};

export function TicketCard({ ticket }: { ticket: Ticket }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Delete
  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      await deleteTicket(ticket.id);
      await revalidate("/tickets");
      router.replace(`/tickets?${searchParams.toString()}`);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Link href={`/tickets/${ticket.id}/edit`}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {ticket.title}
            <Button
              onClick={(e) => handleDelete(e)}
              size="sm"
              variant="outline"
            >
              <LucideTrash />
            </Button>
          </CardTitle>
          <CardDescription>
            {ticket.description || "No description."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant={getStatusVariant(ticket.status)}>
            {getStatusName(ticket.status)}
          </Badge>
        </CardContent>
        <CardFooter>
          <p className="font-bold">Assigned to: {ticket.assigneer}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
