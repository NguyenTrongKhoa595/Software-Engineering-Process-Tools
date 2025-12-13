// pages/index.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/login"); // redirect to the new login page
  }, [router]);

  return null; // or a loading spinner if you want
}
