import React, { forwardRef } from 'react';

const CertificatePreview = forwardRef(({ studentName, courseName, date }, ref) => {
    return (
        <div className="shadow-2xl rounded-lg overflow-hidden border border-gray-100 inline-block font-sans">
            <div
                ref={ref}
                className="w-[800px] h-[600px] relative bg-white flex flex-col p-0 text-slate-900"
            >
                {/* --- DECORATIVE ACCENT BAR --- */}
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 via-blue-400 to-green-400" />

                {/* --- BACKGROUND PATTERN (Subtle) --- */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* --- HEADER --- */}
                <header className="px-16 pt-16 flex justify-between items-start z-10">
                    <div className="flex items-center gap-3">
                        <UpRiseIcon size={48} />
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">UpRise</h1>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Skills Academy</p>
                        </div>
                    </div>

                </header>

                {/* --- MAIN CONTENT --- */}
                <main className="flex-1 flex flex-col justify-center px-20 z-10">
                    <div className="mb-4">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6">
                            Verified Certification
                        </span>
                        <h2 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                            Certificate of Completion
                        </h2>
                        <p className="text-xl text-slate-500 font-light">
                            This verifies that
                        </p>
                    </div>

                    <div className="mb-10">
                        <h3 className="text-4xl font-bold text-slate-900 mb-2">
                            {studentName || "Demo Learner"}
                        </h3>
                        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-green-400 rounded-full mt-4"></div>
                    </div>

                    <div>
                        <p className="text-xl text-slate-500 font-light mb-2">
                            Has successfully mastered the professional curriculum for
                        </p>
                        <h4 className="text-3xl font-bold text-blue-700">
                            {courseName || "Course Name"}
                        </h4>
                    </div>
                </main>

                {/* --- FOOTER --- */}
                <footer className="px-16 pb-12 z-10 mt-auto flex justify-between items-end">
                    <div>
                        <p className="text-sm text-gray-400">Issued On: {date}</p>
                    </div>
                    <div className="text-right">
                        <div className="w-24 h-24 border-4 border-blue-100 rounded-full flex items-center justify-center text-blue-200">
                            Seal
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
});

// --- HELPER COMPONENTS ---

const UpRiseIcon = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="15" width="70" height="70" rx="15" fill="#2563EB" />
        <path d="M35 50 L50 65 L80 30" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default CertificatePreview;
