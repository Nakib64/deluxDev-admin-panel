import { Navbar } from "@/app/components/Navbar";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-zinc-900 dark:text-zinc-100">
            Manage Your Content <br className="hidden sm:inline" />
            <span className="text-primary">With Ease</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Welcome to your Admin Panel. Control your Portfolios, Blogs, and Reviews from a single, centralized dashboard.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/portfolios">
              <Button size="lg" className="h-12 px-8 text-lg">
                Manage Portfolios
              </Button>
            </Link>
            <Link href="/blogs">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                Manage Blogs
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        Admin Panel &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
