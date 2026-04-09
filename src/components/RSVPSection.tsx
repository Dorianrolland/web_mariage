"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, AlertCircle, Users, Utensils, MessageCircle, Music } from "lucide-react";
import confetti from "canvas-confetti";
import ScrollReveal from "./ScrollReveal";

function fireSuccessConfetti() {
  // Fireworks-style bursts
  const duration = 3000;
  const end = Date.now() + duration;
  const colors = ["#C9A96E", "#D4B87A", "#C4918A", "#D4A9A3", "#FAF7F2", "#A8894D"];

  const interval = setInterval(() => {
    if (Date.now() > end) return clearInterval(interval);
    confetti({
      particleCount: 30,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: Math.random(),
        y: Math.random() * 0.4,
      },
      colors,
      ticks: 200,
      gravity: 0.8,
      scalar: 1.1,
      shapes: ["circle", "square"],
    });
  }, 250);
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  attending: "yes" | "no" | "";
  guests: string;
  dietary: string;
  message: string;
  accommodation: "yes" | "no" | "";
  songSuggestion: string;
}

const initialForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  attending: "",
  guests: "0",
  dietary: "",
  message: "",
  accommodation: "",
  songSuggestion: "",
};

export default function RSVPSection() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [step, setStep] = useState(0);

  // Fire confetti on success
  useEffect(() => {
    if (status === "success" && form.attending === "yes") {
      fireSuccessConfetti();
    }
  }, [status, form.attending]);

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section id="rsvp" className="section-padding relative overflow-hidden bg-cream">
        {/* Golden confetti particles */}
        <div className="pointer-events-none absolute inset-0">
          {[
            { x: 10, d: 3.5, s: 6 }, { x: 20, d: 4.2, s: 8 }, { x: 30, d: 3.8, s: 5 },
            { x: 40, d: 5.0, s: 10 }, { x: 50, d: 3.2, s: 7 }, { x: 60, d: 4.5, s: 4 },
            { x: 70, d: 3.9, s: 9 }, { x: 80, d: 4.8, s: 6 }, { x: 90, d: 3.6, s: 8 },
            { x: 15, d: 4.1, s: 5 }, { x: 35, d: 3.4, s: 7 }, { x: 55, d: 4.6, s: 9 },
            { x: 75, d: 3.7, s: 6 }, { x: 85, d: 5.2, s: 4 }, { x: 45, d: 3.3, s: 10 },
            { x: 25, d: 4.4, s: 8 }, { x: 65, d: 3.1, s: 5 }, { x: 95, d: 4.7, s: 7 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute top-0 h-2 w-2 rounded-full"
              style={{
                left: `${p.x}%`,
                background: i % 3 === 0 ? "#C9A96E" : i % 3 === 1 ? "#D4B87A" : "#E8DDD0",
              }}
              initial={{ y: -20, opacity: 1, rotate: 0 }}
              animate={{
                y: "100vh",
                opacity: [1, 1, 0],
                rotate: 720,
                x: [0, (i % 2 === 0 ? 30 : -30), 0],
              }}
              transition={{
                duration: p.d,
                delay: p.s * 0.1,
                ease: "easeIn",
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative mx-auto max-w-lg text-center"
        >
          <motion.div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold bg-cream"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Check className="h-8 w-8 text-gold" />
            </motion.div>
          </motion.div>
          <h3 className="font-heading text-3xl text-navy md:text-4xl">
            Merci !
          </h3>
          <p className="mt-4 text-charcoal/70">
            {form.attending === "yes"
              ? "Nous avons hâte de célébrer ce moment avec vous. Votre réponse a bien été enregistrée."
              : "Nous regrettons votre absence mais comprenons parfaitement. Votre réponse a bien été enregistrée."}
          </p>
          <div className="gold-line-wide mt-8" />
        </motion.div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="section-padding bg-cream">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <ScrollReveal className="mb-16 text-center">
          <p className="font-ui mb-4 text-gold tracking-[0.3em]">
            Répondez s&apos;il vous plaît
          </p>
          <h2 className="font-heading mb-6 text-4xl text-navy md:text-6xl">
            Votre{" "}
            <span className="font-display text-gold">réponse</span>
          </h2>
          <div className="gold-line-wide" />
          <p className="mx-auto mt-6 max-w-lg text-charcoal/80">
            Nous serions honorés de votre présence. Merci de confirmer
            votre participation avant le 1er juin 2027.
          </p>
        </ScrollReveal>

        {/* Progress indicator */}
        <ScrollReveal delay={0.2}>
          <div className="mb-10 flex items-center justify-center gap-2">
            {[0, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? "w-8 bg-gold"
                    : s < step
                    ? "w-2 bg-gold/60"
                    : "w-2 bg-stone-light"
                }`}
                aria-label={`Étape ${s + 1}`}
              />
            ))}
          </div>
        </ScrollReveal>

        {/* Form */}
        <ScrollReveal delay={0.3}>
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 0: Identity */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <Users className="h-5 w-5 text-gold" />
                    <h3 className="font-heading text-xl text-navy">Vos coordonnées</h3>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="font-ui mb-2 block text-xs text-charcoal/60">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        className="w-full border-b-2 border-stone-light bg-transparent px-0 py-3 text-navy outline-none transition-colors focus:border-gold"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <label className="font-ui mb-2 block text-xs text-charcoal/60">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        className="w-full border-b-2 border-stone-light bg-transparent px-0 py-3 text-navy outline-none transition-colors focus:border-gold"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-ui mb-2 block text-xs text-charcoal/60">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full border-b-2 border-stone-light bg-transparent px-0 py-3 text-navy outline-none transition-colors focus:border-gold"
                      placeholder="votre@email.com"
                    />
                  </div>

                  {/* Attendance */}
                  <div>
                    <label className="font-ui mb-4 block text-xs text-charcoal/60">
                      Serez-vous des nôtres ? *
                    </label>
                    <div className="flex gap-4">
                      {[
                        { value: "yes", label: "Avec joie !" },
                        { value: "no", label: "Malheureusement non" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateField("attending", opt.value)}
                          className={`flex-1 rounded-lg border-2 px-6 py-3 text-center transition-all duration-300 ${
                            form.attending === opt.value
                              ? "border-gold bg-gold/10 text-navy"
                              : "border-stone-light text-charcoal/60 hover:border-gold/30"
                          }`}
                        >
                          <span className="font-heading text-sm">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={!form.firstName || !form.lastName || !form.email || !form.attending}
                      className="font-ui flex items-center gap-2 rounded-full bg-navy px-8 py-3 text-xs text-cream transition-all hover:bg-navy-light disabled:opacity-30"
                    >
                      Suivant
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 1: Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <Utensils className="h-5 w-5 text-gold" />
                    <h3 className="font-heading text-xl text-navy">Détails pratiques</h3>
                  </div>

                  {form.attending === "yes" && (
                    <>
                      <div>
                        <label className="font-ui mb-2 block text-xs text-charcoal/60">
                          Nombre d&apos;accompagnants (en plus de vous)
                        </label>
                        <select
                          value={form.guests}
                          onChange={(e) => updateField("guests", e.target.value)}
                          className="w-full border-b-2 border-stone-light bg-transparent px-0 py-3 text-navy outline-none transition-colors focus:border-gold"
                        >
                          {[0, 1, 2, 3, 4, 5].map((n) => (
                            <option key={n} value={n}>
                              {n === 0 ? "Aucun" : n}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="font-ui mb-2 block text-xs text-charcoal/60">
                          Restrictions alimentaires
                        </label>
                        <input
                          type="text"
                          value={form.dietary}
                          onChange={(e) => updateField("dietary", e.target.value)}
                          className="w-full border-b-2 border-stone-light bg-transparent px-0 py-3 text-navy outline-none transition-colors focus:border-gold"
                          placeholder="Végétarien, allergies, etc."
                        />
                      </div>

                      <div>
                        <label className="font-ui mb-4 block text-xs text-charcoal/60">
                          Souhaitez-vous un hébergement sur place ?
                        </label>
                        <div className="flex gap-4">
                          {[
                            { value: "yes", label: "Oui, svp !" },
                            { value: "no", label: "Non merci" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => updateField("accommodation", opt.value)}
                              className={`flex-1 rounded-lg border-2 px-6 py-3 text-center transition-all duration-300 ${
                                form.accommodation === opt.value
                                  ? "border-gold bg-gold/10 text-navy"
                                  : "border-stone-light text-charcoal/60 hover:border-gold/30"
                              }`}
                            >
                              <span className="font-heading text-sm">{opt.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Song suggestion - shown for both attending and not */}
                  <div>
                    <label className="font-ui mb-2 block text-xs text-charcoal/60">
                      <Music className="mr-1 inline h-3 w-3 text-gold" />
                      Un titre pour le dancefloor ?
                    </label>
                    <input
                      type="text"
                      value={form.songSuggestion}
                      onChange={(e) => updateField("songSuggestion", e.target.value)}
                      className="w-full border-b-2 border-stone-light bg-transparent px-0 py-3 text-navy outline-none transition-colors focus:border-gold"
                      placeholder="Artiste - Titre de la chanson"
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="font-ui text-xs text-charcoal/60 hover:text-navy"
                    >
                      Retour
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="font-ui flex items-center gap-2 rounded-full bg-navy px-8 py-3 text-xs text-cream transition-all hover:bg-navy-light"
                    >
                      Suivant
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Message */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <MessageCircle className="h-5 w-5 text-gold" />
                    <h3 className="font-heading text-xl text-navy">Un petit mot ?</h3>
                  </div>

                  <div>
                    <textarea
                      value={form.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      rows={4}
                      className="w-full resize-none border-b-2 border-stone-light bg-transparent px-0 py-3 text-navy outline-none transition-colors focus:border-gold"
                      placeholder="Partagez-nous un message, un souhait, ou simplement un mot doux..."
                    />
                  </div>

                  {/* Summary */}
                  <div className="rounded-lg border border-gold/10 bg-white-warm p-6">
                    <h4 className="font-heading mb-4 text-sm text-navy">Récapitulatif</h4>
                    <div className="space-y-2 text-sm text-charcoal/70">
                      <p>
                        <span className="text-charcoal/60">Nom :</span>{" "}
                        {form.firstName} {form.lastName}
                      </p>
                      <p>
                        <span className="text-charcoal/60">Présence :</span>{" "}
                        {form.attending === "yes" ? "Oui" : "Non"}
                      </p>
                      {form.attending === "yes" && (
                        <>
                          <p>
                            <span className="text-charcoal/60">Accompagnants :</span>{" "}
                            {form.guests}
                          </p>
                          {form.dietary && (
                            <p>
                              <span className="text-charcoal/60">Régime :</span>{" "}
                              {form.dietary}
                            </p>
                          )}
                          <p>
                            <span className="text-charcoal/60">Hébergement :</span>{" "}
                            {form.accommodation === "yes" ? "Oui" : "Non"}
                          </p>
                        </>
                      )}
                      {form.songSuggestion && (
                        <p>
                          <span className="text-charcoal/60">Chanson :</span>{" "}
                          {form.songSuggestion}
                        </p>
                      )}
                    </div>
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 rounded-lg bg-rose/10 p-4 text-sm text-rose">
                      <AlertCircle className="h-4 w-4" />
                      Une erreur est survenue. Veuillez réessayer.
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="font-ui text-xs text-charcoal/60 hover:text-navy"
                    >
                      Retour
                    </button>
                    <motion.button
                      type="submit"
                      disabled={status === "sending"}
                      className="font-ui flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-xs text-cream transition-all hover:bg-gold-dark disabled:opacity-60"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {status === "sending" ? (
                        <>
                          <motion.div
                            className="h-4 w-4 rounded-full border-2 border-cream/30 border-t-cream"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Envoi...
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Confirmer
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}
