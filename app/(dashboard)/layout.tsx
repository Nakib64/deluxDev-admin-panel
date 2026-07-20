import Sidebar from "@/app/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#F0F4F8] dark:bg-zinc-950 p-4 md:p-6 flex flex-col md:flex-row gap-6">
            {/* Sidebar Floating Container */}
            <div className="hidden md:flex w-72 flex-col shrink-0 h-[calc(100vh-3rem)] sticky top-6">
                <Sidebar />
            </div>
            
            {/* Main Content Floating Card (Wraps all dashboard pages) */}
            <main className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-[24px] shadow-sm p-6 md:p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
