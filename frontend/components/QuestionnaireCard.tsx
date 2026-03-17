import React from 'react';

type QuestionnaireCardProps = {
    step: number;
    question: string;
    options?: string[];
    selectedOption?: string;
    onSelect?: (option: string) => void;
};

export default function QuestionnaireCard({
    step,
    question,
    options = [],
    selectedOption,
    onSelect,
}: QuestionnaireCardProps) {
    return (
        <div className="bg-[#D47BA4]/20 rounded-2xl p-4 mb-4 border border-[#D47BA4]/30 backdrop-blur-md shadow-sm">
            <div className="flex gap-4">
                {/* Number Badge */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D47BA4] flex items-center justify-center text-white font-bold shadow-md font-sans">
                    {step}
                </div>

                {/* Question Text */}
                <div className="flex-1 pb-2 flex items-center">
                    <p className="text-white text-[15px] font-medium leading-snug">
                        {question}
                    </p>
                </div>
            </div>

            {/* Options Row */}
            {options.length > 0 && (
                <div className="flex gap-2 mt-2 ml-12 overflow-x-auto pb-2 scrollbar-none">
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => onSelect?.(option)}
                            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm
                ${selectedOption === option
                                    ? 'bg-[#D8EE00] text-[#6F1A4A] scale-105 shadow-md'
                                    : 'bg-[#D47BA4]/40 text-white hover:bg-[#D47BA4]/60 hover:scale-105'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
