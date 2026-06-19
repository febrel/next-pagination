export type TicketStatus = "TODO" | "IN_PROGRESS" | "DONE" | "REJECTED";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  assigneer?: string;
}

export type TicketForm = Omit<Ticket, "id">;
