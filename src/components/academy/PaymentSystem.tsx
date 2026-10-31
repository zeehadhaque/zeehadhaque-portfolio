import React, { useState } from 'react';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';

export const PaymentSystem: React.FC = () => {
    const [status, setStatus] = useState<'PENDING' | 'VERIFIED' | 'REJECTED'>('PENDING');

    return (
        <div className="p-6 bg-[#06090E] border border-[#102B45] rounded-xl space-y-4">
            <h2 className="text-xl font-bold text-white font-cinematic flex items-center gap-2">
                <CreditCard className="text-cyan-400" /> PREMIUM ENROLLMENT
            </h2>
            <div className="text-xs text-neutral-400 space-y-2">
                <p>bKash: 01629851155</p>
                <p>Nagad: 01629851155</p>
                <p>Rocket: 01629851155</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
                {status === 'PENDING' && <Clock className="text-amber-400 w-4 h-4" />}
                {status === 'VERIFIED' && <CheckCircle className="text-emerald-400 w-4 h-4" />}
                Status: {status}
            </div>
            <button className="w-full bg-[#102B45] text-white p-2 rounded text-xs font-mono">
                SUBMIT TRANSACTION REFERENCE
            </button>
        </div>
    );
};
