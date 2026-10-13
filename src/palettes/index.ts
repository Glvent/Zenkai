import classicVariant from "./variants/classic";
import clayVariant from "./variants/clay";
import espressoVariant from "./variants/espresso";
import graphiteVariant from "./variants/graphite";
import nautilusVariant from "./variants/nautilus";
import paperVariant from "./variants/paper";

import type { ThemeVariantSource } from "./types";

export const variants: readonly ThemeVariantSource[] = [
  classicVariant,
  espressoVariant,
  nautilusVariant,
  graphiteVariant,
  clayVariant,
  paperVariant,
];
