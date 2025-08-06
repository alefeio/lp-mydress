import { useState } from "react"

const faqs = [
  {
    q: "Nosso Acervo",
    a: [
      "Vestidos modernos, elegantes e sempre atualizados com as últimas tendências",
      "Modelos ideais para madrinhas, formandas e convidadas",
      "Peças selecionadas com foco em conforto, estilo e qualidade",
      "Todos os vestidos são bem conservados e prontos para fazer você se sentir incrível"
    ],
  },
  {
    q: "Atendimento Personalizado",
    a: [
      "Atendemos com horário agendado, garantindo exclusividade e atenção",
      "Recepção acolhedora e dedicada a entender seu gosto e necessidade",
      "Auxiliamos na escolha do vestido ideal com sensibilidade e bom gosto"
    ]
  },
  {
    q: "Experiência My Dress",
    a: [
      "Aqui, vestir bem é mais do que aparência: é cuidar do seu momento",
      "Acolhimento e confiança fazem parte da sua experiência do início ao fim",
      "Queremos que você se sinta confiante, linda e especial"
    ]
  }
]

export default function Header() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <aside className="mt-[2rem] mb-[4rem] md:my-[8rem] max-w-xs md:max-w-5xl mx-auto">
      <div id="empresa" className="w-['100%] md:flex gap-4 mx-auto">
        <div className="mx-auto mxd:mx-0 max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Seja única com a My Dress</h2>
          <p className="pb-4 text-gray-700">Na My Dress, você encontra mais do que vestidos — vive uma experiência completa, com estilo, cuidado e o melhor custo-benefício de Belém.</p>
          <p className="pb-4 text-gray-700">Somos especializados em aluguel de vestidos para madrinhas, formandas e ocasiões especiais, com peças atuais, elegantes e acessíveis. Cada detalhe da My Dress é pensado para valorizar sua beleza, seu momento e seu estilo único — sempre com atendimento acolhedor, qualidade impecável e preços que cabem no seu bolso.

          </p>
          {faqs.map((faq, idx) => (
            <div key={idx} className="mb-4 border-b border-primary/20">
              <button
                className="w-full flex justify-between items-center py-4 text-left font-semibold text-lg text-primary focus:outline-none"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                {faq.q}
                <span>{open === idx ? "−" : "+"}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open === idx ? "max-h-40" : "max-h-0"}`}>
                {faq.a.map((topic: string) => (<p className="px-2 pb-1 text-gray-700">{topic}</p>))}
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-xs rounded-xl mx-auto">
          <video
            src="/videos/institucional.mp4"
            muted
            controls
            width="100%"
            className="rounded-xl shadow-lg"
          >
            Seu navegador não suporta a reprodução de vídeos.
          </video>
        </div>
      </div>
    </aside>
  )
}