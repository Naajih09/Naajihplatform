import { ArrowLeft, FileText, Loader2, Mic, MoreVertical, Paperclip, Search, Send, StopCircle, X } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import EmptyState from '../../components/EmptyState';
import { useSocket } from '../../hooks/useSocket';
import { getApiBaseUrl } from '../../lib/api-base';

const Messages = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{show: boolean; message: string; type: 'success' | 'error'}>({
    show: false,
    message: '',
    type: 'success',
  });
  const [comingSoon, setComingSoon] = useState<{ show: boolean; title: string }>({
    show: false,
    title: '',
  });
  
  // --- NEW: Search State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);

  // File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice Note State
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isVerified = Boolean(user.isVerified);
  const verificationMessage = 'Verify your account to unlock this feature';
  const API_BASE = getApiBaseUrl();
  const authToken =
    localStorage.getItem('access_token') ||
    localStorage.getItem('accessToken') ||
    '';
  const authHeaders = useMemo(
    () => (authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    [authToken]
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- SOCKET HOOK ---
  const socket = useSocket(user.id);

  // --- FETCH PARTNERS ---
  useEffect(() => {
    if (!authToken) {
      setPartners([]);
      setLoading(false);
      return;
    }

    const fetchPartners = async () => {
      try {
        const res = await fetch(`${API_BASE}/messages/partners`, {
          headers: authHeaders,
        });
        if (!res.ok) {
          throw new Error(`Failed to load partners (${res.status})`);
        }
        const data = await res.json();
        setPartners(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load partners', error);
        setPartners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, [API_BASE, authHeaders, authToken]);

  // --- FETCH CONVERSATION & SOCKET LISTENERS ---
  useEffect(() => {
    if (!activeChat || !authToken) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/messages/conversation/${activeChat.id}`,
          { headers: authHeaders }
        );
        if (!res.ok) {
          throw new Error(`Failed to load conversation (${res.status})`);
        }
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
        scrollToBottom();
      } catch (error) {
        console.error(error);
        setMessages([]);
      }
    };
    
    fetchMessages();
  }, [API_BASE, activeChat, authHeaders, authToken]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket || !activeChat) return;

    socket.on('receive_message', (message: any) => {
      // Only append if it's from the person we're currently chatting with
      if (message.senderId === activeChat.id) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
    });

    socket.on('message_sent', (_message: any) => {
        // Confirmation for sender's own message (if not using optimistic UI fully)
        // Since we currently use optimistic UI, we might not need to append again,
        // but it's good for ensuring consistency.
    });

    return () => {
      socket.off('receive_message');
      socket.off('message_sent');
    };
  }, [socket, activeChat]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const uploadToCloud = async (file: Blob) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      return data.secure_url || data.url || null;
    } catch (err) {
      setToast({ show: true, message: 'Upload failed.', type: 'error' });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const sendMessage = async (content: string, type: 'TEXT' | 'IMAGE' | 'PDF' | 'AUDIO', url?: string) => {
    if (!activeChat || !socket) return;

    if (!isVerified) {
      setToast({ show: true, message: verificationMessage, type: 'error' });
      return;
    }
    
    const messageData = {
      content,
      senderId: user.id,
      receiverId: activeChat.id,
      type,
      attachmentUrl: url,
      createdAt: new Date()
    };

    // Optimistic Update
    setSending(true);
    setMessages(prev => [...prev, messageData]);
    scrollToBottom();
    setInputText('');

    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({
          content,
          receiverId: activeChat.id,
          type,
          attachmentUrl: url,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Failed to send message (${res.status})`);
      }
      socket.emit('send_message', messageData);
      setToast({ show: true, message: 'Message sent.', type: 'success' });
    } catch (error: any) {
      setToast({ show: true, message: error.message || 'Failed to send message.', type: 'error' });
      setMessages((prev) => prev.filter((msg) => msg !== messageData));
    }
    setSending(false);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText, 'TEXT');
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isVerified) {
      setToast({ show: true, message: verificationMessage, type: 'error' });
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadToCloud(file);
    if (!url) return;

    const type = file.type.includes('image') ? 'IMAGE' : 'PDF';
    sendMessage(file.name, type, url);
  };

  const startRecording = async () => {
    if (!isVerified) {
      setToast({ show: true, message: verificationMessage, type: 'error' });
      return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = async () => {
            const blob = new Blob(chunks, { type: 'audio/webm' });
            const url = await uploadToCloud(blob);
            if (url) sendMessage('Voice Note', 'AUDIO', url);
        };

        recorder.start();
        setIsRecording(true);
    } catch (err) {
        setToast({ show: true, message: 'Microphone access denied.', type: 'error' });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const getPartnerDetails = (connection: any) => {
    if (!connection) {
      return {
        id: '',
        name: 'Unknown User',
        role: 'USER',
        initial: 'U',
        avatarUrl: '',
      };
    }

    const otherUser = connection.senderId === user.id ? connection.receiver : connection.sender;
    if (!otherUser) {
      return {
        id: connection.id || '',
        name: 'Unknown User',
        role: 'USER',
        initial: 'U',
        avatarUrl: '',
      };
    }

    const profile = otherUser.entrepreneurProfile || otherUser.investorProfile || {};
    return {
      id: otherUser.id,
      name: `${profile.firstName || 'User'} ${profile.lastName || ''}`,
      role: otherUser.role,
      initial: profile.firstName?.[0] || 'U',
      avatarUrl: profile.avatarUrl || otherUser.avatarUrl || '',
    };
  };

  // --- FILTER LOGIC ---
  const filteredPartners = (Array.isArray(partners) ? partners : []).filter(p => {
    const details = getPartnerDetails(p);
    return details.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden flex font-sans shadow-sm relative">
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded shadow-lg text-white font-medium flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      {comingSoon.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-[#1d1d20]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Coming Soon</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{comingSoon.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setComingSoon({ show: false, title: '' })}
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label="Close coming soon modal"
              >
                <X size={20} />
              </button>
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-gray-400">
              This feature is coming soon. We'll notify you when it's ready.
            </p>
            <button
              type="button"
              onClick={() => setComingSoon({ show: false, title: '' })}
              className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-black hover:brightness-110"
            >
              Got it
            </button>
          </div>
        </div>
      )}
      
      {/* LEFT: Sidebar */}
      <div className={`
        flex-col bg-slate-50 dark:bg-[#1d1d20] border-r border-slate-200 dark:border-gray-800
        ${activeChat ? 'hidden md:flex w-80' : 'w-full md:w-80 flex'}
      `}>
        <div className="p-4 border-b border-slate-200 dark:border-gray-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              className="w-full bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none" 
              placeholder="Search..." 
              aria-label="Search messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // <--- CONNECTED SEARCH
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? <div className="p-4 text-center text-slate-500"><Loader2 className="animate-spin inline mr-2"/> Loading...</div> : 
           filteredPartners.length === 0 ? (
            <div className="m-4">
              <EmptyState
                compact
                title="No conversations yet"
                description="Once you connect with a founder or investor, your chats will appear here."
                actionLabel="Find connections"
                actionTo="/dashboard/connections"
              />
            </div>
           ) :
           filteredPartners.map((conn) => {
             const partner = getPartnerDetails(conn);
             return (
               <div key={conn.id} onClick={() => setActiveChat(partner)} className={`p-4 border-b border-slate-200 dark:border-gray-800/50 cursor-pointer transition-colors ${activeChat?.id === partner.id ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-slate-200 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-slate-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-slate-700 dark:text-white">
                      {partner.avatarUrl ? (
                        <img
                          src={partner.avatarUrl}
                          alt={partner.name}
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        partner.initial
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{partner.name}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 uppercase font-bold">{partner.role}</span>
                    </div>
                  </div>
               </div>
             );
           })
          }
        </div>
      </div>

      {/* RIGHT: Chat Area */}
      <div className={`
        flex-col bg-white dark:bg-[#151518]
        ${activeChat ? 'w-full flex md:flex-1' : 'hidden md:flex md:flex-1'}
      `}>
        {activeChat ? (
          <>
            <div className="p-4 border-b border-slate-200 dark:border-gray-800 flex justify-between items-center bg-slate-50 dark:bg-[#1d1d20]">
                <div className="flex items-center gap-3">
                    <button type="button" title="Go back" onClick={() => setActiveChat(null)} className="md:hidden text-slate-500 hover:text-primary mr-1" aria-label="Go back to conversations">
                        <ArrowLeft size={24} />
                    </button>

                    <div className="size-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold overflow-hidden">
                      {activeChat.avatarUrl ? (
                        <img
                          src={activeChat.avatarUrl}
                          alt={activeChat.name}
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        activeChat.initial
                      )}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">{activeChat.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">{activeChat.role}</p>
                    </div>
                </div>
                <button
                  type="button"
                  onClick={() => setComingSoon({ show: true, title: 'Conversation Options' })}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  aria-label="Options"
                  title="Conversation options"
                >
                  <MoreVertical size={20}/>
                </button>
            </div>

            {/* MESSAGES LIST */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {messages.map((msg, idx) => {
                  const isMe = msg.senderId === user.id;
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${isMe ? 'bg-primary text-black rounded-tr-none' : 'bg-slate-100 dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 text-slate-800 dark:text-gray-300 rounded-tl-none'}`}>
                            {msg.type === 'IMAGE' && <img src={msg.attachmentUrl} alt="attachment" className="rounded-lg mb-2 max-w-full" />}
                            {msg.type === 'PDF' && <a href={msg.attachmentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 underline font-bold mb-2"><FileText size={16} /> View Document</a>}
                            {msg.type === 'AUDIO' && <audio controls src={msg.attachmentUrl} className="w-full min-w-[200px] h-8 mb-1" />}
                            <p>{msg.content}</p>
                            <p className="text-[10px] opacity-50 text-right mt-1">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
            </div>

            {/* INPUT AREA */}
            <div className="p-4 border-t border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#1d1d20]">
                {!isVerified && (
                    <div className="mb-3 rounded-lg border border-amber-300/60 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
                        Verify your account to unlock this feature
                    </div>
                )}
                {isRecording ? (
                    <div className="flex items-center gap-4 text-red-500 animate-pulse">
                        <span className="font-bold">Recording Audio...</span>
                        <button type="button" onClick={stopRecording} className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full hover:bg-red-200" aria-label="Stop recording"><StopCircle size={24}/></button>
                    </div>
                ) : (
                    <form onSubmit={handleTextSubmit} className="flex gap-2 items-center">
                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept="image/*,application/pdf" aria-label="Upload file" />
                        
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-slate-400 hover:text-primary transition-colors" aria-label="Attach file" title={!isVerified ? verificationMessage : 'Attach file'}>
                            <Paperclip size={20} />
                        </button>
                        
                        <button type="button" onClick={startRecording} className="text-slate-400 hover:text-red-500 transition-colors" title={!isVerified ? verificationMessage : 'Start recording'} aria-label="Start recording voice note">
                            <Mic size={20} />
                        </button>

                        <input value={inputText} onChange={(e) => setInputText(e.target.value)} className="flex-1 bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none" placeholder="Type a message..." disabled={isUploading} aria-label="Message input"/>
                        
                        <button type="submit" className="bg-primary text-black p-3 rounded-xl hover:brightness-110 disabled:opacity-50" disabled={isUploading || sending || (!inputText && !isRecording)} aria-label="Send" title={!isVerified ? verificationMessage : 'Send'}>
                            {isUploading || sending ? <Loader2 className="animate-spin" size={18}/> : <Send size={18} />}
                        </button>
                    </form>
                )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
             <EmptyState
               compact
               title="Pick a conversation"
               description="Choose a contact from the list to view and continue your messages."
               actionLabel="Browse opportunities"
               actionTo="/dashboard/opportunities"
             />
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
