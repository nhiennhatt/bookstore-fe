import { Footer } from "@/components/commons/Footer";
import { AppNavbar } from "@/modules/consumer/AppNavbar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <AppNavbar />
      {children}
      <Footer />
    </div>
  );
}
