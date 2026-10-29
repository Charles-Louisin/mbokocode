// Contrats de réponse de l'API Express (/backend). À garder alignés avec les modèles Mongoose.

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "BAD_REQUEST"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PAYLOAD_TOO_LARGE"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL_ERROR"
  // Côté client uniquement : délai dépassé ou réseau injoignable.
  | "TIMEOUT"
  | "NETWORK_ERROR";

export type ApiErrorBody = {
  error: { code: ApiErrorCode; message: string; fieldErrors?: Record<string, string[] | undefined> };
  requestId?: string;
};

export type ApiItem<T> = { data: T };
export type ApiList<T> = {
  data: T[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
};

export type Media = { url: string; alt: string; width?: number; height?: number };

export type ProjectCategory = "web" | "mobile" | "platform" | "experience";
export type ProjectStatus = "prototype" | "in_progress" | "deployed" | "maintained" | "archived";

export type ProjectSummary = {
  id: string;
  title: string;
  slug: string;
  kicker?: string;
  shortDescription: string;
  category: ProjectCategory;
  technologies: string[];
  status: ProjectStatus;
  coverImage?: Media;
  liveUrl?: string;
  isFeatured: boolean;
  licenseAvailable: boolean;
  sortOrder: number;
  publishedAt?: string;
};

export type Project = ProjectSummary & {
  description?: string;
  tags: string[];
  roleAndContribution?: string;
  context?: string;
  challenge?: string;
  solution?: string;
  features: string[];
  decisions: string[];
  results?: string;
  metrics: { label: string; value: string }[];
  lessonsLearned?: string;
  futureImprovements?: string;
  gallery: Media[];
  demoVideo?: string;
  repositoryUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
};

export type PriceType = "fixed" | "from" | "range" | "quote";

export type PricingPackage = {
  id: string;
  name: string;
  slug: string;
  kicker?: string;
  description: string;
  priceType: PriceType;
  currency: string;
  /** Unités mineures (centimes). */
  priceMin?: number;
  priceMax?: number;
  features: string[];
  deliveryEstimate?: string;
  serviceType?: string;
  sortOrder: number;
};

export type SiteSettings = {
  id: string;
  publicName: string;
  ownerName: string;
  role?: string;
  tagline?: string;
  location?: string;
  email?: string;
  whatsappNumber?: string;
  cvUrl?: string;
  socials: { label: string; url: string }[];
  availability: { isAvailable: boolean; label?: string };
  currency: string;
  seo?: { title?: string; description?: string };
  features: { reviews: boolean; lab: boolean; journal: boolean };
};

export type RelationshipType = "client" | "collaboration" | "other";
export type ReviewStatus = "pending" | "approved" | "rejected" | "hidden";

export type Review = {
  id: string;
  authorName: string;
  authorRole: string | null;
  rating: number;
  title: string | null;
  content: string;
  relationshipType: RelationshipType | null;
  projectSlug: string | null;
  isVerifiedClient: boolean;
  publishedAt: string | null;
};

export type OwnReview = Review & { status: ReviewStatus; createdAt: string; updatedAt: string };

export type ReviewList = { data: Review[]; meta: { page: number; limit: number; total: number; totalPages: number; averageRating: number | null } };

export type SessionUser = { id: string; name: string; email: string; image: string | null; isAdmin: boolean };

export type AuthProviders = { google: boolean; magicLink: boolean };

/** Savoir-faire publié (collection services). */
export type Service = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  deliverables: string[];
  proofs: string[];
  sortOrder: number;
};

export type IconKey = "messages" | "target" | "shield" | "code" | "gauge" | "handshake";

export type JourneyStep = { kind: "venture" | "work" | "school"; period: string; title: string; place: string; text: string; points?: string[] };

/** Contenu éditorial du site (document unique). */
export type SiteContent = {
  method: { title: string; text: string }[];
  journey: JourneyStep[];
  skillGroups: { title: string; skills: string[] }[];
  languages: { name: string; level: string }[];
  principles: { icon?: IconKey; title: string; text: string }[];
  values: { icon?: IconKey; label: string }[];
  afterDelivery: { title: string; text: string }[];
  places: { label: string; lat: number; lng: number }[];
  licenceVsCustom: { criterion: string; licence: string; custom: string }[];
  creator?: Creator;
};

/** Création de contenu : chiffres relevés à une date, vidéos marquantes. */
export type Creator = {
  platform: "tiktok";
  handle: string;
  profileUrl: string;
  bio?: string;
  recordedAt: string;
  stats: { label: string; value: string }[];
  videos: { url: string; caption: string; views?: string; cover?: string }[];
};
