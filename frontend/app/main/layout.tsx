// app/dashboard/layout.tsx
import FileSystemDrawer from "../components/FileSystem/FileSystemDrawer";
import NavBar from "../components/NavBar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <NavBar></NavBar>
      <FileSystemDrawer></FileSystemDrawer>
      <div>{children}</div>
    </section>
  );
}
