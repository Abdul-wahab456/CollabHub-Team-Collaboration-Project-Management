// "use client";
// import { useEffect, useRef, useState, useCallback } from "react";
// import { io, Socket } from "socket.io-client";

// type Message = {
//   id: string | number;
//   content: string;
//   sender: { id: number; name: string; avatar?: string };
//   createdAt: string;
// };

// export function useChatSocket(projectId: number) {
//   const socketRef = useRef<Socket | null>(null);
//   const [connectedUserId, setConnectedUserId] = useState<number | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [typingUsers, setTypingUsers] = useState<Record<number, boolean>>({});
//   const [onlineUsers, setOnlineUsers] = useState<Record<number, boolean>>({});

//   useEffect(() => {
//     const token =
//       typeof window !== "undefined"
//         ? localStorage.getItem("access_token")
//         : null;
//     if (!token) return;
//     const socket = io(`${process.env.NEXT_PUBLIC_API_WS_URL || ""}/chat`, {
//       auth: { token },
//       transports: ["websocket"],
//     });

//     socketRef.current = socket;

//     socket.on("connect", () => {
//       // join room
//       socket.emit("join", { projectId });
//     });

//     socket.on("connected", (payload: { userId: number }) => {
//       setConnectedUserId(payload.userId);
//     });

//     socket.on("history", (msgs: Message[]) => {
//       setMessages(msgs);
//     });

//     socket.on("message", (msg: Message) => {
//       setMessages((s) => [...s, msg]);
//     });

//     socket.on(
//       "typing",
//       ({ userId, typing }: { userId: number; typing: boolean }) => {
//         setTypingUsers((t) => ({ ...t, [userId]: typing }));
//       }
//     );

//     socket.on("user:online", ({ userId }: { userId: number }) => {
//       setOnlineUsers((o) => ({ ...o, [userId]: true }));
//     });
//     socket.on("user:offline", ({ userId }: { userId: number }) => {
//       setOnlineUsers((o) => {
//         const copy = { ...o };
//         delete copy[userId];
//         return copy;
//       });
//     });

//     return () => {
//       socket.emit("leave", { projectId });
//       socket.disconnect();
//       socketRef.current = null;
//     };
//   }, [projectId]);

//   const sendMessage = useCallback(
//     (content: string) => {
//       const s = socketRef.current;
//       if (!s) return;
//       s.emit("message", { content, projectId });
//     },
//     [projectId]
//   );

//   const setTyping = useCallback(
//     (typing: boolean) => {
//       const s = socketRef.current;
//       if (!s) return;
//       s.emit("typing", { projectId, typing });
//     },
//     [projectId]
//   );

//   const markRead = useCallback(
//     (messageId: number) => {
//       socketRef.current?.emit("read", { messageId, projectId });
//     },
//     [projectId]
//   );

//   return {
//     connectedUserId,
//     messages,
//     typingUsers,
//     onlineUsers,
//     sendMessage,
//     setTyping,
//     markRead,
//   };
// }
