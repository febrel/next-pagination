"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTicket, updateTicket } from "@/app/tickets/tickets.api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Ticket, TicketStatus } from "@/app/tickets/tickets.interface";

interface Inputs {
  title: string;
  assigneer: string;
  status: TicketStatus;
  description: string;
}

export const TicketForm = ({ ticket }: { ticket?: Ticket }) => {
  const router = useRouter();

  const { register, handleSubmit, control } = useForm<Inputs>({
    // Para capturar edit
    defaultValues: {
      title: ticket?.title || "",
      assigneer: ticket?.assigneer || "",
      status: ticket?.status || "TODO",
      description: ticket?.description || "",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      let response: any;

      if (ticket?.id) {
        response = await updateTicket(ticket.id, {
          assigneer: data.assigneer,
          description: data.description,
          title: data.title,
          status: data.status,
        });

        toast.success(response.message);
        router.push("/tickets");
      } else {
        response = await createTicket({
          assigneer: data.assigneer,
          description: data.description,
          title: data.title,
          status: data.status,
        });

        toast.success(response.message);
        router.push("/tickets");
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Label className="block mb-2" htmlFor="title">
          Title
        </Label>
        <Input {...register("title", { required: true })} id="title" />
      </div>

      <div>
        <Label className="block mb-2" htmlFor="assigned">
          Assigned to
        </Label>
        <Input {...register("assigneer", { required: true })} id="assigned" />
      </div>

      <div>
        <Label className="block mb-2" htmlFor="status">
          Status
        </Label>
        <Controller
          name="status"
          control={control}
          defaultValue="TODO"
          rules={{ required: true }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-[100%]">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="TODO">To do</SelectItem>
                  <SelectItem value="IN_PROGRESS">In progresds</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label className="block mb-2" htmlFor="description">
          Description
        </Label>

        <Textarea
          {...register("description", { required: true })}
          id="description"
        />
      </div>

      <div className="flex justify-between gap-4">
        <Button type="submit">
          {ticket?.id ? "Edit ticket" : "Create ticket"}
        </Button>
        <Button variant={"secondary"}>
          <Link href={"/tickets"}>Back</Link>
        </Button>
      </div>
    </form>
  );
};
