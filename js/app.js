/* =====================================================
   CloudPanel — lógica de interacción
   5D - Comportamiento: reglas ante clics, teclado y estados
   ===================================================== */
(function () {
  "use strict";

  const root = document.documentElement;
  const body = document.body;

  /* ---------- Modo oscuro ---------- */
  const themeBtn = document.getElementById("btnThemeToggle");
  const savedTheme = localStorage.getItem("cp-theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  themeBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("cp-theme", next);
  });

  /* ---------- Sidebar (menú lateral) ---------- */
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("btnSidebarToggle");
  const overlay = document.getElementById("overlay");

  function isDesktop() { return window.matchMedia("(min-width: 768px)").matches; }

  function openSidebarMobile() {
    sidebar.classList.add("open");
    overlay.classList.add("show");
    sidebarToggle.setAttribute("aria-expanded", "true");
  }
  function closeSidebarMobile() {
    sidebar.classList.remove("open");
    if (!drawer.classList.contains("open")) overlay.classList.remove("show");
    sidebarToggle.setAttribute("aria-expanded", "false");
  }

  sidebarToggle.addEventListener("click", () => {
    if (isDesktop()) {
      body.classList.toggle("sidebar-collapsed");
    } else {
      sidebar.classList.contains("open") ? closeSidebarMobile() : openSidebarMobile();
    }
  });

  /* ---------- Drawer de configuración ---------- */
  const drawer = document.getElementById("drawer");
  const btnOpenDrawer = document.getElementById("btnOpenDrawer");
  const btnCloseDrawer = document.getElementById("btnCloseDrawer");
  const btnCancelDrawer = document.getElementById("btnCancelDrawer");
  const drawerForm = document.getElementById("drawerForm");
  const btnSaveDrawer = document.getElementById("btnSaveDrawer");

  function openDrawer() {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    overlay.classList.add("show");
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    if (!sidebar.classList.contains("open")) overlay.classList.remove("show");
  }

  btnOpenDrawer.addEventListener("click", openDrawer);
  btnCloseDrawer.addEventListener("click", closeDrawer);
  btnCancelDrawer.addEventListener("click", closeDrawer);

  drawerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Estado "loading" simulado antes de confirmar
    btnSaveDrawer.classList.add("is-loading");
    btnSaveDrawer.disabled = true;
    setTimeout(() => {
      btnSaveDrawer.classList.remove("is-loading");
      btnSaveDrawer.disabled = false;
      closeDrawer();
      showToast("Instancia configurada correctamente");
    }, 900);
  });

  /* ---------- Modal de confirmación (acción destructiva) ---------- */
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalServerName = document.getElementById("modalServerName");
  const btnCancelModal = document.getElementById("btnCancelModal");
  const btnConfirmModal = document.getElementById("btnConfirmModal");
  let rowToDelete = null;

  document.querySelectorAll(".js-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      rowToDelete = btn.closest("tr");
      const name = rowToDelete.querySelector("td").textContent.trim();
      modalServerName.textContent = name;
      openModal();
    });
  });

  function openModal() {
    modalBackdrop.classList.add("show");
    btnConfirmModal.focus();
  }
  function closeModal() {
    modalBackdrop.classList.remove("show");
    rowToDelete = null;
  }

  btnCancelModal.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  btnConfirmModal.addEventListener("click", () => {
    if (rowToDelete) {
      rowToDelete.style.opacity = "0";
      rowToDelete.style.transition = "opacity 200ms ease";
      const row = rowToDelete;
      setTimeout(() => row.remove(), 200);
    }
    closeModal();
    showToast("Instancia eliminada");
  });

  /* ---------- Cierre global con tecla Escape (5D) ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modalBackdrop.classList.contains("show")) closeModal();
      else if (drawer.classList.contains("open")) closeDrawer();
      else if (sidebar.classList.contains("open") && !isDesktop()) closeSidebarMobile();
    }
  });

  overlay.addEventListener("click", () => {
    closeDrawer();
    closeSidebarMobile();
  });

  /* ---------- Toast de feedback ---------- */
  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(msg) {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }
})();
