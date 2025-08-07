import Head from 'next/head'
import Script from 'next/script'
import HeroSlider from '../components/HeroSlider'
import WhatsAppButton from '../components/WhatsAppButton'
import DressesGallery from '../components/DressesGallery'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import LocationMap from '../components/LocationMap'
import Header from 'components/Header'
import { Menu } from 'components/Menu'
import Hero from 'components/Hero'

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Dresses Belém",
    "image": "https://www.mydressbelem.com.br/images/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Passagem Tapajós 6, Tv. da Estrela, 46, Marco",
      "addressLocality": "Belém",
      "addressRegion": "PA",
      "postalCode": "66093-065",
      "addressCountry": "BR"
    }
  };

  return (
    <>
      <Head>
        <title>MyDress Belém | Aluguel de Vestidos de Festa para Madrinhas, Formandas e Convidadas | O melhor custo-benefício</title>
        <meta name="description" content="Aluguel de vestidos de festa em Belém‑PA: madrinhas, formandas, convidadas. Atendimento por agendamento, atendimento personalizado, catálogo atualizado, agende via WhatsApp 91 98581-0208." />
        <meta name="keywords" content="aluguel vestidos festa Belém, aluguel vestidos madrinhas Belém, vestidos formatura Belém, aluguel vestidos convidadas Belém, MyDress Belém, aluguel de trajes finos em belém, aluguel de vestidos de festa belem, aluguel de vestidos de gala belem, aluguel de vestidos de festa para madrinhas belem, aluguel de vestidos de festa para formandas belem, aluguel de vestidos de festa para convidadas belem, loja de aluguel de vestido belem, mydress, vestidos de debutantes, vestidos de festa, aluguel de roupas pedreira, aluguel de roupas marco, aluguel de roupas são brás, aluguel de roupas são braz, aluguel de roupas nazaré, aluguel de roupas umarizal, aluguel de roupas, aluguel roupa festa, aluguel vestidos festa luxo, vestido para alugar" />
        <meta property="og:title" content="MyDress Belém | Aluguel de Vestidos de Festa" />
        <meta property="og:description" content="Aluguel de vestidos elegantes para madrinhas, formandas e convidadas em Belém‑PA. Atendimento exclusivo por agendamento via WhatsApp." />
        <meta property="og:image" content="https://www.mydressbelem.com.br/images/banner/banner1.jpg" />
        <meta property="og:url" content="https://www.mydressbelem.com.br" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MyDress Belém | Aluguel de Vestidos de Festa" />
        <meta name="twitter:description" content="Aluguel de vestidos elegantes em Belém‑PA. Atendimento por agendamento via WhatsApp." />
        <meta name="twitter:image" content="https://www.mydressbelem.com.br/images/banner/banner1.jpg" />

        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Google Ads */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-17411208522"
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17411208522');
        `}
      </Script>

      {/* Facebook Pixel */}
      <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){
            n.callMethod ?
            n.callMethod.apply(n,arguments) : n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;
          n.push=n; n.loaded=!0; n.version='2.0';
          n.queue=[]; t=b.createElement(e); t.async=!0;
          t.src=v; s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}
          (window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '754061187167582');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=754061187167582&ev=PageView&noscript=1"
          alt="Facebook Pixel"
        />
      </noscript>

      <div className="min-h-screen font-sans">
        <Menu />
        <HeroSlider />
        <main className="max-w-7xl mx-auto">
          <Hero />
          <DressesGallery />
          <Header />
          <Testimonials />
          <FAQ />
          <LocationMap />
        </main>
        <WhatsAppButton />
      </div>
    </>
  )
}
