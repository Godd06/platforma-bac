import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { FileText, ArrowLeft } from 'lucide-react'

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to="/" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors gap-2">
        <ArrowLeft className="w-4 h-4" /> Înapoi la prima pagină
      </Link>

      <div className="flex items-center gap-3">
        <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Termeni și Condiții de Utilizare</h1>
          <p className="text-sm text-slate-400">Ultima actualizare: 18 August 2026</p>
        </div>
      </div>

      <Card className="p-6 space-y-4 text-slate-300 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">1. Identitatea Legală a Operatorului</h2>
          <p>
            Platforma de pregătire pentru Examenul de Bacalaureat (platforma-bac.ro) este operată de{' '}
            <span className="font-semibold text-amber-400">[DENUMIRE_PERSOANĂ_JURIDICĂ_PLACEHOLDER]</span>, cu sediul în{' '}
            <span className="font-semibold text-amber-400">[ADRESĂ_SEDIU_SOCIAL_PLACEHOLDER]</span>, înregistrată la Registrul Comerțului sub nr.{' '}
            <span className="font-semibold text-amber-400">[NR_REGISTRUL_COMERŢULUI_PLACEHOLDER]</span>, CUI/CIF{' '}
            <span className="font-semibold text-amber-400">[CUI_CIF_PLACEHOLDER]</span>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">2. Acceptarea Termenilor</h2>
          <p>
            Prin accesarea și utilizarea acestei platforme, confirmați că ați citit, înțeles și acceptat acești termeni. Dacă nu sunteți de acord, te rugăm să nu utilizați serviciile noastre.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">3. Drepturi de Autor și Licențiere Conținut</h2>
          <p>
            Toate materialele didactice (texte, sinteze, fișe de lucru, grile, structuri media) aparțin de drept platformei și sunt protejate de Legea 8/1996 privind dreptul de autor. Este strict interzisă distribuirea sau copierea neautorizată.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">4. Accesul la Conținutul PRO și Încheierea Contractului</h2>
          <p>
            Accesul la lecțiile marcate PRO se efectuează pe bază de abonament recurent sau achiziție unică conform tarifelor afișate pe pagina de Checkout.
          </p>
        </section>
      </Card>
    </div>
  )
}
