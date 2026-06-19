import { TicketForm } from "@/components/ticket-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTarget } from "@base-ui/react/internals/shadowDom";
import { getTicket } from "../../tickets.api";
import { Ticket } from "../../tickets.interface";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTicket({ params }: Params) {
  const id = (await params)?.id;

  let data: { ticket: Ticket } | undefined;

  if (id) {
    data = await getTicket(id);
  }
  return (
    <div className="max-w-[400px] w-full p-8 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-bold"> Edit ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <TicketForm ticket={data?.ticket} />
        </CardContent>
      </Card>
    </div>
  );
}
