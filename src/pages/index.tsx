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