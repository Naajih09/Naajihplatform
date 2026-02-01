import React from 'react';
import { Search, MoreVertical, Send } from 'lucide-react';

const Messages = () => {
  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] bg-[#151518] border border-gray-800 rounded-2xl overflow-hidden flex font-sans">
      
      {/* LEFT: Sidebar */}
      <div className="w-80 border-r border-gray-800 flex flex-col bg-[#1d1d20]">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input className="w-full bg-[#151518] border border-gray-800 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-primary focus:outline-none" placeholder="Search..." />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            {/* Mock Chat Item */}
            <div className="p-4 border-b border-gray-800/50 hover:bg-white/5 cursor-pointer transition-colors bg-white/5 border-l-2 border-l-primary">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-white">Ahmed Musa</h4>
                    <span className="text-[10px] text-gray-500">10:30 AM</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">I am interested in your AgriTech proposal.</p>
            </div>
             <div className="p-4 border-b border-gray-800/50 hover:bg-white/5 cursor-pointer transition-colors">
                <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-white">Halal Capital</h4>
                    <span className="text-[10px] text-gray-500">Yesterday</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">Let's schedule a meeting.</p>
            </div>
        </div>
      </div>

      {/* RIGHT: Chat Area */}
      <div className="flex-1 flex flex-col bg-[#151518]">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1d1d20]">
            <div className="flex items-center gap-3">
                <div className="size-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-white">AM</div>
                <div>
                    <h3 className="font-bold text-white text-sm">Ahmed Musa</h3>
                    <p className="text-xs text-primary flex items-center gap-1">Online</p>
                </div>
            </div>
            
            {/* FIX: Added aria-label */}
            <button className="text-gray-400 hover:text-white" aria-label="Chat options">
              <MoreVertical size={20}/>
            </button>
        </div>

        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="flex justify-start">
                <div className="bg-[#1d1d20] border border-gray-800 p-3 rounded-2xl rounded-tl-none max-w-xs text-sm text-gray-300">
                    Salam, I saw your pitch. Is the equity negotiable?
                </div>
            </div>
            <div className="flex justify-end">
                <div className="bg-primary text-black font-medium p-3 rounded-2xl rounded-tr-none max-w-xs text-sm">
                    Wa alaikum salam! Yes, we are open to discussion based on the ticket size.
                </div>
            </div>
        </div>

        <div className="p-4 border-t border-gray-800 bg-[#1d1d20]">
            <div className="flex gap-2">
                <input className="flex-1 bg-[#151518] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:outline-none" placeholder="Type a message..." />
                
                {/* FIX: Added aria-label */}
                <button className="bg-primary text-black p-3 rounded-xl hover:brightness-110" aria-label="Send message">
                    <Send size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;