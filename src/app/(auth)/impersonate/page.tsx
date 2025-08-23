// app/auth/impersonate/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function ImpersonateHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleImpersonation = async () => {
      const token = searchParams.get("token");

      if (token) {
        try {
          const result = await signIn("credentials", {
            impersonationToken: token,
            redirect: false,
          });

          if (result?.error) {
            console.error("Impersonation failed:", result.error);
            router.push("/auth/signin?error=ImpersonationFailed");
          } else {
            router.push("/tutor/problemmng/repository");
          }
        } catch (error) {
          console.error("Error during impersonation:", error);
          router.push("/auth/signin?error=ImpersonationError");
        }
      } else {
        console.error("No impersonation token provided");
        router.push("/auth/signin?error=NoToken");
      }
    };

    handleImpersonation();
  }, [router, searchParams]);

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <Loader2 className="w-10 h-10 animate-spin" />
    </div>
  );
}
