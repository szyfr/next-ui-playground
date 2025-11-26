import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to our Next.js application",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Hello World!</h1>
        <Button>Click me</Button>
      </div>
    </main>
  );
}
