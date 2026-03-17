import React from 'react';

type ProductLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export default function ProductBoxSvg({ level, className = "" }: { level: ProductLevel | string; className?: string }) {
    let width = 100;
    let height = 120;
    let name = "NORMAL";
    let drops = 4;
    let maxDrops = 8;
    let isDots = false;
    let gradTop = "#831a54";
    let gradBottom = "#4c092f";
    let typeText = "ASSORBENTI";
    let quantity = 10;

    switch (level) {
        case 'L1':
            width = 70; height = 140; name = "LONG"; drops = 4; maxDrops = 4; isDots = true; typeText = "PROTEGGISLIP"; quantity = 24;
            gradTop = "#B82F71"; gradBottom = "#7A1C49";
            break;
        case 'L2':
            width = 110; height = 80; name = "MINI"; drops = 2; maxDrops = 8; quantity = 16;
            break;
        case 'L3':
            width = 100; height = 120; name = "NORMAL"; drops = 4; maxDrops = 8; quantity = 10;
            break;
        case 'L4':
            width = 100; height = 120; name = "EXTRA"; drops = 5; maxDrops = 8; quantity = 10;
            break;
        case 'L5':
            width = 120; height = 140; name = "MAXI"; drops = 7; maxDrops = 8; quantity = 12;
            break;
    }

    const dropSpacing = 7;
    const dropsTotalWidth = maxDrops * dropSpacing;

    return (
        <div className={`relative flex items-center justify-center ${className}`} title={`LINES SPECIALIST ${name}`}>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id={`bgGrad-${level}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={gradTop} />
                        <stop offset="100%" stopColor={gradBottom} />
                    </linearGradient>
                    <linearGradient id={`pinkgrad`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#DE3489" />
                        <stop offset="100%" stopColor="#7B1446" />
                    </linearGradient>
                </defs>

                {/* Main Box Shape */}
                <rect x="0" y="5" width={width} height={height - 5} rx="4" fill={`url(#bgGrad-${level})`} />
                <path d={`M 5 5 L 15 0 L ${width - 15} 0 L ${width - 5} 5 Z`} fill="#3a0422" opacity="0.5" />

                {/* Visual texture at the top */}
                <path d={`M 0 15 Q ${width / 2} 30 ${width} 10 L ${width} 30 L 0 30 Z`} fill="url(#pinkgrad)" opacity="0.6" />

                {/* Yellow ribbon */}
                <rect x="0" y={height * 0.15} width={width} height="12" fill="#FAFF00" />
                <text x={width / 2} y={height * 0.15 + 8} fontSize="6" fontWeight="bold" fill="#000" textAnchor="middle" letterSpacing="0.5">
                    SUPER ASCIUTTO
                </text>

                {/* White central area with curved bottom */}
                <path d={`M 0 ${height * 0.3} L ${width} ${height * 0.3} L ${width} ${height * 0.75} Q ${width / 2 + 10} ${height * 0.9} 0 ${height * 0.65} Z`} fill="#FFFFFF" />

                {/* Logo Text */}
                <text x={width / 2} y={height * 0.45} fontSize="12" fontWeight="900" fontFamily="serif" fill="#18183B" textAnchor="middle" letterSpacing="0.5">LINES</text>
                <text x={width / 2} y={height * 0.52} fontSize="5" fontWeight="bold" fontFamily="sans-serif" fill="#18183B" textAnchor="middle" letterSpacing="1">SPECIALIST</text>

                {/* Script "Lady" */}
                {level !== 'L1' && (
                    <text x={width / 2} y={height * 0.65} fontSize="11" fontStyle="italic" fontFamily="serif" fill="#18183B" textAnchor="middle">Lady</text>
                )}

                {/* Zero Odore badge */}
                <circle cx={width - 20} cy={height * 0.68} r="8" fill="#FFFFFF" stroke="#DE3489" strokeWidth="1" />
                <text x={width - 20} y={height * 0.66} fontSize="4" fontWeight="bold" fill="#DE3489" textAnchor="middle">ZERO</text>
                <text x={width - 20} y={height * 0.70} fontSize="4" fontWeight="bold" fill="#DE3489" textAnchor="middle">ODORE</text>

                {/* Drops section */}
                <g transform={`translate(${(width - dropsTotalWidth) / 2}, ${height - 18})`}>
                    {[...Array(maxDrops)].map((_, i) => (
                        isDots ? (
                            <circle key={i} cx={i * dropSpacing + 4} cy="-2" r="2.5" fill={i < drops ? "#fff" : "transparent"} stroke="#fff" strokeWidth="1" />
                        ) : (
                            <path key={i} d={`M${i * dropSpacing + 4} -4 C${i * dropSpacing + 2} -1 ${i * dropSpacing + 2} 2 ${i * dropSpacing + 4} 2 C${i * dropSpacing + 6} 2 ${i * dropSpacing + 6} -1 ${i * dropSpacing + 4} -4 Z`} fill={i < drops ? "#fff" : "transparent"} stroke="#fff" strokeWidth="1" />
                        )
                    ))}
                </g>
                <text x={width / 2} y={height - 6} fontSize="5" fontWeight="bold" fill="#fff" textAnchor="middle">{quantity} {typeText} {name}</text>
            </svg>
        </div>
    );
}
