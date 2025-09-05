import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Math Flow</h1>
      <p className="text-lg text-gray-500 mb-2">
        A simple and easy to use math flowchart builder
      </p>
      <Link href="/chat">
        <Button>Get Started</Button>
      </Link>
    </div>
  );
}
