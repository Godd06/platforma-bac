import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { CreditCard, ArrowLeft } from 'lucide-react'

export const SubscriptionTermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors gap-2">
        <ArrowLeft className="w-4 h-4" /> Înapoi la prima pagină
      </Link>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Termeni Abonament, Retragere & Anulare</h1>
          <p className="text-sm text-slate-400">Ultima actualizare: 18 August 2026</p>
        </div>
      </div>

      <Card className="p-6 space-y-4 text-slate-300 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">1. Modalități de Plată și Facturare</h2>
          <p>
            Plățile pentru abonamentele PRO sunt procesate în siguranță prin Stripe. Facturile se emit automat după procesarea plății și se transmit pe e-mail.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">2. Politică de Anulare Abonament (Subscription Cancellation)</h2>
          <p>
            Vă puteți anula abonamentul în orice moment direct din contul de elev (`/settings`) sau accesând Stripe Customer Portal. Accesul PRO rămâne activ până la finalul perioadei deja achitate (`current_period_end`).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">3. Dreptul de Retragere (Rambursare / Refund)</h2>
          <p>
            Conform OUG 34/2014 privind drepturile consumatorilor, aveți dreptul de a vă retrage dintr-un contract la distanță în termen de 14 zile calendaristice, fără justificarea motivului, cu condiția să nu fi accesat mai mult de 2 lecții din conținutul digital protejat PRO.
          </p>
        </section>
      </Card>
    </div>
  )
}
