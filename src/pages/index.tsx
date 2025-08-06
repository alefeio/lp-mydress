import HeroSlider from '../components/HeroSlider'
import WhatsAppButton from '../components/WhatsAppButton'
import DressesGallery from '../components/DressesGallery'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import LocationMap from '../components/LocationMap'
import Header from 'components/Header'
import { Menu } from 'components/Menu'
import Head from 'next/head'

export default function Home() {
  return (
    <html lang="pt-BR">
      <Head>
        {/* Script do Google Ads */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17411208522"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17411208522');
            `,
          }}
        />
        {/* Pixel Facebook Ads */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              `!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '754061187167582');
          fbq('track', 'PageView');
          `,
          }}>
        </script>
        <noscript dangerouslySetInnerHTML={{
          __html:
            `<img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=754061187167582&ev=PageView&noscript=1"
          />
              `,
        }}></noscript>
      </Head>
      <body>
        <div className="min-h-screen font-sans">
          <Menu />
          <HeroSlider />
          <div className="max-w-7xl mx-auto">
            <Header />
            <DressesGallery />
            <Testimonials />
            <FAQ />
            <LocationMap />
          </div>
          <WhatsAppButton />
        </div>
      </body>
    </html>
  )
}