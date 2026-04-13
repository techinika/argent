import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <span className="text-8xl font-bold text-zinc-200 dark:text-zinc-800">
          404
        </span>
      </div>
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
        Page Not Found
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
        <Link href="/personal">
          <Button variant="outline">Personal Finance</Button>
        </Link>
        <Link href="/business">
          <Button variant="outline">Business Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
