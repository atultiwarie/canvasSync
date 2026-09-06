import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "../features/auth/auth.store";
import { API_BASE_URL } from "./config";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket?.connected) return socket;

  const token = useAuthStore.getState().accessToken;

  socket = io(API_BASE_URL, {
    auth: { token },
    autoConnect: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect_error", async (err) => {
    if (err.message.includes("Unauthorized")) {
      try {
        const { authService } = await import("../features/auth/auth.service");
        const refreshed = await authService.silentRefresh();
        if (refreshed && socket) {
          const newToken = useAuthStore.getState().accessToken;
          socket.auth = { token: newToken };
          socket.connect();
        }
      } catch {
        // Silent refresh failed
      }
    }
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
