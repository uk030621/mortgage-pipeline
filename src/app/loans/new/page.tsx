import Sidebar from "@/components/Sidebar";
import LoanForm from "@/components/LoanForm";

export default function NewLoanPage() {
  return (
    <div className="md:flex md:min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 md:px-8 py-6 md:py-8">
        <h1 className="font-display text-2xl text-ink mb-1">New mortgage</h1>
        <p className="text-sm text-slate mb-8">
          Add a borrower and start tracking their mortgage through the pipeline.
        </p>
        <LoanForm />
      </main>
    </div>
  );
}
