import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { ShieldCheck, ArrowLeft } from 'lucide-react'

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors gap-2">
        <ArrowLeft className="w-4 h-4" /> Înapoi la prima pagină
      </Link>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Politică de Confidențialitate (GDPR)</h1>
          <p className="text-sm text-slate-400">Ultima actualizare: 18 August 2026</p>
        </div>
      </div>

      <Card className="p-6 space-y-4 text-slate-300 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">1. Operatorul Datelor cu Caracter Personal</h2>
          <p>
            Operatorul responsabil pentru prelucrarea datelor cu caracter personal este{' '}
            <span className="font-semibold text-amber-400">[DENUMIRE_PERSOANĂ_JURIDICĂ_PLACEHOLDER]</span>. Contact DPO / Date: {' '}
            <span className="font-semibold text-amber-400">[EMAIL_DPO_PLACEHOLDER]</span>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">2. Date Colectate și Scopul Prelucrării</h2>
          <p>
            Colectăm exclusiv datele minimale necesare furnizării serviciului educațional: adresa de e-mail (pentru autentificare), progresul la lecții și istoricul de abonament. Nu colectăm CNP, adrese fizice inutile sau date sensibile.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">3. Retenția Datelor și Ștergerea Contului (Account Deletion)</h2>
          <p>
            Datele de cont sunt păstrate pe durata activității contului. Fiecare elev își poate șterge definitiv contul direct din secțiunea <strong>Setări Cont (`/settings`)</strong>. Ștergerea elimină în cascadă profilul, progresul și istoricul de învățare.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">4. Drepturile Persoanelor Vizate</h2>
          <p>
            Conform Regulamentului (UE) 2016/679 (GDPR), beneficiați de dreptul de acces, rectificare, ștergere ("dreptul de a fi uitat"), restricționare și portabilitate a datelor.
          </p>
        </section>
      </Card>
    </div>
  )
}
