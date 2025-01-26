// app/dashboard/layout.tsx
'use client';

import NavBar from "../components/NavBar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <NavBar></NavBar>
      <div>{children}</div>
    </section>
  );
}
