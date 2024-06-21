"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  username: z.string().max(64),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export function SignUpForm() {
  const [step, setStep] = useState(1);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch("/api/v1/auth/sign-up", {
      body: JSON.stringify(values),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {step === 1 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Welcome to chirp!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="frolleks" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button onClick={nextStep} className="w-full">
                  Next
                </Button>
              </div>
            </CardContent>

            <CardFooter>
              <p className="text-sm">
                Have an existing account?{" "}
                <Link href="/sign-in" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Enter your email and password.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="frolleks@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your password..."
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Password must have a minimum of 8 characters.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <div className="flex gap-1.5">
                  <Button onClick={prevStep} className="w-full">
                    Back
                  </Button>
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm">
                Have an existing account?{" "}
                <Link href="/sign-in" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        )}
      </form>
    </Form>
  );
}
