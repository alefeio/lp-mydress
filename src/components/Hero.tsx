export default function Hero() {
  return (
    <header className="mt-[4.7rem] md:mt-[7.1rem] mb-32 text-center max-w-xs md:max-w-7xl mx-auto">
      <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">
        Alugue seu vestido na MyDress
      </h1>
      <p className="px-2 mb-2 border-t-2 border-textcolor-200 mb-4 pb-2 w-fit m-auto pt-6">
        <strong>Na MyDress</strong>, você encontra muito mais do que uma vitrine física — <strong>temos um catálogo digital completo e sempre atualizado</strong>.
      </p>
      <p className="px-2 mb-6">
        Aqui você pode <strong>visualizar os modelos disponíveis, explorar por cores, tamanhos e estilos</strong> antes mesmo de vir até a loja.
      </p>
      <a
        href="https://wa.me//5591985810208?text='Olá! Gostaria de agendar uma visita.'"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center mx-auto my-6 bg-background-300 hover:bg-background-200 rounded-full shadow-lg py-3 px-8 font-bold text-lg transition-colors duration-300"
      >
        Agende uma Visita
      </a>
    </header>
  )
}