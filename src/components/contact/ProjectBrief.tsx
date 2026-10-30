"use client";

import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, Globe, KeyRound, LayoutDashboard, Mail, MousePointerClick, PenLine, RefreshCw, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { type ReactNode, useId, useRef, useState } from "react";
import { BrandIcon } from "@/src/components/ui/BrandIcon";
import { useFeedback } from "@/src/components/ui/Feedback";
import {
  type Brief,
  briefMailto,
  briefText,
  briefWhatsappLink,
  DEADLINES,
  type DeadlineKey,
  FEATURES,
  type FeatureKey,
  isDeadline,
  type LicenceOption,
  type OfferInfos,
  parseProjectType,
  PROJECT_TYPES,
  type ProjectTypeKey,
} from "@/src/lib/project-brief";
import { SITE_URL } from "@/src/lib/site";

// Le brief en quatre étapes (projet, modules ou solution sous licence, délai, envoi). Les choix faits
// sur l'accueil ou les tarifs arrivent par l'URL (?type=…&delai=…&licence=…) et le parcours reprend à
// l'étape suivante. À la fin, le visiteur envoie lui-même le brief par WhatsApp ou par e-mail.

const TYPE_ICONS: Record<ProjectTypeKey, ReactNode> = {
  landing: <MousePointerClick aria-hidden className="size-6" />,
  vitrine: <Globe aria-hidden className="size-6" />,
  ecommerce: <ShoppingBag aria-hidden className="size-6" />,
  refonte: <RefreshCw aria-hidden className="size-6" />,
  redaction: <PenLine aria-hidden className="size-6" />,
  surmesure: <LayoutDashboard aria-hidden className="size-6" />,
  licence: <KeyRound aria-hidden className="size-6" />,
};

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  whatsappNumber: string | null;
  email: string | null;
  offers: OfferInfos | null;
  /** Solutions proposées en licence (projets publiés avec une licence disponible). */
  licences: LicenceOption[];
};

const card = (selected: boolean) =>
  `relative flex h-full w-full items-start gap-4 rounded-2xl border p-5 text-left transition-colors duration-300 ${
    selected ? "border-cobalt-soft bg-cobalt/15" : "hairline bg-bg-raised/50 hover:border-fg-subtle"
  }`;

