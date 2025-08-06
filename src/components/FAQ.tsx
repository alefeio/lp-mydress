import { useState } from "react"

const faqs = [
  {
    q: "Quais tamanhos de vestidos vocês oferecem?",
    a: "Temos vestidos do tamanho 36 ao 52, com ajustes inclusos para melhor caimento.",
  },
  {
    q: "Preciso reservar com antecedência?",
    a: "Sim, recomendamos reservar o quanto antes para garantir o modelo desejado.",
  },
  {
    q: "Os vestidos já vêm limpos?",
    a: "Sim! Todos os vestidos passam por higienização profissional antes de cada aluguel.",
  },
  {
    q: "Como funciona a retirada e devolução?",
    a: "A retirada é feita na loja em Belém-PA, e a devolução deve ser feita até o próximo dia útil após o evento.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" className="mt-[2rem] mb-[4rem] md:my-[8rem] max-w-xs md:max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">Perguntas Frequentes</h2>
      <div className="max-w-5xl mx-auto">
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
              <p className="px-2 pb-4 text-gray-700">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}