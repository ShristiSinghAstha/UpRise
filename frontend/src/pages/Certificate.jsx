import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { Loader2, Download, CheckCircle, Share2, Home, ArrowLeft } from 'lucide-react';
import { jsPDF } from 'jspdf';
import CertificatePreview from '../components/CertificatePreview';

const Certificate = () => {
    const { courseId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [certificate, setCertificate] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const certificateRef = useRef(null);

    const [courseName, setCourseName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Course Details to ensure we have the correct Title
            try {
                const courseRes = await api.get(`/courses/${courseId}`);
                if (courseRes.data && courseRes.data.title) {
                    setCourseName(courseRes.data.title);
                }
            } catch (error) {
                console.error("Failed to fetch course details", error);
            }

            // Option 1: Passed via navigation state (e.g. from Quiz)
            if (location.state?.certificate) {
                setCertificate(location.state.certificate);
                setLoading(false);
                return;
            }

            // Option 2: Fetch from backend using courseId (get valid certificate for this user/course)
            try {
                // We need an endpoint to get certificate by courseId for current user
                // Using the 'my' endpoint and filtering, or if backend supports it.
                // Alternatively, 'generate' might return existing if 409, but let's try to find it.
                const response = await api.get('/certificates/my');
                const myCerts = response.data.data;
                const match = myCerts.find(c => c.courseId === courseId);

                if (match) {
                    setCertificate(match);
                } else {
                    // Redirect if no certificate found
                    console.warn("No certificate found for this course");
                    navigate(`/course/${courseId}`);
                }
            } catch (error) {
                console.error("Failed to fetch certificate", error);
                navigate(`/course/${courseId}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, location.state, navigate]);

    const handleDownload = () => {
        setDownloading(true);

        try {
            const pdf = new jsPDF('l', 'px', 'a4');
            const width = pdf.internal.pageSize.getWidth();

            // Simple PDF generation replicating the HTML structure vaguely
            // For better results, one might use html2canvas + jsPDF, but text-based is robust.

            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, width, pdf.internal.pageSize.getHeight(), 'F');

            // Background / Border
            pdf.setDrawColor(37, 99, 235); // Blue
            pdf.setLineWidth(5);
            pdf.rect(20, 20, width - 40, pdf.internal.pageSize.getHeight() - 40);

            pdf.setFontSize(30);
            pdf.setTextColor(30, 41, 59);
            pdf.text('Certificate of Completion', width / 2, 100, { align: 'center' });

            pdf.setFontSize(16);
            pdf.setTextColor(100, 116, 139);
            pdf.text('This verifies that', width / 2, 140, { align: 'center' });

            pdf.setFontSize(26);
            pdf.setTextColor(30, 41, 59);
            // Use certificate data or fallback
            // Note: studentName isn't always in certificate model (it has userId). 
            // We might need to fetch user profile or use pass-in state.
            // Let's rely on what we have. If certificate has no name, we might show "Student".
            const studentName = certificate?.userId?.username || certificate?.studentName || location.state?.studentName || "UpRise Student";
            pdf.text(studentName, width / 2, 180, { align: 'center' });

            pdf.setFontSize(16);
            pdf.setTextColor(100, 116, 139);
            pdf.text('Has successfully completed the course', width / 2, 220, { align: 'center' });

            pdf.setFontSize(24);
            pdf.setTextColor(29, 78, 216); // Blue 700
            pdf.text(courseName || certificate?.courseName || "Course", width / 2, 260, { align: 'center' });

            pdf.setFontSize(12);
            pdf.setTextColor(148, 163, 184);
            const dateStr = certificate?.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString() : new Date().toLocaleDateString();
            pdf.text(`Issued On: ${dateStr}`, width / 2, 350, { align: 'center' });
            pdf.text(`ID: ${certificate?.certificateId || 'N/A'}`, width / 2, 370, { align: 'center' });

            pdf.save(`UpRise_Certificate_${courseId}.pdf`);
        } catch (err) {
            console.error('PDF generation failed', err);
            alert('Failed to download certificate');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <h2 className="text-xl font-bold">Loading Certificate...</h2>
            </div>
        );
    }

    if (!certificate) return null;

    // Use name from backend certificate data (persisted studentName) or populated userId, or fallback
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const studentName = certificate?.studentName || certificate?.userId?.username || storedUser.username || "Student";

    return (
        <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col items-center font-sans">
            <div className="max-w-5xl w-full">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate(`/course/${courseId}`)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} /> Back to Course
                    </button>
                    <div className="flex gap-4">
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg transition-all disabled:opacity-50"
                        >
                            {downloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                            {downloading ? 'Downloading...' : 'Download PDF'}
                        </button>
                    </div>
                </div>

                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-4 bg-green-500/20 text-green-400 rounded-full mb-4 ring-1 ring-green-500/50">
                        <CheckCircle size={40} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Calculated Success!</h1>
                    <p className="text-gray-400">You have officially completed the course.</p>
                </div>

                {/* VISUAL PREVIEW */}
                <div className="flex justify-center mb-12 overflow-x-auto">
                    <CertificatePreview
                        ref={certificateRef}
                        studentName={studentName}
                        courseName={courseName || certificate.courseName}
                        date={new Date(certificate.issuedAt).toLocaleDateString()}
                    />
                </div>
            </div>
        </div>
    );
};

export default Certificate;
