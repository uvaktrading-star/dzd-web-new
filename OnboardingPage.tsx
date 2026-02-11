
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Check, Smartphone, ArrowRight } from 'lucide-react';

export default function OnboardingPage({ user, onComplete }: any) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ fullName: user?.name || '', platform: 'tiktok', goal: 'awareness' });
  const navigate = useNavigate();

  if (!user) return <Navigate to="/signup" />;

  const handleFinish = () => {
    onComplete(formData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-dark pt-32">
      <div className="max-w-xl w-full">
        <div className="mb-12 flex justify-between items-center px-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${s <= step ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
              {s < step ? <Check size={18} /> : s}
            </div>
          ))}
        </div>
        <div className="glass p-10 rounded-[3.5rem] shadow-2xl animate-scale-in">
          {step === 1 && (
            <div>
              <h2 className="text-4xl font-black mb-4 text-slate-900 dark:text-white">Your Name?</h2>
              <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl py-5 px-6 text-xl font-bold focus:border-blue-600 outline-none" placeholder="Enter name..." />
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-4xl font-black mb-10 text-slate-900 dark:text-white">Main Platform?</h2>
              <div className="grid grid-cols-3 gap-4">
                {['tiktok', 'instagram', 'facebook'].map(p => (
                  <button key={p} onClick={() => setFormData({...formData, platform: p})} className={`p-6 rounded-3xl border ${formData.platform === p ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10'}`}>
                    <Smartphone size={32} className="mx-auto mb-2" />
                    <span className="font-black text-xs uppercase">{p}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 className="text-4xl font-black mb-10 text-slate-900 dark:text-white">What's the Goal?</h2>
              <div className="space-y-4">
                {['Awareness', 'Sales', 'Engagement'].map(g => (
                  <button key={g} onClick={() => setFormData({...formData, goal: g.toLowerCase()})} className={`w-full text-left p-6 rounded-3xl border ${formData.goal === g.toLowerCase() ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10'}`}>
                    <p className="font-black text-xl">{g}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-12 flex justify-between">
            {step > 1 && <button onClick={() => setStep(step - 1)} className="font-black text-slate-400">Back</button>}
            <button onClick={() => step < 3 ? setStep(step+1) : handleFinish()} className="ml-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black shadow-xl flex items-center gap-2">
              {step === 3 ? 'Finish' : 'Next'} <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
