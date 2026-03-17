"use client";

import { useState } from 'react';

const MOODS = [
    { id: '1', emoji: '🤩', label: 'Ottimo' },
    { id: '2', emoji: '😊', label: 'Bene' },
    { id: '3', emoji: '😐', label: 'Così così' },
    { id: '4', emoji: '😔', label: 'Giù' },
    { id: '5', emoji: '😫', label: 'Ansiosa' }
];

const QUICK_TAGS = ['Energica', 'Stanca', 'Fiduciosa', 'Nervosa', 'Serenità', 'Sfida'];

export default function MoodTracker() {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [note, setNote] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSave = async () => {
        if (!selectedMood) return;

        try {
            const res = await fetch('http://localhost:8000/mood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 'user_123',
                    mood_id: selectedMood,
                    tags: selectedTags,
                    note: note || undefined,
                    timestamp: new Date().toISOString()
                })
            });

            if (res.ok) {
                setIsSaved(true);
                // Timeout to simulate save and show success state
                setTimeout(() => {
                    setIsSaved(false);
                    setSelectedMood(null);
                    setSelectedTags([]);
                    setNote('');
                }, 3000);
            }
        } catch (error) {
            console.error("Error recording mood:", error);
        }
    };

    if (isSaved) {
        return (
            <div className="bg-pink-dusty rounded-3xl p-6 text-center text-white shadow-md animate-fade-in my-6">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="font-heading font-bold text-xl mb-2">Preso nota.</h3>
                <p className="text-sm opacity-90">Grazie per aver condiviso come ti senti oggi. Ricorda che ogni giornata ha il suo ritmo.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 my-6">
            <h2 className="text-[#6F1A4A] font-bold text-lg mb-4">Come ti senti adesso?</h2>

            {/* 1. Emojis */}
            <div className="flex justify-between items-center mb-6">
                {MOODS.map(mood => (
                    <button
                        key={mood.id}
                        onClick={() => setSelectedMood(mood.id)}
                        className={`flex flex-col items-center transition-transform hover:scale-110 active:scale-90 ${selectedMood === mood.id ? 'opacity-100 scale-110' : 'opacity-60 saturate-50'}`}
                    >
                        <span className="text-4xl drop-shadow-sm mb-1">{mood.emoji}</span>
                        <span className={`text-[10px] font-medium ${selectedMood === mood.id ? 'text-[#6F1A4A]' : 'text-gray-400'}`}>
                            {mood.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* 2. Quick Tags (only show if mood is selected to reduce friction) */}
            <div className={`transition-all duration-300 overflow-hidden ${selectedMood ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-sm font-semibold text-gray-500 mb-3">Seleziona una o più sensazioni:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {QUICK_TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200 border 
                                ${selectedTags.includes(tag)
                                    ? 'bg-[#BC5887] text-white border-[#BC5887]'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* 3. Diario Opzionale (140 chars) */}
                <div className="relative mb-4">
                    <textarea
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 outline-none focus:border-[#BC5887] resize-none h-24"
                        placeholder="Vuoi aggiungere un pensiero rapido? (Opzionale)"
                        maxLength={140}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                    {note.length > 50 && (
                        <span className={`absolute bottom-3 right-3 text-[10px] font-mono ${note.length > 120 ? 'text-red-400' : 'text-gray-400'}`}>
                            {note.length}/140
                        </span>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="bg-[#D8EE00] text-[#6F1A4A] font-bold py-2.5 px-6 rounded-full shadow-sm hover:scale-105 transition-transform"
                    >
                        Salva
                    </button>
                </div>
            </div>
        </div>
    );
}
