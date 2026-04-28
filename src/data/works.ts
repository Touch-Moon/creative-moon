/**
 * Shared types for the Selected Works section (home) and Related Works (single page).
 * Source of truth is Sanity. No local fallback data — components handle empty Sanity responses gracefully.
 */

export type CardSize = 'large' | 'wide' | 'tall' | 'compact';

export type SelectedWork = {
  id: string;
  title: string;
  slug: string;
  src: string;
  size: CardSize;
};

export const SELECTED_WORKS: SelectedWork[] = [];
