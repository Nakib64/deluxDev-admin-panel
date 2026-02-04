export default function DashboardPage() {
    return (
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground mt-2">Welcome to the Admin Panel of your Portfolio.</p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
                {/* Placeholder cards */}
                <div className="p-6 bg-white dark:bg-black border rounded-xl shadow-sm">
                    <h3 className="font-semibold text-sm">Total Portfolios</h3>
                    <p className="text-2xl font-bold mt-2">-</p>
                </div>
                <div className="p-6 bg-white dark:bg-black border rounded-xl shadow-sm">
                    <h3 className="font-semibold text-sm">Total Blogs</h3>
                    <p className="text-2xl font-bold mt-2">-</p>
                </div>
                <div className="p-6 bg-white dark:bg-black border rounded-xl shadow-sm">
                    <h3 className="font-semibold text-sm">Total Reviews</h3>
                    <p className="text-2xl font-bold mt-2">-</p>
                </div>
            </div>
        </div>
    );
}
