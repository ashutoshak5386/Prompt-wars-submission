"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

/**
 * Custom hook — maintains a persistent Socket.io connection to the backend
 * and provides the latest simulation snapshot + alerts.
 */
export function useSocket() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("simulation:update", (payload) => {
      setData(payload);
      if (payload.latestAlert) {
        setAlerts((prev) => {
          if (prev[0]?.id === payload.latestAlert.id) return prev;
          return [payload.latestAlert, ...prev].slice(0, 30);
        });
      }
    });

    socket.on("alert:new", (alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 30));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const emit = useCallback((event, payload) => {
    if (socketRef.current) socketRef.current.emit(event, payload);
  }, []);

  return { connected, data, alerts, emit };
}
