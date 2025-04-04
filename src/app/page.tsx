import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl md:text-9xl font-bold">Fintrack</h1>
      <p className="mx-8 text-center text-base md:text-lg text-muted-foreground mt-4">Take Control of Your Finances - Track, Save, and Grow!</p>
      <Link href="/sign-in" className="mt-8">
        <Button className="md:py-6 md:px-7 md:text-base">Get Started</Button>
      </Link>
    </div>
  );
}
