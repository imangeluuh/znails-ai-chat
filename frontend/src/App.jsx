import { Button } from '@/components/ui/button'
import { ArrowDown, Heart, Star } from 'lucide-react'
import { ChatWidget } from "@/components/ChatWidget";
import znails from "./assets/znails.jpg";

// Swap these placeholder src values for real assets when they're ready.
// Keeping them centralized here makes that a one-line change per asset.
const PLACEHOLDER = {
  // Full-page textured background (the nail-illustration pattern that shows
  // through on the left/right margins behind every section).
  background:
    'https://placehold.co/1900x3200/8a7686/8a7686?text=',
  ownerPhoto: 'https://placehold.co/700x900/2f2a30/e8dde2?text=Owner+Photo',
  certTraining:
    'https://placehold.co/1000x750/faf3f0/8a7267?text=Training+Certificate',
  certBusiness:
    'https://placehold.co/1000x900/faf3f0/8a7267?text=Business+Registration',
  // Price list and policy are single flat graphics in the original design,
  // not live HTML content, so they're placeholders like the certificates.
  priceList:
    'https://placehold.co/900x1100/f6e4e4/5c4536?text=Price+List+Graphic',
  policy:
    'https://placehold.co/900x1000/e7c9cf/3f383d?text=Policy+Graphic',
}

function SiteButton({ href, children, icon: Icon, external }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="inline-flex h-16 w-60 items-center justify-start gap-2 border-4 border-white pl-6 pr-8 font-sans text-xs font-normal uppercase tracking-[0.4rem] text-white transition-transform hover:scale-105"
    >
      <span className="flex-1 overflow-hidden text-left">{children}</span>
      <Icon className="h-6 w-6 flex-none" />
    </a>
  )
}

function Divider() {
  return <hr className="h-[9px] w-full border-0 bg-[#7D6666]" />
}

function RoseSection({ children, id, className = '' }) {
  return (
    <section
    id={id}
    className={`flex w-full items-center justify-center from-blush-200 to-blush-500 px-8 py-10 sm:px-16 ${className}`}
    >
      <div className="mx-auto w-full max-w-[60rem]">{children}</div>
    </section>
  )
}

function DarkSection({ children, id, className = '' }) {
  return (
    <section
      id={id}
      className={`w-full bg-[#141417]/[0.478] px-8 py-16 backdrop-blur-md sm:px-24 ${className}`}
    >
      <div className="mx-6 my-16 w-full">{children}</div>
    </section>
  )
}

