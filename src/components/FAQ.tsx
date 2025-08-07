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
    <section id="faq" className="my-32 max-w-xs md:max-w-7xl mx-auto px-4">
      <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6 text-center">
        Perguntas Frequentes
      </h2>
      <p className="text-center mb-6 border-t-2 border-textcolor-200 py-6 w-fit m-auto">
        Confira as principais dúvidas de nossas clientes e saiba mais sobre o processo de aluguel de vestidos.
      </p>
      <div className="max-w-5xl mx-auto">
        {faqs.map((faq, idx) => (
          <div key={idx} className="mb-4 border-b border-background-1000/20 bg-background-100 px-4 rounded-xl">
            <button
              className="w-full flex justify-between items-center py-4 text-left font-semibold text-lg focus:outline-none"
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
              aria-controls={`faq-answer-${idx}`}
              id={`faq-question-${idx}`}
            >
              {faq.q}
              <span>{open === idx ? "−" : "+"}</span>
            </button>
            <div
              id={`faq-answer-${idx}`}
              role="region"
              aria-labelledby={`faq-question-${idx}`}
              className={`overflow-hidden transition-all duration-300 ${open === idx ? "max-h-40" : "max-h-0"
                }`}
            >
              <p className="px-2 pb-4">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}