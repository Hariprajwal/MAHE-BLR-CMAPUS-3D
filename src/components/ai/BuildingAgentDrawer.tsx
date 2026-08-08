import React, { useState, useEffect, useRef } from 'react';
import {
  X, Send, Bot, User, Sparkles, CheckCircle2, ShieldCheck,
  Building2, MessageSquare, Zap, Clock, Info
} from 'lucide-react';
import { CampusPOI } from '../../data/campusData';
import {
  getBuildingAgent, generateBuildingAgentResponse,
  AgentChatMessage, BuildingAgentPersona
} from '../../data/buildingAgentEngine';

interface BuildingAgentDrawerProps {
  isOpen: boolean;
  poi: CampusPOI | null;
  onClose: () => void;
}

export const BuildingAgentDrawer: React.FC<BuildingAgentDrawerProps> = ({
  isOpen,
  poi,
  onClose,
}) => {
  const [messages, setMessages] = useState<AgentChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agent: BuildingAgentPersona = poi
    ? getBuildingAgent(poi.id)
    : getBuildingAgent('DEFAULT');

  // Initialize welcome message when drawer opens for a POI
  useEffect(() => {
    if (isOpen && poi) {
      const welcome: AgentChatMessage = {
        id: `welcome_${poi.id}`,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: agent.welcomeMessage,
      };
      setMessages([welcome]);
    }
  }, [isOpen, poi?.id]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen || !poi) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: AgentChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Simulate AI Agent response delay
    setTimeout(() => {
      const reply = generateBuildingAgentResponse(agent, text);
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-950/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 pointer-events-auto">

      {/* Header Banner */}
      <div
        className="p-5 border-b border-slate-800 relative flex items-center justify-between"
        style={{
          background: `linear-gradient(135deg, ${agent.accentColor}25 0%, #0f172a 100%)`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shadow-xl"
            style={{
              backgroundColor: `${agent.accentColor}20`,
              borderColor: `${agent.accentColor}50`,
            }}
          >
            {agent.avatarIcon}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Building In-Charge AI Agent
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h3 className="text-base font-black text-white mt-0.5 tracking-tight">
              {agent.agentName}
            </h3>
            <p className="text-xs text-slate-400 font-semibold">{agent.agentTitle}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Building Context Strip */}
      <div className="px-5 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-bold">
          <Building2 className="w-4 h-4 text-blue-400" />
          <span className="truncate max-w-[240px]">{poi.name}</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
          Authority Verified
        </span>
      </div>

      {/* Knowledge Tags */}
      <div className="px-5 py-2 bg-slate-950 border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {agent.knowledgeTags.map((tag, idx) => (
          <span
            key={idx}
            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 whitespace-nowrap border border-slate-700/50"
          >
            ✓ {tag}
          </span>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
            </div>
            <span className="text-[9px] text-slate-500 mt-1 px-1 font-mono">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 bg-slate-900 p-3 rounded-2xl w-fit border border-slate-800">
            <Bot className="w-4 h-4 text-blue-400 animate-spin" />
            <span className="text-xs italic">{agent.agentName} is querying live system database...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggested Prompts */}
      <div className="p-3 bg-slate-950 border-t border-slate-900 space-y-1.5">
        <span className="text-[10px] font-bold uppercase text-slate-500 px-2 block">Quick Actions</span>
        <div className="flex flex-wrap gap-1.5">
          {agent.suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all text-left truncate max-w-full"
            >
              💬 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={`Ask ${agent.agentName}...`}
          className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold transition-all shadow-md shadow-blue-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </aside>
  );
};
