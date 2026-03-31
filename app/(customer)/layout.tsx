import { AppNavbar } from "@/modules/customer/AppNavbar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNavbar />
      {children}
    </>
  );
}
