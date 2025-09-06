import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function InstallPrompt({ hiddenOnPaths = [] }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (hiddenOnPaths.includes(loc.pathname) || !canInstall) return null;

  return (
    <button
      className="rounded-lg bg-emerald-500 px-3 py-1 text-sm text-white"
      onClick={async () => {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        setCanInstall(false);
      }}
    >
      Install App
    </button>
  );
}
