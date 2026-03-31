import Link from "next/link";
import { signIn } from "@/app/actions/auth";

export default function SignInPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#CBDEE1]">
      <div className="flex w-full max-w-sm flex-col gap-8 px-8">
        <div className="flex flex-col gap-2">
          <span className="font-rubik-beastly text-[40px] leading-none text-[#F79E1B]">C</span>
          <h1 className="font-shippori-mincho text-[32px] leading-[1.3em] font-normal text-black">
            Welcome back
          </h1>
        </div>

        <form action={signIn} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-ligconsolata text-[14px] text-[#686868]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="font-ligconsolata border border-black bg-transparent px-4 py-3 text-[15px] outline-none focus:ring-1 focus:ring-black"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-ligconsolata text-[14px] text-[#686868]" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="font-ligconsolata border border-black bg-transparent px-4 py-3 text-[15px] outline-none focus:ring-1 focus:ring-black"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="font-ligconsolata mt-2 bg-[#D79E2D] px-6 py-3 text-[16px] font-normal text-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-80"
          >
            Sign in
          </button>
        </form>

        <p className="font-ligconsolata text-[14px] text-[#686868]">
          Don&rsquo;t have an account?{" "}
          <Link href="/sign-up" className="text-black underline">
            Get started
          </Link>
        </p>
      </div>
    </div>
  );
}