export function ProjectBrief({ whatsappNumber, email, offers, licences }: Props) {
  const params = useSearchParams();
  const initialType = parseProjectType(params.get("type"));
  const initialDeadline = isDeadline(params.get("delai")) ? (params.get("delai") as DeadlineKey) : undefined;
  const initialLicence = licences.find((option) => option.slug === params.get("licence"));

  const uid = useId();
  const { toast } = useFeedback();
  const reduce = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(initialType ? 1 : 0);
  const [direction, setDirection] = useState(1);
  const [type, setType] = useState<ProjectTypeKey | undefined>(initialType);
  const [features, setFeatures] = useState<FeatureKey[]>([]);
  const [licence, setLicence] = useState<LicenceOption | undefined>(initialLicence);
  const [deadline, setDeadline] = useState<DeadlineKey | undefined>(initialDeadline);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [copied, setCopied] = useState(false);

  // Licence : la deuxième étape fait choisir la solution à exploiter, au lieu des modules.
  const isLicence = type === "licence";
  const steps = ["Projet", isLicence ? "Solution" : "Modules", "Délai", "Envoi"];
  const brief: Brief = { type, features, licence, deadline, name, company, description };
  const errors = {
    type: !type ? "Choisis le type de projet." : null,
    licence: isLicence && licences.length > 0 && !licence ? "Choisis la solution que tu veux exploiter." : null,
    name: name.trim().length < 2 ? "Indique ton nom." : null,
    description: description.trim().length < 20 ? "Décris ton besoin en quelques phrases (20 caractères minimum)." : null,
  };
  const briefReady = !errors.type && !errors.licence && !errors.name && !errors.description;
  const wa = briefReady ? briefWhatsappLink(whatsappNumber, brief, SITE_URL) : null;
  const mail = briefReady ? briefMailto(email, brief, SITE_URL) : null;

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    setShowErrors(false);
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  // Étape 1 : choisir un type suffit, on passe à l'étape suivante après un court retour visuel.
  const chooseType = (key: ProjectTypeKey) => {
    setType(key);
    window.setTimeout(() => goTo(1), reduce ? 0 : 220);
  };

  const next = () => {
    if (step === 0 && errors.type) return setShowErrors(true);
    if (step === 1 && errors.licence) return setShowErrors(true);
    goTo(step + 1);
  };

  // Brief incomplet : on montre ce qui manque et on y emmène, au lieu d'un clic sans effet.
  const blocked = () => {
    if (errors.type || errors.licence) {
      goTo(errors.type ? 0 : 1);
      requestAnimationFrame(() => setShowErrors(true));
      return;
    }
    setShowErrors(true);
    const field = errors.name ? `${uid}-name` : errors.description ? `${uid}-description` : null;
    if (field) requestAnimationFrame(() => document.getElementById(field)?.focus());
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(briefText(brief, SITE_URL));
      setCopied(true);
      toast("success", "Brief copié dans le presse-papiers.");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
      toast("error", "Copie impossible : sélectionne le texte à la main.");
    }
  };

  const titles = [
    "Type de solution souhaitée",
    isLicence ? "Solution à exploiter sous licence" : "Modules & fonctionnalités clés",
    "Délai souhaité de lancement",
    "Tes coordonnées & ton brief",
  ];
  const fieldClass =
    "w-full border-b hairline bg-transparent py-3 text-lg outline-none transition-colors duration-300 placeholder:text-fg-subtle focus:border-accent aria-invalid:border-danger";

  return (
    <div>
      <ol className="mb-10 grid grid-cols-4 gap-2" aria-label="Étapes">
        {steps.map((label, index) => (
          <li key={label} aria-current={index === step ? "step" : undefined}>
            <span className={`block h-1 rounded-full transition-colors duration-500 ${index <= step ? "bg-cobalt" : "bg-line"}`} />
            <span className={`mt-2 block text-xs font-semibold uppercase tracking-wider ${index === step ? "text-fg" : "text-fg-subtle"}`}>
              {index + 1}. {label}
            </span>
          </li>
        ))}
      </ol>

      <div className="flex items-baseline justify-between gap-4">
        <h2 ref={headingRef} tabIndex={-1} className="text-[clamp(1.6rem,2.8vw,2.4rem)] font-semibold leading-tight outline-none">
          {titles[step]}
        </h2>
        <span className="label shrink-0 text-fg-subtle">
          {step + 1}/{steps.length}
        </span>
      </div>

      <AnimatePresence mode="wait" custom={direction} initial={false}>
        <motion.div
          key={step}
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="mt-8 min-h-72"
        >
          {step === 0 && (
            <div>
              <div
                role="radiogroup"
                aria-label="Type de projet"
                aria-describedby={showErrors && errors.type ? `${uid}-type` : undefined}
                className="grid gap-3 sm:grid-cols-2"
              >
                {(Object.keys(PROJECT_TYPES) as ProjectTypeKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={type === key}
                    onClick={() => chooseType(key)}
                    className={card(type === key)}
                  >
                    <span
                      className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${type === key ? "bg-cobalt text-ivory" : "bg-ink text-cobalt-soft"}`}
                    >
                      {TYPE_ICONS[key]}
                    </span>
                    <span>
                      <span className="block text-lg font-semibold">{PROJECT_TYPES[key].label}</span>
                      <span className="block text-sm text-fg-muted">{PROJECT_TYPES[key].hint}</span>
                      {offers && (
                        <>
                          <span className="mt-2 block font-semibold">{offers[key].price}</span>
                          {offers[key].converted && <span className="block text-xs text-fg-subtle">{offers[key].converted}</span>}
                          <span className="mt-1 block text-xs font-medium text-accent">Délai indicatif : {offers[key].delay}</span>
                        </>
                      )}
                    </span>
                  </button>
                ))}
              </div>
              {showErrors && errors.type && (
                <p id={`${uid}-type`} role="alert" className="mt-4 text-sm text-danger">
                  {errors.type}
                </p>
              )}
            </div>
          )}

          {step === 1 && isLicence && (
            <div>
              {licences.length > 0 ? (
                <>
                  <p className="mb-4 text-fg-muted">Ces solutions sont déjà en ligne : je les adapte à ton marché. Laquelle veux-tu exploiter ?</p>
                  <div
                    role="radiogroup"
                    aria-label="Solution sous licence"
                    aria-describedby={showErrors && errors.licence ? `${uid}-licence` : undefined}
                    className="grid gap-3 sm:grid-cols-2"
                  >
                    {licences.map((option) => (
                      <div key={option.slug} className="relative">
                        <button
                          type="button"
                          role="radio"
                          aria-checked={licence?.slug === option.slug}
                          onClick={() => setLicence(option)}
                          className={`${card(licence?.slug === option.slug)} pr-14`}
                        >
                          <span
                            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${licence?.slug === option.slug ? "bg-cobalt text-ivory" : "bg-ink text-cobalt-soft"}`}
                          >
                            <KeyRound aria-hidden className="size-6" />
                          </span>
                          <span>
                            <span className="block text-lg font-semibold">{option.title}</span>
                            {option.kicker && <span className="block text-sm text-fg-muted">{option.kicker}</span>}
                          </span>
                        </button>
                        {option.liveUrl && (
                          <a
                            href={option.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:text-fg"
                          >
                            <ExternalLink aria-hidden className="size-4" />
                            <span className="sr-only">Voir {option.title} en ligne (nouvel onglet)</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                  {showErrors && errors.licence && (
                    <p id={`${uid}-licence`} role="alert" className="mt-4 text-sm text-danger">
                      {errors.licence}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-fg-muted">Aucune solution n&apos;est proposée en licence pour le moment : décris ce que tu cherches à la dernière étape.</p>
              )}
            </div>
          )}

          {step === 1 && !isLicence && (
            <div>
              <p className="mb-4 text-fg-muted">Coche ce qui compte pour toi (facultatif).</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(FEATURES) as FeatureKey[]).map((key) => {
                  const on = features.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setFeatures(on ? features.filter((f) => f !== key) : [...features, key])}
                      className={`${card(on)} items-center justify-between`}
                    >
                      <span className="font-medium">{FEATURES[key]}</span>
                      <span
                        className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${on ? "border-cobalt bg-cobalt text-ivory" : "hairline"}`}
                      >
                        {on && <Check aria-hidden className="size-4" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div role="radiogroup" aria-label="Échéance" className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(DEADLINES) as DeadlineKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={deadline === key}
                    onClick={() => setDeadline(deadline === key ? undefined : key)}
                    className={card(deadline === key)}
                  >
                    <span>
                      <span className="block text-lg font-semibold">{DEADLINES[key].label}</span>
                      <span className="block text-sm text-fg-muted">{DEADLINES[key].hint}</span>
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-6 flex items-center gap-2 text-sm text-fg-muted">
                <BrandIcon brand="whatsapp" className="size-4 text-cobalt-soft" />
                Je réponds personnellement, sur le canal que tu choisis.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <label htmlFor={`${uid}-name`} className="label text-fg-muted">
                    Nom complet *
                  </label>
                  <input
                    id={`${uid}-name`}
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={showErrors && !!errors.name}
                    aria-describedby={showErrors && errors.name ? `${uid}-name-error` : undefined}
                    className={`${fieldClass} mt-3`}
                  />
                  {showErrors && errors.name && (
                    <p id={`${uid}-name-error`} className="mt-2 text-sm text-danger">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor={`${uid}-company`} className="label text-fg-muted">
                    Entreprise (facultatif)
                  </label>
                  <input
                    id={`${uid}-company`}
                    autoComplete="organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={`${fieldClass} mt-3`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor={`${uid}-description`} className="label text-fg-muted">
                  Description du besoin *
                </label>
                <textarea
                  id={`${uid}-description`}
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={type ? PROJECT_TYPES[type].placeholder : "Présente ton projet, la cible visée, ce qui existe déjà…"}
                  aria-invalid={showErrors && !!errors.description}
                  aria-describedby={showErrors && errors.description ? `${uid}-description-error` : undefined}
                  className={`${fieldClass} mt-3 resize-y`}
                />
                {showErrors && errors.description && (
                  <p id={`${uid}-description-error`} className="mt-2 text-sm text-danger">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border hairline p-6">
                <p className="font-semibold">Envoie ton brief, déjà rédigé :</p>
                <p className="mt-1 text-sm text-fg-muted">
                  Ta messagerie s&apos;ouvre avec le message prêt ; il ne part que lorsque tu l&apos;envoies. Rien n&apos;est enregistré sur ce site.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {/* Un canal non configuré n'affiche pas de bouton : jamais de bouton qui ne fait rien. */}
                  {whatsappNumber && (
                    <SendButton href={wa} onBlocked={blocked} primary icon={<BrandIcon brand="whatsapp" className="size-5" />}>
                      Envoyer sur WhatsApp
                    </SendButton>
                  )}
                  {email && (
                    <SendButton href={mail} onBlocked={blocked} icon={<Mail aria-hidden className="size-5" />} newTab={false}>
                      Envoyer par e-mail
                    </SendButton>
                  )}
                </div>
                {showErrors && !briefReady && (
                  <p role="alert" className="mt-4 text-sm text-danger">
                    {errors.type
                      ? "Choisis d'abord le type de projet (étape 1)."
                      : errors.licence
                        ? "Choisis la solution sous licence (étape 2)."
                        : "Complète les champs signalés en rouge pour envoyer ton brief."}
                  </p>
                )}
                {briefReady && (
                  <button type="button" onClick={copy} className="link-draw mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-fg-muted">
                    <Copy aria-hidden className="size-4" />
                    {copied ? "Brief copié dans le presse-papiers" : "Copier le brief"}
                  </button>
                )}
                {!whatsappNumber && !email && <p className="mt-4 text-sm text-danger">Les coordonnées de contact ne sont pas encore configurées.</p>}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Pas de navigation à l'étape 1 : le choix du type fait avancer. */}
      {step > 0 && (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t hairline pt-8">
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            disabled={step === 0}
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 font-medium text-fg-muted transition-colors hover:text-fg disabled:invisible"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Retour
          </button>
          {step < steps.length - 1 && (
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center gap-2.5 rounded-full bg-fg px-8 py-4 text-lg font-medium text-bg transition-[background-color,color,transform] duration-300 hover:bg-cobalt hover:text-ivory active:scale-[0.97]"
            >
              {step === 2 ? "Tes coordonnées" : "Continuer"}
              <ArrowRight aria-hidden className="size-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Bouton d'envoi : un vrai lien quand le brief est complet ; sinon il signale ce qui manque.
function SendButton({
  href,
  onBlocked,
  icon,
  primary,
  newTab = true,
  children,
}: {
  href: string | null;
  onBlocked: () => void;
  icon: ReactNode;
  primary?: boolean;
  newTab?: boolean;
  children: ReactNode;
}) {
  const className = `inline-flex min-h-12 items-center gap-2 rounded-full px-5 font-medium transition-colors ${
    primary ? "bg-fg text-bg hover:bg-cobalt hover:text-ivory" : "border hairline hover:border-fg"
  }`;
  if (!href) {
    return (
      <button type="button" onClick={onBlocked} className={className}>
        {icon}
        {children}
      </button>
    );
  }
  return (
    <a href={href} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={className}>
      {icon}
      {children}
      {newTab && <span className="sr-only"> (nouvel onglet)</span>}
    </a>
  );
}
