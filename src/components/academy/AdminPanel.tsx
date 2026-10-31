import React, { useState } from 'react';
import { Camera, User, BookOpen, AlertTriangle } from 'lucide-react';
import { soundEngine } from '../../utils/audio';

export const AdminPanel: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleGrant = async () => {
    try {
      const response = await fetch('/api/admin/grant-free-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, courseId, adminKey }),
      });
      if (response.ok) {
        setStatus('🎁 Access Granted Successfully.');
        soundEngine.playCamera();
      } else {
        setStatus('❌ Unauthorized Action.');
      }
    } catch {
      setStatus('❌ Server Error.');
    }
  };

  return (
    <div className="p-6 bg-[#06090E] border border-red-900/30 rounded-xl space-y-4">
      <h2 className="text-xl font-bold text-red-500 font-cinematic flex items-center gap-2">
        <AlertTriangle /> CREATOR GIVEAWAY PANEL
      </h2>
      <input
        type="text"
        placeholder="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        className="w-full p-2 bg-[#020305] border border-neutral-800 rounded font-mono text-xs"
      />
      <input
        type="text"
        placeholder="Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        className="w-full p-2 bg-[#020305] border border-neutral-800 rounded font-mono text-xs"
      />
      <input
        type="password"
        placeholder="Admin Secret"
        value={adminKey}
        onChange={(e) => setAdminKey(e.target.value)}
        className="w-full p-2 bg-[#020305] border border-neutral-800 rounded font-mono text-xs"
      />
      <button
        onClick={handleGrant}
        className="w-full bg-red-900/50 hover:bg-red-800 text-white font-bold p-3 rounded text-sm transition-all"
      >
        GRANT PREMIUM ACCESS
      </button>
      {status && <p className="text-xs font-mono text-neutral-400">{status}</p>}
    </div>
  );
};
