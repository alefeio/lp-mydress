const testimonials = [
    {
        name: "Siqueira Coutinho",
        text: "Ambiente maravilhoso e aconchegante, tudo muito organizado, roupas cheirosas e bem cuidadas, atendimento nota mil, com certeza voltarei futuramente.",
    },
    {
        name: "willianni Santos",
        text: "O espaço, os vestidos, o atendimento, tudo incrível 😍",
    },
    {
        name: "Patricia Pantoja Evoluir",
        text: "Local incrível, com atendimento impecável! O look um mais lindo que o outro 🥰",
    },
    {
        name: "Lorena Honorato",
        text: "Atendimento maravilhoso desde a primeira visita até a devolução. As meninas são muito atenciosas, os vestidos são lindos, e é perceptível o cuidado com as peças e a busca por trazer novos modelos às clientes. Indico para qualquer amiga.",
    },
    {
        name: "Fabíola Luz",
        text: "Ótimo atendimento! Loja muito bonita e acolhedora. Vestidos em ótimos estados.",
    },
    {
        name: "Raíza Reis",
        text: "Atendimento maravilhoso",
    },
    {
        name: "Izabele Matos",
        text: "Excelente atendimento. Moças muito educadas e solícitas, além de lindas opções de vestidos",
    },
    {
        name: "Jorge Silva",
        text: "Loja excelente. Visitei com minha esposa e filha. Vestidos novos, bom preço e excelente atendimento. Obrigado às proprietárias.",
    },
    {
        name: "Giuliana Galdino",
        text: "Que loja incrível! Espaço perfeito, bom atendimento, vestidos em ótimo estado, ótimos preços para aluguel, provadores confortáveis e boa localização. Ainda ganhei uma bolsa de brinde, para usar com o vestido.",
    },
]

export default function Testimonials() {
    return (
        <>
            <div id="depoimentos">&nbsp;</div>
            <section
                className="my-16 max-w-xs md:max-w-5xl mx-auto px-4"
            >
                <h3 className="font-serif text-2xl md:text-3xl font-bold mb-6 text-center">
                    Depoimentos
                </h3>
                <p className="text-center mb-6 border-t-2 border-textcolor-200 py-6 w-fit m-auto">
                    Já é nossa cliente?{" "}
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://g.page/r/CSDAOXMfoxIIEBM/review"
                        className="text-textcolor-600 underline hover:text-textcolor-800 transition-colors"
                    >
                        Conte-nos como foi sua experiência
                    </a>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((t, idx) => (
                        <article
                            key={idx}
                            className="bg-background-100 rounded-xl shadow-lg p-6"
                            aria-label={`Depoimento de ${t.name}`}
                        >
                            <p className="text-lg italic mb-4 text-textcolor-700">"{t.text}"</p>
                            <span className="block text-right font-semibold text-textcolor-800">{t.name}</span>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}