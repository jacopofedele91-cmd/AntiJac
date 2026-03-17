/**
 * AppBackground
 * Renders a fixed, full-page premium background using the brand palette:
 *  - #650C50 (Plum)  #183268 (Navy)  #C32573 (Magenta)  #D7D4D6 (Light grey)
 *
 * The gradient sits behind every page. Blobs are blurred, semi-transparent, and
 * will never distract from the content above them.
 */
export default function AppBackground() {
    return (
        <div
            aria-hidden
            className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
        >
            {/* ── Base radial gradient ── */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 120% 80% at 10% 0%, #650C50 0%, #2a0d35 40%, #0d1a40 70%, #101828 100%)",
                }}
            />

            {/* ── Subtle navy diagonal band ── */}
            <div
                className="absolute inset-0 opacity-60"
                style={{
                    background:
                        "linear-gradient(135deg, transparent 0%, #183268 50%, transparent 100%)",
                }}
            />

            {/* ── Blob 1: large magenta orb – top-right ── */}
            <div
                className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full opacity-[0.18]"
                style={{
                    background:
                        "radial-gradient(circle, #C32573 0%, transparent 70%)",
                    filter: "blur(60px)",
                }}
            />

            {/* ── Blob 2: plum orb – bottom-left ── */}
            <div
                className="absolute -bottom-20 -left-20 w-[360px] h-[360px] rounded-full opacity-[0.22]"
                style={{
                    background:
                        "radial-gradient(circle, #650C50 0%, transparent 70%)",
                    filter: "blur(55px)",
                }}
            />

            {/* ── Blob 3: small cool-toned navy accent – center-right ── */}
            <div
                className="absolute top-1/2 right-0 w-[240px] h-[240px] rounded-full opacity-[0.15]"
                style={{
                    background:
                        "radial-gradient(circle, #183268 0%, transparent 70%)",
                    filter: "blur(40px)",
                    transform: "translateY(-50%)",
                }}
            />

            {/* ── Blob 4: small magenta sparkle – lower-center ── */}
            <div
                className="absolute bottom-1/3 left-1/3 w-[160px] h-[160px] rounded-full opacity-[0.12]"
                style={{
                    background:
                        "radial-gradient(circle, #C32573 0%, transparent 70%)",
                    filter: "blur(35px)",
                }}
            />

            {/* ── Very faint light-grey top shimmer (from #D7D4D6) for depth ── */}
            <div
                className="absolute top-0 left-0 right-0 h-48 opacity-[0.06]"
                style={{
                    background:
                        "linear-gradient(to bottom, #D7D4D6, transparent)",
                }}
            />
        </div>
    );
}
