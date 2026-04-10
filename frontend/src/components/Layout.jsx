import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { BsLayoutTextSidebar } from "react-icons/bs";
import { FaRegHandPointLeft } from "react-icons/fa";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Overlay (click anywhere to close) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/*  Sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/*  Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {/*  Mobile Menu Icon */}
        <div className="md:hidden mb-4">
          <div className="flex items-center gap-2  m-2 p-2">
            <button
            onClick={() => setOpen(true)}
            className="text-2xl p-2 rounded-lg bg-white shadow"
          >
            <BsLayoutTextSidebar />
          </button>
          <div className="flex items-center gap-2">
            <FaRegHandPointLeft size={22} />
          <h1 className="font-semibold text-lg pr-6">Click <span className="text-red-500">here</span></h1>
          </div>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
