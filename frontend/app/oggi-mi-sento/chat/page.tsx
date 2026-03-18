"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Shield, Heart, Flag, Pencil, Check, AlertTriangle } from 'lucide-react';
import { moderateMessage } from '../../../lib/contentModeration';

const TOPIC_ROOMS = [
    { id: 'prime-settimane', label: "Prime Settimane 🌱" },
    { id: 'sport', label: "Sport e Movimento 🏃‍♀️" },
    { id: 'viaggio', label: "Viaggiare serene ✈️" },
    { id: 'giornaliera', label: "Day By Day ☕" }
];


const INITIAL_MESSAGES: Record<string, any[]> = {
    'prime-settimane': [
        { id: 1, author: "GattinaCoraggiosa", avatar: "🐱", content: "Ciao a tutte, è la prima volta che scrivo qui. Qualcuna di voi ha provato gli esercizi del Coach? Come vi siete trovate all'inizio?", time: "10:24", badge: "Spirito Gentile 🌟" },
        { id: 2, author: "LunaSerena", avatar: "🌙", content: "Benvenuta! 🥰 Sì, io li faccio da una decina di giorni. All'inizio sembra strano ma poi diventa un'abitudine piacevole!", time: "10:30", badge: null }
    ],
    'sport': [
        { id: 3, author: "FioreSprint", avatar: "🌸", content: "Oggi ho fatto 30 minuti di corsetta leggera. Grazie ai consigli della sezione Giornate Speciali non ho avuto pensieri!", time: "Ieri", badge: null },
        { id: 4, author: "PandaFelice", avatar: "🐼", content: "Bravissima! Io sto trovando tanta sicurezza con lo yoga ultimamente. Consigliatissimo per respirare bene.", time: "Ieri", badge: "Spirito Gentile 🌟" },
    ],
    'viaggio': [],
    'giornaliera': [
        { id: 5, author: "RaggioDiSole", avatar: "☀️", content: "Buongiorno community! Ricordatevi di bere un bel bicchiere d'acqua! 💧", time: "08:15", badge: "Spirito Gentile 🌟" }
    ]
};

