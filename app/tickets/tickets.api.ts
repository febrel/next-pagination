import { Ticket, TicketForm } from "./tickets.interface";
const URL = process.env.NEXT_PUBLIC_API_URL;

export const getTickets = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<{
  tickets: Ticket[];
  totalPages: number;
}> => {
  try {
    const response = await fetch(`${URL}/tickets?page=${page}&limit=${limit}`);
    const data = await response.json();
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const createTicket = async (
  ticket: TicketForm,
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${URL}/tickets`, {
      body: JSON.stringify(ticket),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al crear el ticket");
    }

    return data;
  } catch (err: any) {
    throw new Error(err.message || err);
  }
};

export const deleteTicket = async (
  id: string,
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${URL}/tickets/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error);
    }
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const updateTicket = async (id: string, ticket: TicketForm) => {
  try {
    const response = await fetch(`${URL}/tickets/${id}`, {
      body: JSON.stringify(ticket),
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = response.json();
    // if (!response.ok) {
    //   throw new Error(data.error);
    // }

    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

export const getTicket = async (id: string): Promise<{ ticket: Ticket }> => {
  try {
    const response = await fetch(`${URL}/tickets/${id}`);
    const data = await response.json();
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};
