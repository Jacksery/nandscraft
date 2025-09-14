"use client";
import Image from "next/image";
import ChickenJockeyImage from "@/public/images/chicken-jockey.jpg";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export function HeroSection() {
  const serverAddress = "mc.nandscraft.com";
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState<boolean | undefined>(undefined);
  const [retrievedAt, setRetrievedAt] = useState<number | undefined>(undefined);
  const [expiresAt, setExpiresAt] = useState<number | undefined>(undefined);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    const fetchStatus = () => {
      fetch("https://api.mcstatus.io/v2/status/java/mc.nandscraft.com")
        .then((res) => res.json())
        .then((data) => {
          setOnline(data.online);
          setRetrievedAt(data.retrieved_at);
          setExpiresAt(data.expires_at);
          // Calculate ms until cache expires, fallback to 10s
          const now = Date.now();
          const pollMs =
            data.expires_at && now
              ? Math.max(data.expires_at - now, 1000)
              : 10000;
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(fetchStatus, pollMs);
        })
        .catch(() => {
          setOnline(undefined);
          setRetrievedAt(undefined);
          setExpiresAt(undefined);
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(fetchStatus, 10000);
        });
    };

    fetchStatus();
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const copyServerAddress = () => {
    navigator.clipboard.writeText(serverAddress);
    toast.success("Server address copied to clipboard!");
  };

  async function handleDownload() {
    setLoading(true);
    window.location.href =
      "https://zi84ql62iiexyfrs.public.blob.vercel-storage.com/NandsCraft-0.0.1.zip";
    setLoading(false);
  }

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={ChickenJockeyImage}
          alt="Chicken Jockey"
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <div className="flex justify-center mb-4">
          <Badge
            variant="secondary"
            className="bg-white/20 text-white border-white/30 flex items-center gap-2"
          >
            {/* Online indicator dot */}
            <span
              className={
                "inline-block w-2 h-2 rounded-full " +
                (online === undefined
                  ? "bg-gray-400"
                  : online
                    ? "bg-green-500"
                    : "bg-red-500")
              }
            />
            NeoForge 1.21.1
          </Badge>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
          NandsCraft
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto"></p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            type="button"
            onClick={copyServerAddress}
            className="flex items-center bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Copy server address"
          >
            <code className="text-lg font-mono mr-3">{serverAddress}</code>
            <Copy className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90"
            onClick={handleDownload}
            disabled={loading}
          >
            {loading ? "Downloading..." : "Download Modpack"}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
