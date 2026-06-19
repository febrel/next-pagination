import { TicketForm } from "@/components/ticket-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "../tickets.interface";
import { getTicket } from "../tickets.api";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewTicket({ params }: Params) {
  return (
    <div className="max-w-[400px] w-full p-8 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">New ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketForm />
        </CardContent>
      </Card>
    </div>
  );
}
