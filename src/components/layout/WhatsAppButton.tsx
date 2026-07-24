"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const WHATSAPP_URL = "https://chat.whatsapp.com/Grgq9kMhyWqEPmjb0qkpe3?s=sh&p=i&mlu=4&amv=2";

export function WhatsAppButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return null;

  if (!session) {
    return (
      <button
        type="button"
        aria-label="Join community chat on WhatsApp — log in required"
        onClick={() =>
          toast.error("Log in to join our WhatsApp community.", {
            action: {
              label: "Log in",
              onClick: () => router.push("/login?callbackUrl=/"),
            },
          })
        }
        className="group fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        <WhatsAppIcon className="h-7 w-7" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300 group-hover:max-w-40 group-hover:pr-1">
          Join community chat
        </span>
      </button>
    );
  }

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join community chat on WhatsApp"
      className="group animate-whatsapp-pop fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium transition-all duration-300 group-hover:max-w-40 group-hover:pr-1">
        Join community chat
      </span>
    </a>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.04 2c-5.523 0-10 4.477-10 10 0 1.763.46 3.489 1.334 5.008L2 22l5.121-1.343A9.958 9.958 0 0 0 12.04 22c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.166a8.128 8.128 0 0 1-4.146-1.137l-.297-.176-3.038.797.812-2.96-.194-.304a8.128 8.128 0 0 1-1.253-4.386c0-4.501 3.665-8.166 8.166-8.166 4.502 0 8.167 3.665 8.167 8.166 0 4.502-3.665 8.166-8.167 8.166z" />
    </svg>
  );
}
