import { Sidebar } from "./Sidebar";
import { Outlet } from "@tanstack/react-router";

export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
