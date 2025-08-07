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
  return (
    <>
      <Head>
        <title>MyDress - Aluguel de Vestidos em Belém</title>
        <meta name="description" content="Aluguel de vestidos para madrinhas, formandas e ocasiões especiais. Estilo, qualidade e preço justo em Belém." />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet" />
      </Head>

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
