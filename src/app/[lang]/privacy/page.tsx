import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { getSettings } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "om" ? "Imaammata Dhuunfaa" : "Privacy Policy",
    alternates: { canonical: `/${lang}/privacy` },
  };
}

type Section = { title: string; body: string[] };

const copy = (email: string, name: string): Record<Locale, { title: string; updated: string; sections: Section[] }> => ({
  en: {
    title: "Privacy Policy",
    updated: "Last updated: November 2026",
    sections: [
      {
        title: "Who we are",
        body: [`${name} (“we”, “us”) is a travel agency in Ethiopia offering Umrah packages, flight tickets, hotel bookings and guided tours. This page explains what personal information we collect through this website and how we use it.`],
      },
      {
        title: "What we collect",
        body: [
          "Only what you type into our forms: your name, e-mail address, phone number, the package you are interested in, number of travelers, preferred travel dates and your message. If you subscribe to our newsletter, we collect your e-mail address.",
          "We do not ask for passport numbers or payment card details through this website.",
        ],
      },
      {
        title: "How we use it",
        body: [
          "To reply to your enquiry, prepare a quotation, arrange your booking and, if you subscribed, send you travel offers. We do not sell your information.",
        ],
      },
      {
        title: "Who can see it",
        body: [
          "Your enquiry is stored securely on our server and is visible to authorised staff in our admin panel. We may also forward it to the e-mail or messaging tools we use to receive notifications. We share information with airlines, hotels or visa providers only when needed to deliver the service you request.",
        ],
      },
      {
        title: "Cookies and storage",
        body: ["This website stores only your display preference (light or dark theme) in your browser. We do not use advertising cookies."],
      },
      {
        title: "How long we keep it",
        body: ["We keep enquiries for as long as needed to serve you and meet our business obligations, then delete them."],
      },
      {
        title: "Your choices",
        body: [`You can ask us to correct or delete your information, or to unsubscribe from our newsletter, at any time by writing to ${email} or messaging us on WhatsApp.`],
      },
    ],
  },
  om: {
    title: "Imaammata Dhuunfaa",
    updated: "Yeroo dhumaa haaromsame: Sadaasa 2026",
    sections: [
      {
        title: "Nuti eenyu?",
        body: [`${name} dhaabbata imala fi tikeettii xiyyaaraa Itoophiyaa keessatti Umraa, tikeettii, hoteela fi daawwannaa qajeelfamaa dhiyeessuudha. Fuulli kun odeeffannoo dhuunfaa marsariitii kanaan funaanamu fi akkamitti akka itti fayyadamnu ibsa.`],
      },
      {
        title: "Maal funaanna?",
        body: [
          "Waan isin foormii keenya keessatti galchitan qofa: maqaa, iimeelii, lakkoofsa bilbilaa, paakeejii barbaaddan, baay'ina imaltootaa, guyyaa imalaa fi ergaa keessan. Jaarmiyaa oduu keenyaaf yoo galmaa'ihan iimeelii keessan funaanna.",
          "Marsariitii kanaan lakkoofsa paaspoortii ykn odeeffannoo kaardii kaffaltii hin gaafannu.",
        ],
      },
      {
        title: "Akkamitti itti fayyadamna?",
        body: ["Gaaffii keessanii deebisuuf, gatii dhiyeessuuf, qabsiisa keessan qopheessuuf fi yoo galmaa'ihan dhiyeessii keenya isiniif ergitaaf. Odeeffannoo keessan hin gurguru."],
      },
      {
        title: "Eenyutu ilaala?",
        body: ["Gaaffiin keessan sarvara keenya irratti kuufama; hojjettoota hayyama qabanitu paanaala bulchiinsaa keessatti ilaala. Tajaajila isin gaafattan raawwachuuf yeroo barbaachisu qofa dhaabbilee xiyyaaraa, hoteelaa ykn viizaa waliin qooddanna."],
      },
      {
        title: "Kukiiwwanii fi kuusaa",
        body: ["Marsariitiin kun filannoo bifa (ifa ykn dukkana) kee qofa biraawuzarii keessan keessatti kuusa. Kukiiwwan beeksisaa hin fayyadamnu."],
      },
      {
        title: "Hanga yoomiitti kuusna?",
        body: ["Odeeffannoo keessan hanga isin tajaajiluuf fi dirqama hojii keenya raawwachuuf barbaachisu kuusna; booda ni haqna."],
      },
      {
        title: "Filannoo keessan",
        body: [`Yeroo kamiyyuu odeeffannoo keessan akka sirreessinu ykn haqnu, ykn oduu keenya irraa akka isin baasnu ${email} irratti barreessuun ykn Waatsaappiidhaan nu gaafachuu dandeessu.`],
      },
    ],
  },
  am: {
    title: "የግላዊነት ፖሊሲ",
    updated: "ለመጨረሻ ጊዜ የተሻሻለው፡ ህዳር 2026",
    sections: [
      {
        title: "እኛ ማን ነን?",
        body: [`${name} (“እኛ”) በኢትዮጵያ ውስጥ የኡምራ ፓኬጆችን፣ የአየር ትኬቶችን፣ የሆቴል ቦታ ማስያዝና የተመሩ ቱሮችን የሚያቀርብ ህጋዊ የጉዞ ኤጀንሲ ነው። ይህ ገጽ በዚህ ድረ-ገጽ በኩል የምንሰበስበውን የግል መረጃ እና እንዴት እንደምንጠቀምበት ያብራራል።`],
      },
      {
        title: "የምንሰበስበው መረጃ",
        body: [
          "በቅጾቻችን ላይ የሚያስገቧቸውን መረጃዎች ብቻ፡ ስምዎን፣ የኢሜይል አድራሻዎን፣ የስልክ ቁጥርዎን፣ የሚፈልጉትን ፓኬጅ፣ የተጓዦች ብዛት፣ የሚመርጡትን የጉዞ ቀን እና መልዕክትዎን። ለዜና መጽሔታችን ከተመዘገቡ የኢሜይል አድራሻዎን እንሰበስባለን።",
          "በዚህ ድረ-ገጽ በኩል የፓስፖርት ቁጥሮችን ወይም የክፍያ ካርድ ዝርዝሮችን አንጠይቅም።",
        ],
      },
      {
        title: "መረጃውን እንዴት እንደምንጠቀምበት",
        body: ["ለጥያቄዎ ምላሽ ለመስጠት፣ የዋጋ ዝርዝር ለማዘጋጀት፣ ቦታ ማስያዝዎን ለማመቻቸት እና ለዜና ከተመዘገቡ የጉዞ ቅናሾችን ለመላክ። መረጃዎን ለሶስተኛ ወገን ፈጽሞ አንሸጥም።"],
      },
      {
        title: "መረጃዎን ማን ያየዋል?",
        body: ["የእርስዎ ጥያቄ ደህንነቱ በተጠበቀ ሰርቨራችን ላይ ይቀመጣል፤ የተፈቀደላቸው ሰራተኞቻችን በአስተዳዳሪው ክፍል በኩል ይመለከቱታል። እርስዎ የጠየቁትን አገልግሎት ለማስፈጸም አስፈላጊ ሲሆን ብቻ መረጃዎችን ከአየር መንገዶች፣ ሆቴሎች ወይም የቪዛ ቢሮዎች ጋር እናጋራለን።"],
      },
      {
        title: "ኩኪዎች እና ማከማቻ",
        body: ["ይህ ድረ-ገጽ የገጽታ ምርጫዎን (ብርሃን ወይም ጨለማ) ብቻ በብሳውዘርዎ ውስጥ ያስቀምጣል። የማስታወቂያ ኩኪዎችን አንጠቀምም።"],
      },
      {
        title: "መረጃው ለምን ያህል ጊዜ ይቆያል?",
        body: ["መረጃዎን እርስዎን ለማገልገል እና የስራ ግዴታችንን ለማጠናቀቅ እስከሚያስፈልግ ድረስ ብቻ እናቆያለን፤ ከዚያም እናጠፋለን።"],
      },
      {
        title: "የእርስዎ መብቶችና ምርጫዎች",
        body: [`በማንኛውም ጊዜ መረጃዎ እንዲታረም ወይም እንዲሰረዝ፣ ወይም ከዜና መጽሔታችን ለመውጣት ወደ ${email} በመጻፍ ወይም በዋትስአፕ መልዕክት በመላክ መጠየቅ ይችላሉ።`],
      },
    ],
  },
});

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const site = await getSettings();
  const page = copy(site.emails[0], site.name)[locale];

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-dvh px-4 pb-24 pt-32 sm:px-6 lg:px-8 dark:bg-dark-500">
        <article className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-bold text-primary-700 dark:text-white">{page.title}</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{page.updated}</p>
          <div className="mt-10 space-y-8">
            {page.sections.map((s) => (
              <section key={s.title}>
                <h2 className="font-display text-xl font-bold text-primary-700 dark:text-accent-200">{s.title}</h2>
                {s.body.map((p) => (
                  <p key={p} className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
