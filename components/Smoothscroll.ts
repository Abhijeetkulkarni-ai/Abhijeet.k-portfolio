import type Lenis from "lenis";

// Shared access to the Lenis instance, plus a small lock helper so several
// components (hero intro, gallery entrance) can pause scrolling safely.

let lenis: Lenis | null = null;
const locks = new Set<string>();

const applyLockState = () => {
  if (locks.size > 0) {
    if (lenis) lenis.stop();
    else document.documentElement.style.overflow = "hidden"; // no-Lenis fallback
  } else {
    if (lenis) lenis.start();
    else document.documentElement.style.overflow = "";
  }
};

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
  applyLockState(); // a lock taken before Lenis existed still applies
};

export const getLenis = () => lenis;

export const lockScroll = (id: string) => {
  locks.add(id);
  applyLockState();
};

export const unlockScroll = (id: string) => {
  if (!locks.delete(id)) return;
  applyLockState();
};