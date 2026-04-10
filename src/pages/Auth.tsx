import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { lovable } from "@/integrations/lovable/index";
import areaLogo from "@/assets/aera-logo.svg";
import homeBg from "@/assets/home-bg.webp";

const Auth = () => {
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  const handleGoogleSignIn = async () => {
    setError("");
    // Persist chrome flow intent through OAuth redirect
    if (searchParams.get("flow") === "chrome") {
      sessionStorage.setItem("aera_flow", "chrome");
    }
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/auth`,
    });
    if (error) setError(error.message || "Google sign-in failed");
  };

  return (
    <div className="relative w-full mx-auto min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <img src={homeBg} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 max-w-[480px] mx-auto w-full">
        <img src={areaLogo} alt="Aera" className="h-8 mb-3" />
        <p
          className="font-body font-normal text-[#F7F6F5] mb-16"
          style={{ fontSize: "clamp(16px, 4.3vw, 18px)", lineHeight: 1.35 }}
        >
          Breathe. Recover. Perform.
        </p>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-white text-black font-body font-medium text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {error && (
          <p className="text-red-400 text-xs font-body text-center mt-4">{error}</p>
        )}

        <button
          onClick={() => window.location.href = "/wave"}
          className="mt-6 text-[#F7F6F5]/60 font-body text-sm underline underline-offset-4 hover:text-[#F7F6F5]/90 transition-colors"
        >
          Try without signing in
        </button>
      </div>
    </div>
  );
};

export default Auth;
