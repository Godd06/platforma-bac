import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Mail, MapPin, Phone, ArrowLeft, Building2 } from 'lucide-react'

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors gap-2">
        <ArrowLeft className="w-4 h-4" /> Înapoi la prima pagină
      </Link>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
          <Building2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Contact & Identitate Legală</h1>
          <p className="text-sm text-slate-400">Informații oficiale de contact</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" /> Date Companie
          </h2>
          <div className="space-y-3 text-sm text-slate-300">
            <div>
              <span className="text-xs font-semibold text-slate-400 block uppercase">Denumire Firmă</span>
              <span className="font-medium text-amber-400">[DENUMIRE_PERSOANĂ_JURIDICĂ_PLACEHOLDER]</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block uppercase">Cod Unic de Înregistrare</span>
              <span className="font-medium text-amber-400">[CUI_CIF_PLACEHOLDER]</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block uppercase">Nr. Reg. Comertului</span>
              <span className="font-medium text-amber-400">[NR_REGISTRUL_COMERŢULUI_PLACEHOLDER]</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-400" /> Suport și Asistență Elevi
          </h2>
          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-emerald-400">[EMAIL_SUPORT_PLACEHOLDER]</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-emerald-400">[TELEFON_SUPORT_PLACEHOLDER]</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-300">[ADRESĂ_SEDIU_SOCIAL_PLACEHOLDER]</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
