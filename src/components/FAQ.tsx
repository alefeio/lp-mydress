import { useState } from "react"

const faqs = [
  {
    q: "Como funciona o aluguel de vestidos na My Dress?",
    a: "O processo é bem simples: você agenda uma visita em nosso espaço, experimenta os modelos disponíveis e escolhe o seu favorito. O vestido é reservado para a data do seu evento, e você retira próximo ao dia. Após o uso, é só devolver - a lavagem está incluída no serviço.",
  },
  {
    q: "Preciso agendar para experimentar os vestidos?",
    a: "Sim! Atendemos exclusivamente com hora marcada, para garantir um atendimento personalizado e tranquilo. Clique aqui para escolher o melhor horário para você.",
  },
  {
    q: "Com quantos dias de antecedência posso reservar meu vestido?",
    a: "As reservas podem ser feitas com até 40 dias de antecedência do seu evento. Optamos por esse período, para maior segurança para você, por se tratar de trajes alugáveis. Mas você pode agendar uma visita antes e conhecer pessoalmente nosso acervo, além do catálogo.",
  },
  {
    q: "Quais tipos de vestidos vocês alugam?",
    a: "Trabalhamos com vestidos para formaturas, casamentos (madrinhas e convidadas), aniversários, festas de gala e eventos especiais.)",
  },
  {
    q: "O que está incluído no valor do aluguel?",
    a: "O valor do aluguel inclui locação do vestido, higienização completa do traje e ajustes necessários.",
  },
  {
    q: "Vocês fazem ajustes no vestido?",
    a: "Sim! Fazemos ajustes simples como barra e alça, para que o vestido fique perfeito no seu corpo. Os ajustes são verificados na semana do evento.",
  },
  {
    q: "E se eu sujar ou danificar o vestido?",
    a: `Manchas comuns de uso já estão previstas e cobertas pela lavagem. Taxa extra de lavagem: A lavanderia não cobre o excesso de sujeira na barra ou manchas no tecido, necessitando de lavagem especial. Danos graves como rasgos, queimaduras ou perdas serão analisadas caso a caso.`,
  },
  {
    q: "Quais são as formas de pagamento disponíveis?",
    a: `Pix, dinhheiro ou cartão. No crédito há um pequeno acréscimo da máquina. Parcelamos em até 3x.`,
  },
  {
    q: "Sempre tem novidades?",
    a: `Sim! Nosso catálogo está sempre atualizando. Todo mês tem vestidos novos chegando.`,
  },
  {
    q: "O atendimento é somente por agendamento mesmo?",
    a: `Sim! Pois dessa forma conseguimos realizar um atendimento tranquilo e personalizado para cada cliente.`,
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <>
      <div id="faq">&nbsp;</div>
      <section className="my-16 max-w-xs md:max-w-7xl mx-auto px-4">
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
    </>
  )
}