export default function CommunityChat() {
    const [activeRoom, setActiveRoom] = useState(TOPIC_ROOMS[0].id);
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<Record<string, any[]>>(INITIAL_MESSAGES);
    const [aliasName, setAliasName] = useState("FarfallaLibera");
    const [aliasAvatar] = useState("🦋");
    const [isEditingAlias, setIsEditingAlias] = useState(false);
    const [tempAlias, setTempAlias] = useState("FarfallaLibera");
    const [isPosting, setIsPosting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [blockedCategory, setBlockedCategory] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const aliasInputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom whenever messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeRoom]);

    // Focus alias input when editing
    useEffect(() => {
        if (isEditingAlias) aliasInputRef.current?.focus();
    }, [isEditingAlias]);

    const handleSaveAlias = () => {
        const cleaned = tempAlias.trim().replace(/\s+/g, '');
        if (cleaned.length >= 3) setAliasName(cleaned);
        setIsEditingAlias(false);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || isPosting) return;
        setBlockedCategory(null);

        // Client-side content moderation
        const modResult = moderateMessage(newMessage);
        if (!modResult.allowed) {
            setErrorMsg(modResult.userMessage ?? 'Messaggio non consentito.');
            setBlockedCategory(modResult.category ?? null);
            return;
        }

        setIsPosting(true);
        setErrorMsg(null);

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Aggiungi il messaggio SUBITO allo stato locale (UX immediata)
        const localMsg = {
            id: Date.now(),
            author: aliasName,
            avatar: aliasAvatar,
            content: newMessage,
            time: timeStr,
            badge: null
        };

        setMessages(prev => ({
            ...prev,
            [activeRoom]: [...(prev[activeRoom] || []), localMsg]
        }));
        setNewMessage("");

        // Tenta anche di salvare sul backend (silenziosamente, non blocca la UX)
        try {
            await fetch(`http://localhost:8000/rooms/${activeRoom}/post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: "user_123",
                    author_pseudonym: aliasName,
                    room_id: activeRoom,
                    content: newMessage
                })
            });
        } catch (_) {
            // Backend non disponibile — silenzioso, la UX non è impattata
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <main className="h-screen bg-[#6F1A4A] flex flex-col font-sans max-w-md mx-auto relative overflow-hidden shadow-2xl">

            {/* Header */}
            <header className="pt-12 px-6 pb-4 bg-[#6F1A4A] z-20 flex flex-col border-b border-white/10 shrink-0 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

                <div className="flex items-center justify-between mb-4">
                    <Link href="/oggi-mi-sento" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 border border-white/20">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-white tracking-wide uppercase font-serif">Community</h1>
                    <div className="w-10 h-10 bg-[#D47BA4] rounded-full flex items-center justify-center border-2 border-[#D8EE00] shadow-[0_0_10px_rgba(216,238,0,0.3)]">
                        <span className="text-lg">{aliasAvatar}</span>
                    </div>
                </div>

                {/* Alias box – editabile */}
                <div className="flex bg-[#BC5887] rounded-xl p-3 items-center justify-between border border-white/10">
                    <div className="flex items-center space-x-3 flex-1">
                        <Shield className="w-5 h-5 text-[#D8EE00] shrink-0" />
                        <div className="flex flex-col flex-1">
                            <span className="text-white text-xs font-semibold mb-0.5">Il tuo alias anonimo:</span>
                            {isEditingAlias ? (
                                <div className="flex items-center space-x-1">
                                    <input
                                        ref={aliasInputRef}
                                        value={tempAlias}
                                        onChange={e => setTempAlias(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSaveAlias()}
                                        maxLength={20}
                                        className="bg-white/20 text-white font-bold text-sm rounded-lg px-2 py-1 outline-none flex-1 border border-[#D8EE00] focus:ring-1 focus:ring-[#D8EE00]"
                                        placeholder="Il tuo alias..."
                                    />
                                    <button onClick={handleSaveAlias} className="w-7 h-7 bg-[#D8EE00] rounded-full flex items-center justify-center shrink-0">
                                        <Check className="w-4 h-4 text-[#6F1A4A]" />
                                    </button>
                                </div>
                            ) : (
                                <span className="text-[#D8EE00] font-bold text-sm">{aliasName} {aliasAvatar}</span>
                            )}
                        </div>
                    </div>
                    {!isEditingAlias && (
                        <button
                            onClick={() => { setTempAlias(aliasName); setIsEditingAlias(true); }}
                            className="ml-2 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20 shrink-0"
                            title="Modifica alias"
                        >
                            <Pencil className="w-3.5 h-3.5 text-white" />
                        </button>
                    )}
                </div>
            </header>

            {/* Topic Tabs */}
            <div className="bg-[#6F1A4A] pt-3 pb-2 z-10 shrink-0">
                <div className="flex overflow-x-auto px-4 space-x-2 scrollbar-none pb-1">
                    {TOPIC_ROOMS.map(room => (
                        <button
                            key={room.id}
                            onClick={() => setActiveRoom(room.id)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all border ${activeRoom === room.id
                                ? 'bg-[#D8EE00] text-[#6F1A4A] border-[#D8EE00] shadow-md scale-105'
                                : 'bg-[#BC5887] text-white border-transparent hover:bg-[#a64e75]'
                                }`}
                        >
                            {room.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto bg-[#fdfbfd] px-4 py-5 scrollbar-none rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)] mt-2">
                <div className="flex justify-center mb-5">
                    <span className="bg-[#e9ecef] text-[#6c757d] text-xs font-bold px-3 py-1 rounded-full">
                        Stanza sicura. Sii gentile. 🌸
                    </span>
                </div>

                <div className="space-y-5 pb-4">
                    {messages[activeRoom]?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center text-gray-400">
                            <span className="text-4xl mb-3">👋</span>
                            <p className="font-semibold text-sm">Nessun messaggio ancora.</p>
                            <p className="text-xs mt-1">Sii la prima ad inaugurare questa stanza!</p>
                        </div>
                    ) : (
                        messages[activeRoom].map((msg: any) => {
                            const isMe = msg.author === aliasName;
                            return (
                                <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`flex flex-col items-center ${isMe ? 'ml-3' : 'mr-3'} mt-1`}>
                                            <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center text-xl shrink-0">
                                                {msg.avatar}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className={`flex items-baseline space-x-2 mb-1 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                {!isMe && <span className="text-xs font-bold text-[#6F1A4A]">{msg.author}</span>}
                                                <span className="text-[10px] text-gray-400 font-semibold">{msg.time}</span>
                                            </div>
                                            <div className={`px-4 py-3 text-sm shadow-sm leading-relaxed ${isMe
                                                ? 'bg-[#6F1A4A] text-white rounded-2xl rounded-tr-sm'
                                                : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm border border-gray-100'
                                                }`}>
                                                {msg.content}
                                            </div>
                                            {!isMe && (
                                                <div className="flex items-center justify-between mt-1 px-1">
                                                    <div>
                                                        {msg.badge && (
                                                            <span className="inline-flex items-center text-[9px] font-bold text-[#D47BA4] bg-[#f8f0f4] px-2 py-0.5 rounded-full border border-[#f2dce6]">
                                                                <Heart className="w-2.5 h-2.5 mr-1 fill-current" /> {msg.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button className="text-gray-300 hover:text-gray-400 p-1" title="Segnala">
                                                        <Flag className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input area */}
            <div className="bg-white px-4 py-4 shrink-0 border-t border-gray-100 flex flex-col z-20">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={e => { setNewMessage(e.target.value); setErrorMsg(null); }}
                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                        placeholder={`Scrivi come ${aliasName}…`}
                        className="flex-1 bg-gray-100 text-[#6F1A4A] px-4 py-3 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#D47BA4] border border-transparent focus:bg-white transition-all font-medium placeholder-gray-400"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isPosting}
                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shrink-0 ${newMessage.trim() && !isPosting
                            ? 'bg-[#D8EE00] text-[#6F1A4A] shadow-md hover:scale-105 active:scale-95'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <Send className="w-5 h-5 ml-0.5" />
                    </button>
                </div>
                {errorMsg && (
                    <div className="mt-2 flex items-start space-x-2 bg-[#FFF1F5] border border-[#DE4190]/30 rounded-xl px-3 py-2.5 animate-[shake_0.3s_ease-in-out]">
                        <AlertTriangle className="w-4 h-4 text-[#DE4190] shrink-0 mt-0.5" />
                        <div>
                            {blockedCategory && (
                                <span className="text-[10px] font-black uppercase tracking-wider text-[#DE4190] block mb-0.5">
                                    Contenuto bloccato: {blockedCategory}
                                </span>
                            )}
                            <p className="text-[#6F1A4A] text-xs font-semibold leading-snug">{errorMsg}</p>
                        </div>
                    </div>
                )}
                <p className="text-[10px] text-center text-gray-400 font-medium mt-2">
                    I messaggi sono filtrati automaticamente per mantenere la community sicura 🌸
                </p>
            </div>
        </main>
    );
}
