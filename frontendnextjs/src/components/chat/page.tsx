// 'use client';
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { useChatSocket } from '../hooks/useChatSocket'; // adjust path
// type Message = { id: string; author: string; text: string };

// export default function Page({ params }: { params?: { projectId?: string } }) {
//   const router = useRouter();
//   const [ready, setReady] = useState(false);
//   const projectId = Number(params?.projectId || 1); // get projectId from route or default

//   useEffect(() => {
//     const token = localStorage.getItem('access_token');
//     if (!token) {
//       router.replace('/auth/login');
//     } else {
//       setReady(true);
//     }
//   }, [router]);

//   const { messages, sendMessage, typingUsers, onlineUsers } = useChatSocket(projectId);

//   const [text, setText] = useState('');

//   const send = () => {
//     const t = text.trim();
//     if (!t) return;
//     sendMessage(t);
//     setText('');
//   };

//   if (!ready) {
//     return (
//       <div className="p-8 flex items-center justify-center">
//         <p>Loading...</p>
//       </div>
//     );
//   }
//   return (
//     <div className="flex h-[calc(100vh-7rem)] flex-col gap-4">
//       <h1 className="text-balance text-2xl font-semibold">Chat</h1>
//       <div className="flex-1 overflow-hidden rounded-md border">
//         <div className="h-full overflow-auto p-4">
//           <ul className="space-y-3">
//             {messages.map((m: any) => (
//               <li
//                 key={m.id}
//                 className="max-w-[85%] rounded-md border bg-card p-3 text-sm"
//               >
//                 <div className="mb-1 text-xs font-medium text-muted-foreground">
//                   {m.sender?.name ?? m.author}
//                 </div>
//                 <div>{m.content ?? m.text}</div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       <div className="flex items-center gap-2">
//         <Input
//           placeholder="Type a message..."
//           value={text}
//           onChange={(e) => {
//             setText(e.target.value);
//             // notify typing
//             // you could throttle this to avoid spam
//             // call setTyping(true) and then false after timeout
//           }}
//           onKeyDown={(e) => e.key === 'Enter' && send()}
//           aria-label="Message input"
//         />
//         <Button onClick={send} aria-label="Send message">
//           Send
//         </Button>
//       </div>

//       <div className="text-xs text-muted-foreground p-2">
//         Typing: {Object.keys(typingUsers).filter((k) => typingUsers[Number(k)]).length > 0 ? 'someone...' : '—'}
//         {' • '}Online: {Object.keys(onlineUsers).length}
//       </div>
//     </div>
//   );
// }