export default function App() {
  return (
    // The background image sits absolutely behind all content, sized to
    // this wrapper's natural height (set by the normal-flow content below),
    // so it stretches to cover the whole page, not just the viewport.
    <div className="relative min-h-scree">
       {/* Full-page background, matching the source's body::before stack
          (top to bottom): a repeating noise texture, a flat ~55%-opacity
          pink tint, then the photo itself — over a solid fallback color. */}
      <div className="fixed inset-0 -z-10 bg-[#D690D3]">
        <img
          src="https://ik.imagekit.io/2dlwunuki/bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#f7bce3] opacity-[0.549]" />
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "url('data:image/svg+xml;charset=utf8,%3Csvg%20viewBox%3D%220%200%20512%20512%22%20width%3D%22512%22%20height%3D%22512%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%20%3Cfilter%20id%3D%22noise%22%3E%20%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.875%22%20result%3D%22noise%22%20%2F%3E%20%3CfeColorMatrix%20type%3D%22matrix%22%20values%3D%220.10546875%200%200%200%200%200%200.109375%200%200%200%200%200%200.16015625%200%200%200%200%200%200.5859375%200%22%20%2F%3E%20%3C%2Ffilter%3E%20%3Crect%20filter%3D%22url%28%23noise%29%22%20x%3D%220%22%20y%3D%220%22%20width%3D%22512%22%20height%3D%22512%22%20fill%3D%22transparent%22%20opacity%3D%221%22%20%2F%3E%3C%2Fsvg%3E')",
            backgroundSize: '512px',
            backgroundRepeat: 'repeat',
          }}
        />
      </div>

      {/* Centered content column — the background shows through in the
          margins on either side of this, at every section, matching the
          original layout. */}
      <div className="relative mx-auto">
        {/* Hero */}
        <RoseSection className="max-w-[1500px] mx-auto bg-gradient-to-r">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <img
              src={znails}
              alt="Z Nails logo"
              className="mx-auto w-full max-w-sm rounded-full border border-white p-2"
            />
            <div className="text-center md:text-left">
              <h1 className="font-display text-4xl uppercase tracking-[1.075rem] text-white sm:text-5xl">
                Z Nails
              </h1>
              <p className="mt-8 font-serif text-2xl uppercase italic tracking-[0.325rem] text-black">
                Get your shine on ✨
              </p>
              <div className="mt-12 flex justify-center md:justify-start">
                <SiteButton href="#about" icon={ArrowDown}>
                  Go here
                </SiteButton>
              </div>
            </div>
          </div>
        </RoseSection>

        {/* About */}
        <DarkSection id="about">
          <div className="grid grid-cols-1 gap-24 md:grid-cols-2">
            <img
              src="https://ik.imagekit.io/2dlwunuki/cz.jpg"
              alt="Owner portrait"
              className="w-auto object-cover"
            />
            <div className="text-white">
              <h2 className="font-display text-2xl uppercase tracking-[0.5rem] sm:text-3xl">
                by CZ
              </h2>
              <div className="mt-8 space-y-6 font-serif text-lg uppercase italic tracking-[0.325rem]">
                <p>About Me:</p>
                <p>
                  Name: Christinne Zaldua (chris)
                  <br />
                  Contact: 09985120013
                  <br />
                  Location: Classica Northgate, SJDM Bulacan
                </p>
                <p>Pin: Z Nails</p>
              </div>
            </div>
          </div>
        </DarkSection>

        <div className="mx-auto my-12 max-w-[1500px] md:px-32"> 
          <Divider />
        </div>

        {/* Certificates */}
        <RoseSection className="max-w-[1500px] mx-auto bg-linear-to-tr" id="certificates">
          <div className="flex flex-col items-center gap-8">
            <img
              src="https://ik.imagekit.io/2dlwunuki/coc.jpg"
              alt="Nail training certificate"
              className="w-full shadow-lg"
            />
            <img
              src="https://ik.imagekit.io/2dlwunuki/bir.jpg"
              alt="Business registration certificate"
              className="w-full shadow-lg"
            />
            <SiteButton href="#services" icon={Heart}>
              Services
            </SiteButton>
          </div>
        </RoseSection>

        <div className="mx-auto my-12 max-w-[1500px] md:px-32"> 
          <Divider />
        </div>

        {/* Price list */}
        <div id="services" className="w-full">
          <DarkSection>
            <div className="mx-auto flex max-w-2xl flex-col items-end gap-6">
              <SiteButton href="#policy" icon={Star}>
                Policy
              </SiteButton>
              <img
                src="https://ik.imagekit.io/2dlwunuki/services.jpg"
                alt="Z Nails price list"
                className="w-full shadow-lg"
              />
            </div>
          </DarkSection>
        </div>

        {/* Policy */}
        <RoseSection className="max-w-[1500px] mx-auto bg-linear-to-tr" id="policy">
          <div className="flex flex-col items-center gap-8">
            <img
              src="https://ik.imagekit.io/2dlwunuki/policies.jpg"
              alt="Z Nails booking policy"
              className="w-full shadow-lg"
            />
            <SiteButton href="#section07" icon={Star}>
              DP
            </SiteButton>
            <Divider />
          </div>
        </RoseSection>

        {/* Footer */}
        <footer className="my-14 px-6 py-10 text-center text-white sm:px-12">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-sm sm:flex-row sm:justify-between">
            
          </div>
        </footer>
      </div>
      <ChatWidget />
    </div>
  )
}
