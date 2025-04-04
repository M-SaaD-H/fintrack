import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className=" text-9xl font-bold">Fintrack</h1>
      <p className="text-lg text-muted-foreground mt-2">Take Control of Your Finances - Track, Save, and Grow!</p>
      <Link href="/sign-in" className="mt-8">
        <Button className="py-6 px-7 text-base">Get Started</Button>
      </Link>
    </div>
  );
}
