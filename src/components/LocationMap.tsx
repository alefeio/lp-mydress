export default function LocationMap() {
    return (
        <section id="localizacao" className="mt-[2rem] mb-[4rem] md:my-[8rem] max-w-xs md:max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-3xl font-bold text-primary mb-6 text-center">Onde Estamos</h2>
            <div className="flex flex-col items-center">
                <div className="w-full h-72 rounded-xl overflow-hidden shadow mb-4">
                    <iframe
                        title="MyDress Belém"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.565129800439!2d-48.463246!3d-1.4360878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92a48d5e3c198ee5%3A0x812a31f7339c020!2sMy%20Dress%20-%20Aluguel%20de%20Vestidos!5e0!3m2!1spt-BR!2sbr!4v1754475609294!5m2!1spt-BR!2sbr"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
                <address className="not-italic text-center text-lg text-gray-700">
                    Ps Tapajós - Tv. da Estrella, 46 - Marco, Belém - PA, 66093-065<br />
                    <span className="text-primary font-semibold">
                        <a target="_blank" href="https://wa.me//5591985810208?text=Gostaria de mais informações. Estou entrando em contato através do site.">
                            WhatsApp: (91) 98581-0208
                        </a>
                    </span>
                </address>
            </div>
        </section>
    )
}