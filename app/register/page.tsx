"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";

interface Inputs {
  name: string;
  user: string;
  email: string;
  password: string;
}

export default function Register() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (!response.ok) {
        const msg = Array.isArray(json.error)
          ? json.error[0]?.message || "Error registering"
          : json.error || "Error registering";
        toast.error(msg);
        return;
      }

      toast.success("Registered successfully! Please login.");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div>
              <Label className="block mb-2" htmlFor="name">
                Name
              </Label>
              <Input
                {...register("name", { required: true })}
                id="name"
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label className="block mb-2" htmlFor="user">
                User
              </Label>
              <Input
                {...register("user", { required: true })}
                id="user"
                placeholder="john"
              />
            </div>

            <div>
              <Label className="block mb-2" htmlFor="email">
                Email
              </Label>
              <Input
                {...register("email", { required: true })}
                id="email"
                type="email"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <Label className="block mb-2" htmlFor="password">
                Password
              </Label>
              <Input
                {...register("password", { required: true })}
                id="password"
                type="password"
                placeholder="******"
              />
            </div>

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>

          <p className="text-sm text-center mt-4 text-muted-foreground">
            Already have an account?{" "}
            <Link href="/" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
