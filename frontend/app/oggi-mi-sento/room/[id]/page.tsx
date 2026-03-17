"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TopicRoomPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [messages, setMessages] = useState([
        { id: 1, author: 'PandaFelice', text: 'Ciao a tutte! Oggi ho provato a fare una passeggiata più lunga del solito.', isMine: false },
        { id: 2, author: 'VolpeSerena', text: 'Bravissima! Come ti sei sentita? Hai usato il cambio in viaggio?', isMine: false },
    ]);
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        if (!newMessage.trim()) return;

        // Check local profanity (mock)
        if (newMessage.toLowerCase().includes('stupido')) {
            alert("Sembra che alcune parole non rispettino lo spirito gentile della community. Prova a modificarle.");
            return;
        }

        setMessages([...messages, { id: Date.now(), author: 'Tu (Anonimo)', text: newMessage, isMine: true }]);
        setNewMessage('');
    };

    return (
        <main className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans relative max-w-md mx-auto shadow-2xl">
            {/* Header */}
            <header className="pt-12 pb-4 px-6 bg-white shadow-sm flex items-center shrink-0 z-10 sticky top-0">
                <button onClick={() => router.back()} className="mr-4 p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                    ←
                </button>
                <div>
                    <h1 className="text-xl font-bold text-[#6F1A4A]">Stanza Chat</h1>
                    <p className="text-xs text-green-600 font-medium">Ambiente Sicuro e Anonimo</p>
                </div>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-0 pb-32">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 ${msg.isMine ? 'bg-[#6F1A4A] text-white rounded-br-none' : 'bg-white border border-gray-100 shadow-sm rounded-bl-none'}`}>
                            {!msg.isMine && <div className="text-xs font-bold text-gray-500 mb-1">{msg.author}</div>}
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Notice & Input */}
            <div className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 bg-white border-t border-gray-100 p-4 pb-8 z-50">
                <div className="text-[10px] text-gray-500 text-center mb-2 px-2">
                    Questo messaggio apparirà col tuo pseudonimo. Nessuno vedrà il tuo vero nome o foto.
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6F1A4A]"
                        placeholder="Scrivi un messaggio gentile..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                        onClick={handleSend}
                        className="bg-[#6F1A4A] text-white rounded-full w-12 h-12 flex items-center justify-center shrink-0 hover:bg-[#5a143b] transition-colors shadow-sm"
                    >
                        ➤
                    </button>
                </div>
            </div>
        </main>
    );
}
