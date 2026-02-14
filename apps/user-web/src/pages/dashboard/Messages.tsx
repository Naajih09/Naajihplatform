import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Send, Loader2, User } from 'lucide-react';

const Messages = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/messages/partners/${user.id}`);
        const data = await res.json();
        setPartners(data);
      } catch (error) {
        console.error("Failed to load partners");
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, [user.id]);

  useEffect(() => {
    if (!activeChat) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/messages/conversation/${user.id}/${activeChat.id}`);
        const data = await res.json();
        setMessages(data);
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      } catch (error) { console.error(error); }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [activeChat, user.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;
    const tempMsg = { content: inputText, senderId: user.id, createdAt: new Date() };
    setMessages([...messages, tempMsg]);
    setInputText('');
    try {
      await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tempMsg.content, senderId: user.id, receiverId: activeChat.id })
      });
    } catch (error) { alert("Failed to send"); }
  };

  const getPartnerDetails = (connection: any) => {
    const otherUser = connection.senderId === user.id ? connection.receiver : connection.sender;
    const profile = otherUser.entrepreneurProfile || otherUser.investorProfile || {};
    return {
      id: otherUser.id,
      name: `${profile.firstName || 'User'} ${profile.lastName || ''}`,
      role: otherUser.role,
      initial: profile.firstName?.[0] || 'U'
    };
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden flex font-sans shadow-sm">
      
      {/* LEFT: Sidebar */}
      <div className="w-80 border-r border-slate-200 dark:border-gray-800 flex flex-col bg-slate-50 dark:bg-[#1d1d20]">
        <div className="p-4 border-b border-slate-200 dark:border-gray-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input className="w-full bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none" placeholder="Search..." aria-label="Search messages"/>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? <div className="p-4 text-center text-slate-500"><Loader2 className="animate-spin inline mr-2"/> Loading...</div> : 
           partners.length === 0 ? <div className="p-4 text-center text-slate-500 text-sm">No connections yet.</div> :
           partners.map((conn) => {
             const partner = getPartnerDetails(conn);
             return (
               <div key={conn.id} onClick={() => setActiveChat(partner)} className={`p-4 border-b border-slate-200 dark:border-gray-800/50 cursor-pointer transition-colors ${activeChat?.id === partner.id ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-slate-200 dark:hover:bg-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-slate-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-slate-700 dark:text-white">
                      {partner.initial}
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
      <div className="flex-1 flex flex-col bg-white dark:bg-[#151518]">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-slate-200 dark:border-gray-800 flex justify-between items-center bg-slate-50 dark:bg-[#1d1d20]">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">{activeChat.initial}</div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">{activeChat.name}</h3>
                        <p className="text-xs text-green-500 flex items-center gap-1">Online</p>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white" aria-label="Options"><MoreVertical size={20}/></button>
            </div>

            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {messages.map((msg, idx) => {
                  const isMe = msg.senderId === user.id;
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-xs text-sm ${isMe ? 'bg-primary text-black rounded-tr-none' : 'bg-slate-100 dark:bg-[#1d1d20] border border-slate-200 dark:border-gray-800 text-slate-800 dark:text-gray-300 rounded-tl-none'}`}>
                            {msg.content}
                        </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#1d1d20]">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input value={inputText} onChange={(e) => setInputText(e.target.value)} className="flex-1 bg-white dark:bg-[#151518] border border-slate-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary focus:outline-none" placeholder="Type a message..." aria-label="Message input"/>
                    <button type="submit" className="bg-primary text-black p-3 rounded-xl hover:brightness-110" aria-label="Send"><Send size={18} /></button>
                </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
             <User size={48} className="mb-4 opacity-20" />
             <p>Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;