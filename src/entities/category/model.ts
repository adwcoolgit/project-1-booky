export type CategorySummary = {
  id: number;
  name: string;
  slug: string;
  artwork: string | null;
};

export type CategoryPresentation = {
  id: number;
  href: string;
  name: string;
  slug: string;
  artwork: {
    src: string;
    alt: string;
    isFallback: boolean;
  };
};