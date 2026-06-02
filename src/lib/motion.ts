import type { Variants } from "motion/react";

/** Container que escalona a entrada dos filhos (grids, listas). */
export const containerStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

/** Item que sobe e aparece — usado nos cards. */
export const itemRise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" } },
};
