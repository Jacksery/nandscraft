"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, Zap, Info } from "lucide-react";
import { useState as useReactState } from "react";

type ApiResponse = {
  online: boolean;
  host: string;
  port: number;
  ip_address: string;
  retrieved_at: number;
  expires_at: number;
  srv_record?: {
    host: string;
    port: number;
  };
  version: {
    name_raw: string;
    name_clean: string;
    name_html: string;
    protocol: number;
  };
  players: {
    online: number;
    max: number;
    list?: {
      uuid: string;
      name_raw: string;
      name_clean: string;
      name_html: string;
    }[];
  };
  motd: {
    raw: string;
    clean: string;
    html: string;
  };
  // ...other fields omitted...
};

export function ServerStats() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;

    const fetchStatus = () => {
      fetch("https://api.mcstatus.io/v2/status/java/mc.nandscraft.com")
        .then((res) => res.json())
        .then((newData) => {
          setData(newData);
          setLoading(false);
          // Calculate ms until cache expires, fallback to 10s
          const now = Date.now();
          const pollMs =
            newData.expires_at && now
              ? Math.max(newData.expires_at - now, 1000)
              : 10000;
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(fetchStatus, pollMs);
        })
        .catch(() => {
          setData(null);
          setLoading(false);
          if (timeout) clearTimeout(timeout);
          timeout = setTimeout(fetchStatus, 10000);
        });
    };

    fetchStatus();
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const onlinePlayers = data?.players?.online ?? 0;
  const maxPlayers = data?.players?.max ?? "?";
  const playersCapacity =
    typeof maxPlayers === "number" && maxPlayers > 0
      ? `${Math.round((onlinePlayers / maxPlayers) * 100)}% capacity`
      : "";

  // Skeleton component for loading state
  const Skeleton = ({ width = "100%", height = "2rem" }) => (
    <div className="animate-pulse bg-muted rounded" style={{ width, height }} />
  );

  // Simple tooltip state for each card
  const [showInfo1, setShowInfo1] = useReactState(false);
  const [showInfo2, setShowInfo2] = useReactState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="relative min-h-[180px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-sm font-medium">
                Players Online
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
              {!loading && (
                <Badge
                  variant={
                    data?.online === undefined
                      ? "secondary"
                      : data.online
                        ? "default"
                        : "destructive"
                  }
                >
                  {data?.online === undefined
                    ? "UNKNOWN"
                    : data.online
                      ? "ONLINE"
                      : "OFFLINE"}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            {loading ? (
              <>
                <Skeleton width="60%" height="2.5rem" />
                <Skeleton width="40%" height="1rem" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {`${data?.players?.online ?? 0}/${data?.players?.max ?? "?"}`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {playersCapacity}
                </p>
              </>
            )}
          </CardContent>
          {/* Info icon absolutely positioned at bottom right */}
          {!loading && data?.retrieved_at && (
            <div
              className="absolute bottom-2 right-2 flex items-center"
              onMouseEnter={() => setShowInfo1(true)}
              onMouseLeave={() => setShowInfo1(false)}
              onClick={() => setShowInfo1((v) => !v)}
              style={{ cursor: "pointer" }}
            >
              <Info className="h-4 w-4 text-muted-foreground" />
              {showInfo1 && (
                <span className="ml-2 px-2 py-1 rounded bg-muted text-[10px] text-muted-foreground shadow absolute bottom-6 right-0 z-10">
                  Last updated:{" "}
                  {new Date(data.retrieved_at).toLocaleTimeString()}
                </span>
              )}
            </div>
          )}
        </Card>
        <Card className="relative min-h-[180px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-sm font-medium">
                Version & MOTD
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            {loading ? (
              <>
                <Skeleton width="50%" height="2.5rem" />
                <Skeleton width="80%" height="1rem" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {data?.version?.name_clean ?? "?"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {data?.motd?.clean ?? ""}
                </p>
              </>
            )}
          </CardContent>
          {/* Info icon absolutely positioned at bottom right */}
          {!loading && data?.retrieved_at && (
            <div
              className="absolute bottom-2 right-2 flex items-center"
              onMouseEnter={() => setShowInfo2(true)}
              onMouseLeave={() => setShowInfo2(false)}
              onClick={() => setShowInfo2((v) => !v)}
              style={{ cursor: "pointer" }}
            >
              <Info className="h-4 w-4 text-muted-foreground" />
              {showInfo2 && (
                <span className="ml-2 px-2 py-1 rounded bg-muted text-[10px] text-muted-foreground shadow absolute bottom-6 right-0 z-10">
                  Last updated:{" "}
                  {new Date(data.retrieved_at).toLocaleTimeString()}
                </span>
              )}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
