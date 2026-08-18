import { Shield, X } from 'lucide-react';
import { Button } from './ui';

export function PopiaModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal-300/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-scale-in rounded-3xl bg-champagne-50 p-7 shadow-soft-lg dark:bg-charcoal-200 border border-bisque-300/50 dark:border-charcoal-50/30">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1.5 text-charcoal-300/60 hover:bg-bisque-200/60 dark:text-champagne-100/60 dark:hover:bg-charcoal-50/30"><X size={18} /></button>
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-thyme-500 text-white"><Shield size={20} /></span>
          <div>
            <h2 className="font-serif text-2xl font-semibold leading-none text-charcoal-300 dark:text-champagne-100">Your Privacy, Protected</h2>
            <p className="text-xs text-charcoal-300/60 dark:text-champagne-100/50">POPIA — Protection of Personal Information Act</p>
          </div>
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-charcoal-300/80 dark:text-champagne-100/70">
          <p>Bantu Connect is committed to safeguarding your personal information in line with South Africa's Protection of Personal Information Act (POPIA, Act 4 of 2013).</p>
          <ul className="space-y-2">
            <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" /><span>We only collect what's needed to connect you with beauty professionals — your name, contact details and preferred categories.</span></li>
            <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" /><span>Your phone number is used solely to generate WhatsApp booking links and is never sold to third parties.</span></li>
            <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" /><span>You may request access to, correction of, or deletion of your data at any time by emailing <span className="font-semibold">privacy@bantuconnect.co.za</span>.</span></li>
            <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" /><span>AI-assisted content tools only process the text you provide and do not store your inputs after generation.</span></li>
          </ul>
        </div>
        <div className="mt-5 flex justify-end"><Button onClick={onClose}>I understand</Button></div>
      </div>
    </div>
  );
}
