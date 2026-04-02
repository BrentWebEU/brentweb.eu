'use client';

import { useState, useEffect, memo, useRef } from "react";
import { Activity, Wifi, WifiOff, Server, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface NetworkRequest {
  id: string;
  url: string;
  method: string;
  status: number;
  timestamp: Date;
  size: number;
}

const simulatedEndpoints = [
  { url: "/api/v1/projects", method: "GET", status: 200, size: 15234 },
  { url: "/api/v1/user/profile", method: "GET", status: 200, size: 3421 },
  { url: "/api/v1/analytics", method: "POST", status: 201, size: 512 },
  { url: "/api/v1/contact", method: "POST", status: 200, size: 128 },
  { url: "/api/v1/security/scan", method: "GET", status: 200, size: 8921 },
  { url: "/api/v1/network/status", method: "GET", status: 200, size: 256 },
  { url: "/api/v1/logs", method: "GET", status: 200, size: 15678 },
  { url: "/api/v1/metrics", method: "GET", status: 200, size: 4321 },
  { url: "/api/v1/auth/verify", method: "POST", status: 200, size: 64 },
  { url: "/api/v1/cache/clear", method: "DELETE", status: 204, size: 0 },
  { url: "/api/v1/database/query", method: "POST", status: 200, size: 5678 },
  { url: "/api/v1/files/upload", method: "POST", status: 201, size: 12345 },
  { url: "/api/v1/health", method: "GET", status: 200, size: 128 },
  { url: "/api/v1/config", method: "GET", status: 200, size: 2345 },
  { url: "/api/v1/notifications", method: "GET", status: 200, size: 3456 },
  { url: "/api/v1/exploration/complete", method: "POST", status: 200, size: 256, special: true },
  { url: "/api/v1/easter/ack", method: "GET", status: 200, size: 42, special: true },
];

export const NetworkMonitor = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [requests, setRequests] = useState<NetworkRequest[]>([]);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSimulating, setIsSimulating] = useState(true);
  const requestCountRef = useRef(0);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const generateSimulatedRequest = () => {
      const isSpecial = Math.random() < 0.1;
      let endpoint;
      
      if (isSpecial) {
        const specialEndpoints = simulatedEndpoints.filter(e => e.special);
        endpoint = specialEndpoints[Math.floor(Math.random() * specialEndpoints.length)];
      } else {
        const regularEndpoints = simulatedEndpoints.filter(e => !e.special);
        endpoint = regularEndpoints[Math.floor(Math.random() * regularEndpoints.length)];
      }
      
      const variation = Math.random();
      
      let status = endpoint.status;
      if (variation > 0.9 && !endpoint.special) {
        status = Math.random() > 0.5 ? 404 : 500;
      }
      
      const sizeVariation = endpoint.special ? 1 : (0.8 + Math.random() * 0.4);
      const size = Math.floor(endpoint.size * sizeVariation);

      const newRequest: NetworkRequest = {
        id: `req-${requestCountRef.current++}`,
        url: endpoint.url,
        method: endpoint.method,
        status,
        timestamp: new Date(),
        size,
      };

      setRequests((prev) => [newRequest, ...prev].slice(0, 50)); 
    };
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    globalThis.addEventListener("online", handleOnline);
    globalThis.addEventListener("offline", handleOffline);

    const originalFetch = globalThis.fetch;
    globalThis.fetch = async (...args) => {
      const startTime = Date.now();
      const response = await originalFetch(...args);
      const endTime = Date.now();

      const url = args[0]?.toString() || "";
      const method = (args[1]?.method || "GET").toUpperCase();
      const status = response.status;
      const size = parseInt(response.headers.get("content-length") || "0", 10);

      const newRequest: NetworkRequest = {
        id: `req-${requestCountRef.current++}`,
        url: url.length > 50 ? url.substring(0, 50) + "..." : url,
        method,
        status,
        timestamp: new Date(),
        size,
      };

      setRequests((prev) => [newRequest, ...prev].slice(0, 50));

      return response;
    };

    const startSimulation = () => {
      if (isSimulating) {
        for (let i = 0; i < 5; i++) {
          setTimeout(() => generateSimulatedRequest(), i * 200);
        }

        simulationIntervalRef.current = setInterval(() => {
          generateSimulatedRequest();
        }, 2000 + Math.random() * 3000);
      }
    };

    startSimulation();

    return () => {
      globalThis.removeEventListener("online", handleOnline);
      globalThis.removeEventListener("offline", handleOffline);
      globalThis.fetch = originalFetch;
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
    };
  }, [isSimulating, isOnline]);

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "network-monitor__request-method--success";
    if (status >= 300 && status < 400) return "network-monitor__request-method--redirect";
    if (status >= 400) return "network-monitor__request-method--error";
    return "";
  };

  const getStatusColorClass = (status: number) => {
    if (status >= 200 && status < 300) return "network-monitor__request-status--success";
    if (status >= 300 && status < 400) return "network-monitor__request-status--redirect";
    if (status >= 400) return "network-monitor__request-status--error";
    return "";
  };

  const isSpecialRequest = (url: string) => {
    return url.includes("/exploration/") || url.includes("/easter/");
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="network-monitor-toggle"
        aria-label="Open network monitor"
      >
        <Activity className="network-monitor-toggle-icon" />
        {requests.length > 0 && (
          <span className="network-monitor-toggle-badge">
            {requests.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="network-monitor">
      <div className="network-monitor__header">
        <div className="network-monitor__header-left">
          <Activity className="network-monitor__header-icon" />
          <span className="network-monitor__header-title">Network Monitor</span>
          <div className="network-monitor__header-status">
            {isOnline ? (
              <Wifi className={cn("network-monitor__header-status-icon", "network-monitor__header-status-icon--online")} />
            ) : (
              <WifiOff className={cn("network-monitor__header-status-icon", "network-monitor__header-status-icon--offline")} />
            )}
            <span className="network-monitor__header-status-text">
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
        <div className="network-monitor__header-actions">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="network-monitor__header-button"
            aria-label={isSimulating ? "Pause simulation" : "Start simulation"}
            title={isSimulating ? "Pause simulation" : "Start simulation"}
          >
            {isSimulating ? (
              <Pause className="network-monitor__header-button-icon" />
            ) : (
              <Play className="network-monitor__header-button-icon" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="network-monitor__header-close"
            aria-label="Close network monitor"
          >
            ×
          </button>
        </div>
      </div>

      <div className="network-monitor__requests">
        {requests.length === 0 ? (
          <div className="network-monitor__empty">
            <Server className="network-monitor__empty-icon" />
            <p>No network requests yet</p>
            <p className="network-monitor__empty-text">Requests will appear here as you navigate</p>
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="network-monitor__request"
            >
              <div className="network-monitor__request-header">
                <span className={cn("network-monitor__request-method", getStatusColor(req.status))}>
                  {req.method}
                </span>
                <span className="network-monitor__request-timestamp">
                  {req.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className={cn(
                "network-monitor__request-url",
                isSpecialRequest(req.url) && "network-monitor__request-url--special"
              )}>
                {req.url}
              </div>
              <div className="network-monitor__request-footer">
                <span className={cn("network-monitor__request-status", getStatusColorClass(req.status))}>
                  Status: {req.status}
                </span>
                {req.size > 0 && (
                  <span className="network-monitor__request-size">{formatSize(req.size)}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="network-monitor__footer">
        <span>Total requests: {requests.length}</span>
        <span className="network-monitor__footer-status">
          {isSimulating ? (
            <>
              <span className="network-monitor__footer-dot" />
              Simulating
            </>
          ) : (
            "Paused"
          )}
        </span>
      </div>
    </div>
  );
});
