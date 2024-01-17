import Link from "next/link";
import { getServerSession } from "next-auth";
import { LogIn } from "lucide-react";

import { AppDescription } from "@/components/appDescription";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { options } from "./api/auth/[...nextauth]/options";

const Homepage = async () => {
  const session = await getServerSession(options);

  return (
    <div className="flex flex-col items-center justify-center">
      {session ? (
        <Card className="md:w-1/2">
          <CardHeader>
            <CardTitle>How to start</CardTitle>
            <CardDescription>
              Tips that can help you understand gym-app better.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppDescription />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Gym App!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Application created for those who want to make creating
                  training plans and monitoring results easier. It is intended
                  not only for personal trainers and their clients but also for
                  the ones who want to build their own plans and track progress
                  individually.
                </p>
                <p>Do not hesitate! Start your Gym Driven Development today!</p>
              </CardContent>
            </Card>
          </section>
          <section className="flex flex-col items-center gap-4">
            <Card className="w-80 flex justify-center px-1">
              <Link
                href="/api/auth/signin"
                className="w-full flex p-3 justify-center gap-2 mx-0 my-1 rounded-md hover:bg-muted"
              >
                <LogIn />
                Sign in
              </Link>
            </Card>
          </section>
        </div>
      )}
    </div>
  );
};

export default Homepage;
