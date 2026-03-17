"use client";

import { useState, useEffect } from 'react';

// Mocked Rooms
const ROOMS = [
    { id: '1', name: 'Prime settimane', tag: '🌱 Nuovo Inizio' },
    { id: '2', name: 'Sport e Movimento', tag: '🏃‍♀️ Attive' },
    { id: '3', name: 'Viaggio senza stress', tag: '✈️ Esplorare' },
    { id: '4', name: 'Day by day', tag: '☕ Chiacchiere' }
];

// Mocked Posts
const MOCK_POSTS = [
    { id: 'p1', author: 'PandaFelice', room: '1', content: "Oggi ho completato le mie prime 3 micro-sessioni! Non pensavo sarebbe stato così semplice inserirle nella routine. Avete consigli su come ricordarsene al lavoro?", likes: 12, isAuthor: false, time: '2h fa' },
    { id: 'p2', author: 'StellaMattina', room: '1', content: "Io ho iniziato a fare un po' di respirazione prima di ogni riunione, mi aiuta un sacco a rilassare anche il pavimento pelvico! Provaci 🙏", likes: 8, isAuthor: false, time: '1h fa' }
];

export default function CommunityFeed() {
    const [selectedRoom, setSelectedRoom] = useState(ROOMS[0].id);
    const [posts, setPosts] = useState<any[]>(MOCK_POSTS);
    const [newPostContent, setNewPostContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handlePost = async () => {
        if (!newPostContent.trim()) return;

        setSubmitting(true);
        setErrorMsg('');

        try {
            const res = await fetch(`http://localhost:8000/rooms/${selectedRoom}/post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 'user_123',
                    author_pseudonym: 'GiglioSilenzioso',
                    room_id: selectedRoom,
                    content: newPostContent
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                setErrorMsg(errData.detail || "Si è verificato un errore.");
                setSubmitting(false);
                return;
            }

            // Post successful, clear content and wait for useEffect to fetch the new feed
            setNewPostContent('');
            setSubmitting(false);
        } catch (error) {
            console.error("Error posting to community:", error);
            setErrorMsg("Errore di connessione al server.");
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await fetch(`http://localhost:8000/rooms/${selectedRoom}/feed`);
                if (res.ok) {
                    const data = await res.json();

                    if (data.length > 0) {
                        setPosts(data.map((p: any) => ({
                            id: p.id,
                            author: p.author_pseudonym,
                            room: p.room_id,
                            content: p.content,
                            likes: p.likes,
                            isAuthor: p.user_id === 'user_123',
                            time: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        })));
                    } else {
                        setPosts([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching feed:", error);
            }
        };

        fetchFeed();
    }, [selectedRoom, submitting]); // Refetch when room changes or after submitting

    const activeRoomName = ROOMS.find(r => r.id === selectedRoom)?.name;

    return (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col h-full min-h-[500px]">
            {/* Header Rooms */}
            <div className="mb-6">
                <h2 className="text-[#6F1A4A] font-bold text-xl font-heading mb-3">Community D&apos;Acqua</h2>
                <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-none">
                    {ROOMS.map(room => (
                        <button
                            key={room.id}
                            onClick={() => setSelectedRoom(room.id)}
                            className={`whitespace-nowrap px-4 py-2 rounded-xl font-medium text-sm transition-colors border ${selectedRoom === room.id
                                ? 'bg-[#BC5887] text-white border-[#BC5887]'
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <span className="mr-1">{room.tag.split(' ')[0]}</span>
                            {room.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Composer */}
            <div className="bg-pink-50 rounded-2xl p-4 mb-6 relative">
                <textarea
                    className="w-full bg-transparent border-none outline-none resize-none text-sm text-gray-800 placeholder:text-gray-400 min-h-[60px]"
                    placeholder={`Condividi un pensiero in "${activeRoomName}"...`}
                    maxLength={280}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                />

                {errorMsg && (
                    <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl mb-4 border border-red-100 flex items-start">
                        <span className="mr-2">⚠️</span>
                        <p>{errorMsg}</p>
                    </div>
                )}

                <div className="flex justify-between items-center mt-2 border-t border-pink-100 pt-3">
                    <span className="text-[10px] text-pink-400 font-medium">
                        Pubblicherai come <span className="font-bold underline">GiglioSilenzioso</span>. Nessuno vedrà il tuo vero nome.
                    </span>
                    <button
                        onClick={handlePost}
                        disabled={!newPostContent.trim() || submitting}
                        className={`bg-[#6F1A4A] text-white px-5 py-2 rounded-full text-xs font-bold transition-transform ${!newPostContent.trim() || submitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-md active:scale-95'
                            }`}
                    >
                        {submitting ? 'Verifica...' : 'Pubblica'}
                    </button>
                </div>
            </div>

            {/* Feed */}
            <div className="flex-grow overflow-y-auto space-y-4 pb-12 scrollbar-none">
                {posts.filter(p => p.room === selectedRoom).map(post => (
                    <div key={post.id} className={`p-4 rounded-2xl border ${post.isAuthor ? 'bg-pink-light/10 border-[#BC5887]/20' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <span className={`text-xs font-bold ${post.isAuthor ? 'text-[#BC5887]' : 'text-gray-600'}`}>
                                {post.author} {post.isAuthor && '(Tu)'}
                            </span>
                            <span className="text-[10px] text-gray-400">{post.time}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-3">
                            {post.content}
                        </p>

                        {/* Feed Actions */}
                        <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-gray-400 hover:text-pink-dusty transition-colors text-xs font-medium">
                                <span>🤍</span>
                                <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-400 hover:text-[#6F1A4A] transition-colors text-xs font-medium">
                                <span>💬</span>
                                <span>Rispondi</span>
                            </button>
                        </div>
                    </div>
                ))}

                {posts.filter(p => p.room === selectedRoom).length === 0 && (
                    <div className="text-center py-10 opacity-50">
                        <span className="text-4xl mb-2 block">🌿</span>
                        <p className="text-sm">Ancora nessun pensiero condiviso qui. Sii tu la prima!</p>
                    </div>
                )}
            </div>

        </div>
    );
}
