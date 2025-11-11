"use client";

import { usePathname } from "next/navigation";
import Header from "../header/header"; 

import FooterForm from "../footer/page"; 
import React from "react";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && <FooterForm />}
    </>
  );
}
