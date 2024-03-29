import Link from "next/link";
import { getServerSession } from "next-auth";
import { GithubIcon, LogIn, UserPlus } from "lucide-react";

import { AppDescription } from "@/components/appDescription";
import { GoogleIcon } from "@/components/customIcons/googleIcon";
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
        <Card className="max-w-5xl">
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
            <Card className="max-w-5xl">
              <CardHeader>
                <CardTitle>Welcome to Gym App!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Are you bored of those inflexible Excel sheets when preparing
                  a training schedule for your client? Worry no more, because
                  you have the Gym-app. It is intended not only for personal
                  trainers and their clients but also for the ones who want to
                  build their own plans and track progress individually.
                </p>
                <p>Do not hesitate! Start your journey with Gym-app today!</p>
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
                Sign in <GoogleIcon /> <GithubIcon />
              </Link>
            </Card>
            Or
            <Card className="w-80 flex justify-center px-1">
              <Link
                href="signup"
                className="w-full flex p-3 justify-center gap-2 mx-0 my-1 rounded-md hover:bg-muted"
              >
                <UserPlus />
                Sign up
              </Link>
            </Card>
          </section>
        </div>
      )}
    </div>
  );
};

export default Homepage;
