import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Join Creature",
};

const appearance = {
  variables: {
    colorBackground: "#CBDEE1",
    colorPrimary: "#F79E1B",
    colorText: "#000000",
    colorInputBackground: "transparent",
    colorInputText: "#1a1a1a",
    fontFamily: '"Inconsolata", "Courier New", monospace',
    borderRadius: "0px",
  },
  elements: {
    card: "shadow-none border border-black",
    headerTitle: "font-ligconsolata",
    headerSubtitle: "font-ligconsolata",
    formButtonPrimary:
      "bg-[#D79E2D] text-black font-ligconsolata shadow-[0px_4px_4px_rgba(0,0,0,0.25)] hover:opacity-80 hover:bg-[#D79E2D]",
    footerActionLink: "text-black underline",
  },
};

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#CBDEE1]">
      <div className="flex flex-col items-center gap-6">
        <span className="font-rubik-beastly text-[40px] leading-none text-[#F79E1B]">
          C
        </span>
        <SignUp appearance={appearance} />
      </div>
    </div>
  );
}
