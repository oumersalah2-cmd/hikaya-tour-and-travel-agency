"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";
import { telHref } from "@/data/site";
import { useSite } from "@/context/SiteContext";
import { submitLead } from "@/lib/submitLead";

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const labelClass = "mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300";

export default function ContactPage() {
  const { lang, t } = useLanguage();
  const { site, whatsappLink } = useSite();
  const [failed, setFailed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setFailed(false);
    const ok = await submitLead({ type: "contact", ...data });
    if (ok) {
      reset();
      setIsSuccess(true);
    } else {
      setFailed(true);
    }
  };

  const contactInfo: {
    icon: typeof Phone;
    title: string;
    details: { text: string; href?: string; external?: boolean }[];
    description: string;
  }[] = [
    {
      icon: MessageCircle,
      title:
        lang === "am"
          ? "ቀጥታ ዋትስአፕ"
          : lang === "om"
          ? "Waatsaappii Nu Qunnamaa"
          : "WhatsApp Direct",
      details: [{ text: site.whatsappDisplay, href: whatsappLink(), external: true }],
      description:
        lang === "am"
          ? "ከቦታ ማስያዣና የኡምራ አማካሪዎቻችን ጋር በቀጥታ ይወያዩ።"
          : lang === "om"
          ? "Tajaajila Umraa fi imalaa hatattamaaf Waatsaappiin nu qunnamaa."
          : "Chat directly with our booking & pilgrimage consultants.",
    },
    {
      icon: Phone,
      title: t.contact.callUs,
      details: site.phones.map((p) => ({ text: p, href: telHref(p) })),
      description: t.contact.callDesc,
    },
    {
      icon: Mail,
      title: t.contact.emailUs,
      details: site.emails.map((e) => ({ text: e, href: `mailto:${e}` })),
      description: t.contact.emailDesc,
    },
    {
      icon: MapPin,
      title: t.contact.visitUs,
      details: (site.address[lang] ?? site.address.en).map((text) => ({ text })),
      description: t.contact.visitDesc,
    },
    {
      icon: Clock,
      title: t.contact.workingHours,
      details: (site.hours[lang] ?? site.hours.en).map((text) => ({ text })),
      description: t.contact.hoursDesc,
    },
  ];

  const input = (hasError: boolean) =>
    `form-input ${hasError ? "border-red-400 focus:ring-red-400" : ""}`;

  return (
    <>
      <Navbar />
      <main id="main" className="min-h-screen pb-20 pt-28 dark:bg-dark-500">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeading
            subtitle={t.contact.subtitle}
            title={t.contact.title}
            description={t.contact.description}
          />

          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-2">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-dark-300 dark:bg-dark-400"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-400/10 text-accent-700 dark:text-accent-300">
                    <info.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-bold text-primary-700 dark:text-white">{info.title}</h3>
                    <div className="mb-2 space-y-1">
                      {info.details.map((d) =>
                        d.href ? (
                          <a
                            key={d.text}
                            href={d.href}
                            {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            className="block font-semibold text-accent-700 underline underline-offset-2 transition-colors hover:text-accent-800 dark:text-accent-300 dark:hover:text-accent-200"
                          >
                            {d.text}
                          </a>
                        ) : (
                          <p key={d.text} className="font-medium text-gray-700 dark:text-gray-300">{d.text}</p>
                        )
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{info.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl border border-gray-100 bg-white p-8 shadow-soft md:p-10 lg:col-span-3 dark:border-dark-100 dark:bg-dark-300"
            >
              <h2 className="mb-6 font-display text-2xl font-bold text-primary-700 dark:text-white">
                {t.contact.sendMessage}
              </h2>

              {isSuccess ? (
                <motion.div
                  role="status"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-900/20"
                >
                  <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
                  <h3 className="mb-2 text-xl font-bold text-green-800 dark:text-green-400">{t.contact.successTitle}</h3>
                  <p className="mb-6 text-green-700 dark:text-green-500/80">{t.contact.successDesc}</p>
                  <button type="button" onClick={() => setIsSuccess(false)} className="text-sm font-semibold text-green-800 underline dark:text-green-300">
                    {lang === "en" ? "Send another message" : lang === "am" ? "ሌላ መልእክት ይላኩ" : "Ergaa biraa ergi"}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="c-name" className={labelClass}>{t.contact.nameLabel}</label>
                      <input
                        id="c-name"
                        type="text"
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        placeholder={t.contact.namePlaceholder}
                        className={input(!!errors.name)}
                        {...register("name", { required: t.ui.form.required })}
                      />
                      {errors.name && <p role="alert" className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="c-email" className={labelClass}>{t.contact.emailLabel}</label>
                      <input
                        id="c-email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        placeholder={t.contact.emailPlaceholder}
                        className={input(!!errors.email)}
                        {...register("email", {
                          required: t.ui.form.required,
                          pattern: { value: EMAIL_RE, message: t.ui.form.invalidEmail },
                        })}
                      />
                      {errors.email && <p role="alert" className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="c-phone" className={labelClass}>{t.contact.phoneLabel}</label>
                      <input
                        id="c-phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder={t.contact.phonePlaceholder}
                        className={input(false)}
                        {...register("phone")}
                      />
                    </div>

                    <div>
                      <label htmlFor="c-subject" className={labelClass}>{t.contact.subjectLabel}</label>
                      <input
                        id="c-subject"
                        type="text"
                        aria-invalid={!!errors.subject}
                        placeholder={t.contact.subjectPlaceholder}
                        className={input(!!errors.subject)}
                        {...register("subject", { required: t.ui.form.required })}
                      />
                      {errors.subject && <p role="alert" className="mt-1 text-xs text-red-500">{errors.subject.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="c-message" className={labelClass}>{t.contact.messageLabel}</label>
                    <textarea
                      id="c-message"
                      rows={5}
                      aria-invalid={!!errors.message}
                      placeholder={t.contact.messagePlaceholder}
                      className={`${input(!!errors.message)} resize-none`}
                      {...register("message", { required: t.ui.form.required })}
                    />
                    {errors.message && <p role="alert" className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
                  </div>

                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    {...register("website")}
                  />

                  {failed && (
                    <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <div>
                        <p>{t.ui.form.sendError}</p>
                        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 font-semibold underline">
                          <MessageCircle className="h-4 w-4" />
                          {t.ui.form.chatWhatsApp}
                        </a>
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4 text-base">
                    {isSubmitting ? (
                      t.contact.sending
                    ) : (
                      <>
                        <Send className="h-5 w-5" aria-hidden="true" />
                        {t.contact.send}
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>

          <div className="mt-16 h-[400px] overflow-hidden rounded-3xl border border-gray-100 shadow-soft dark:border-dark-100">
            <iframe
              title={lang === "en" ? "Map of our Addis Ababa office" : lang === "am" ? "የአዲስ አበባ ቢሯችን ካርታ" : "Kaartaa waajjira keenyaa Finfinnee"}
              src="https://www.google.com/maps?q=Bole+Road,+Addis+Ababa,+Ethiopia&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
