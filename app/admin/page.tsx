import { AdminDashboard } from "@/components/admin-dashboard"
import { AdminHeader } from "@/components/admin-header"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </main>
    </div>
  )
}
