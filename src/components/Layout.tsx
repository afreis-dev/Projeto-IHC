import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  const location = useLocation();
  const prefereMenosMovimento = useReducedMotion();

  // Volta ao topo a cada navegação (substitui o reload de páginas do HTML).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main className="page-main" id="conteudo" tabIndex={-1}>
        <div className="site-shell">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={prefereMenosMovimento ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefereMenosMovimento ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
