"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import UnauthorizedComponent from "@/components/UnauthorizedComponent";
import Header from "@/components/header";
import { useSession } from "next-auth/react";
import SpinnerComponent from '@/components/SpinnerComponent';

export default function Page() {
  const { data: session, status } = useSession()
    
    if (status === "authenticated" && session?.roles.includes("admin")) {
      return (
        <>
        <Header />
        <div style={{ textAlign: "center" }}>You're an admin if you're seeing this.</div>
        </>
    )}

    if (status === "unauthenticated") {
      return (
        <UnauthorizedComponent />
      )
    }

    if (status === "authenticated" && session?.roles.includes("user")) {
      return (
        <>
        <Header />
        <UnauthorizedComponent />
        </>
    )}

    if (status === "loading") {
      return (
        <SpinnerComponent />
      )
    }
}