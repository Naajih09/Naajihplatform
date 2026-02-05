import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Send, Loader2, User } from 'lucide-react';
import Button from '../../components/Button';

const Messages = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. FETCH CHAT PARTNERS (People I connected with)
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/messages/partners/${user.id}`);
        const data = await res.json();
        setPartners(data);
      } catch (error) {
        console.error("Failed to load partners", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, [user.id]);

  // 2. FETCH CONVERSATION (When I click a person)
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/messages/conversation/${user.id}/${activeChat.id}`);
        const data = await res.json();
        setMessages(data);
        scrollToBottom();
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchMessages();
    // Optional: Set up a polling interval here to check for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [activeChat, user.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // 3. SEND MESSAGE
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const tempMsg = { content: inputText, senderId: user.id, createdAt: new Date() };
    setMessages([...messages, tempMsg]); // Optimistic update
    setInputText('');

    try {
      await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: tempMsg.content,
          senderId: user.id,
          receiverId: activeChat.id
        })
      });
      scrollToBottom();
    } catch (error) {
      alert("Failed to send");
    }
  };

  // Helper to get the "Other Person" from a connection object
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
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] bg-[#151518] border border-gray-800 rounded-2xl overflow-hidden flex font-sans">
      
      {/* LEFT: Sidebar (Partners List) */}
      <div className="w-80 border-r border-gray-800 flex flex-col bg-[#1d1d20]">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input className="w-full bg-[#151518] border border-gray-800 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-primary focus:outline-none" placeholder="Search..." />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? <div className="p-4 text-center text-gray-500"><Loader2 className="animate-spin inline mr-2"/> Loading...</div> : 
           partners.length === 0 ? <div className="p-4 text-center text-gray-500 text-sm">No connections yet.<br/>Go to 'Opportunities' to connect!</div> :
           partners.map((conn) => {
             const partner = getPartnerDetails(conn);
             return (
               <div 
                 key={conn.id} 
                 onClick={() => setActiveChat(partner)}
                 className={`p-4 border-b border-gray-800/50 cursor-pointer transition-colors ${activeChat?.id === partner.id ? 'bg-white/10 border-l-2 border-l-primary' : 'hover:bg-white/5'}`}
               >
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-white border border-gray-600">
                      {partner.initial}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{partner.name}</h4>
                      <span className="text-[10px] text-gray-500 uppercase font-bold">{partner.role}</span>
                    </div>
                  </div>
               </div>
             );
           })
          }
        </div>
      </div>

      {/* RIGHT: Chat Area */}
      <div className="flex-1 flex flex-col bg-[#151518]">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1d1d20]">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold">
                        {activeChat.initial}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">{activeChat.name}</h3>
                        <p className="text-xs text-green-500 flex items-center gap-1">Online</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-white" aria-label="Options"><MoreVertical size={20}/></button>
            </div>

            {/* Messages List */}
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                {messages.length === 0 && (
                  <div className="text-center text-gray-600 text-sm mt-10">Start the conversation! 👋</div>
                )}
                {messages.map((msg, idx) => {
                  const isMe = msg.senderId === user.id;
                  return (
                    <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-xs text-sm ${isMe ? 'bg-primary text-black rounded-tr-none' : 'bg-[#1d1d20] border border-gray-800 text-gray-300 rounded-tl-none'}`}>
                            {msg.content}
                        </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800 bg-[#1d1d20]">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="flex-1 bg-[#151518] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:outline-none transition-colors" 
                      placeholder="Type a message..." 
                    />
                    <button type="submit" className="bg-primary text-black p-3 rounded-xl hover:brightness-110" aria-label="Send">
                        <Send size={18} />
                    </button>
                </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
             <User size={48} className="mb-4 opacity-20" />
             <p>Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;