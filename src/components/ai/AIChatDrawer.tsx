import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, Compass, Filter, Navigation } from 'lucide-react';
import { CampusPOI } from '../../data/campusData';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  actionTaken?: string;
  timestamp: string;
}

interface AIChatDrawerProps {
  isOpen: boolean;
  locations: CampusPOI[];
  onClose: () => void;
  onSelectLocation: (poi: CampusPOI) => void;
  onFilterCategory: (category: string | null) => void;
  onSetHighlightedIds: (ids: string[]) => void;
  onStartRoute: (fromId: string, toId: string) => void;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  locations,
  onClose,
  onSelectLocation,
  onFilterCategory,
  onSetHighlightedIds,
  onStartRoute
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Hello! I am your MAHE Bengaluru AI Campus Assistant. Ask me anything like "Where can I get coffee?", "Show restaurants above 4 stars", "Take me to Library", or "Navigate from Hostel 1 to Food Court".',
      timestamp: 'Just now'
    }
  ]);

  if (!isOpen) return null;

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const q = userText.toLowerCase();

    // Natural Language Intent Engine & 3D Action Execution
    setTimeout(() => {
      let aiResponseText = '';
      let actionTaken = '';

      if (q.includes('coffee') || q.includes('cafe')) {
        const cafes = locations.filter((loc) => loc.category === 'cafe' || loc.id === 'CAFE_TECH');
        onFilterCategory('cafe');
        onSetHighlightedIds(cafes.map((c) => c.id));
        aiResponseText = `I found ${cafes.length} cafe spots on campus! Highlighting Tech Espresso Cafe and Food Court coffee outlets.`;
        actionTaken = 'Filtered 3D View to Cafes';
      } else if (q.includes('4 star') || q.includes('4.5') || q.includes('top rated') || q.includes('best restaurant')) {
        const topRated = locations.filter((loc) => (loc.rating || 0) >= 4.5);
        onSetHighlightedIds(topRated.map((r) => r.id));
        aiResponseText = `Highlighted ${topRated.length} top-rated dining & academic hubs with ratings above 4.5 ⭐ on the 3D map!`;
        actionTaken = 'Highlighted Top Rated Locations';
      } else if (q.includes('library') || q.includes('books') || q.includes('study')) {
        const lib = locations.find((loc) => loc.id === 'LIBRARY_MAIN');
        if (lib) {
          onSelectLocation(lib);
          aiResponseText = `Flying camera to ${lib.name}. Open until 23:59 with silent study pods and digital IEEE repository.`;
          actionTaken = 'Flown Camera to Central Library';
        }
      } else if (q.includes('academic') || q.includes('ab-1') || q.includes('ab1') || q.includes('ab2')) {
        const academics = locations.filter((loc) => loc.category === 'academic');
        onFilterCategory('academic');
        onSetHighlightedIds(academics.map((a) => a.id));
        aiResponseText = `Filtered 3D view to Academic Blocks AB-1 and AB-2 (AI Research Wing).`;
        actionTaken = 'Filtered 3D View to Academic Blocks';
      } else if (q.includes('sports') || q.includes('gym') || q.includes('badminton') || q.includes('football')) {
        const sports = locations.filter((loc) => loc.category === 'sports');
        onFilterCategory('sports');
        onSetHighlightedIds(sports.map((s) => s.id));
        aiResponseText = `Showing MAHE Indoor Sports Arena & Outdoor Football Turf on the 3D map.`;
        actionTaken = 'Filtered 3D View to Sports Complex';
      } else if (q.includes('navigate') || q.includes('how do i get') || q.includes('route')) {
        if (q.includes('hostel') && q.includes('library')) {
          onStartRoute('HOSTEL_H1', 'LIBRARY_MAIN');
          aiResponseText = `Calculated 3D walking route from Phoenix Hostel H1 to Central Library (320 meters, ~4 mins walk). Glowing path drawn on walkway!`;
          actionTaken = 'Calculated & Rendered 3D Route';
        } else {
          onStartRoute('MAIN_GATE', 'FOOD_COURT_HUB');
          aiResponseText = `Calculated route from Main Gate 1 to Food Court Plaza. 3D walking path line is active!`;
          actionTaken = 'Calculated 3D Campus Route';
        }
      } else {
        // General search match fallback
        const matchedPoi = locations.find(
          (loc) => loc.name.toLowerCase().includes(q) || loc.category.toLowerCase().includes(q)
        );
        if (matchedPoi) {
          onSelectLocation(matchedPoi);
          aiResponseText = `Found match: ${matchedPoi.name}. Moving 3D camera to target coordinates.`;
          actionTaken = `Flown camera to ${matchedPoi.shortName}`;
        } else {
          aiResponseText = `I parsed your query: "${userText}". You can ask me to highlight food spots, calculate routes between hostels and library, or fly camera to any campus block!`;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: aiResponseText,
          actionTaken,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 400);
  };

  return (
    <aside className="fixed bottom-20 right-4 z-50 w-96 max-w-[calc(100vw-32px)] h-[520px] bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 pointer-events-auto">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-900/80 via-blue-900/80 to-slate-900 border-b border-indigo-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white tracking-wide">AI CAMPUS ASSISTANT</h3>
            <span className="text-[10px] text-indigo-300 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              Connected to 3D Interface Engine
            </span>
          </div>
        </div>

        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          'Where is the library?',
          'Show restaurants above 4 stars',
          'Navigate from Hostel to Library',
          'Show academic blocks'
        ].map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(promptText)}
            className="px-2.5 py-1 rounded-lg bg-indigo-950/60 text-indigo-200 border border-indigo-500/30 hover:bg-indigo-900/80 text-[10px] font-semibold whitespace-nowrap transition-all"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`max-w-[80%] space-y-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
              <div
                className={`p-3 rounded-2xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>

              {msg.actionTaken && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  <Compass className="w-3 h-3" />
                  3D Action: {msg.actionTaken}
                </div>
              )}

              <span className="text-[9px] text-slate-500 block px-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI: e.g. Where is AB-1?"
          className="flex-1 bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-indigo-600/40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </aside>
  );
};
