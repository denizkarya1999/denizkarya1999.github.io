const page = document.body.dataset.page;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const isEmbeddedWindow = window.self !== window.top || new URLSearchParams(window.location.search).has("desktop-window");
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (isEmbeddedWindow) {
  document.body.classList.add("in-window");
}

navLinks.forEach((link) => {
  const label = link.textContent.trim();
  const dockIconByLabel = {
    Home: "⌂",
    Education: "🎓",
    Publications: "📄",
    Experience: "💼",
    Academic: "🔬",
    Studio: "🧩",
    Hackathon: "⚡",
    Personal: "🛠",
    Awards: "🏆",
    Certificates: "✅",
    Extras: "✦",
    Resume: "📎",
    Contact: "✉",
  };

  link.dataset.dockIcon = dockIconByLabel[label] || "•";
  const linkPage = link.getAttribute("href")?.replace(".html", "");
  if (link.dataset.nav === page || linkPage === page || (page === "index" && linkPage === "index")) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

navToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

if (!isEmbeddedWindow) {
  document.body.classList.add("desktop-shell");

  const desktopLayer = document.createElement("div");
  desktopLayer.className = "desktop-layer";
  document.body.appendChild(desktopLayer);

  const windowTray = document.createElement("div");
  windowTray.className = "window-tray";
  document.body.appendChild(windowTray);

  const topbar = document.createElement("div");
  topbar.className = "gnome-topbar";

  const activeWindowTitle = document.createElement("div");
  activeWindowTitle.className = "gnome-window-title";
  activeWindowTitle.textContent = "Desktop";

  const clock = document.createElement("div");
  clock.className = "gnome-clock";

  const user = document.createElement("button");
  user.type = "button";
  user.className = "gnome-user";
  user.setAttribute("aria-label", "Open Visitor menu");
  user.setAttribute("aria-haspopup", "menu");
  user.setAttribute("aria-expanded", "false");
  user.title = "Visitor menu";

  const userImage = document.createElement("img");
  userImage.className = "gnome-user-image";
  userImage.src = "assets/visitor.svg";
  userImage.alt = "Visitor avatar";

  const userName = document.createElement("span");
  userName.textContent = "Visitor";

  user.append(userImage, userName);
  topbar.append(activeWindowTitle, clock, user);
  document.body.appendChild(topbar);

  const visitorMenu = document.createElement("div");
  visitorMenu.className = "visitor-menu";
  visitorMenu.setAttribute("role", "menu");
  visitorMenu.setAttribute("aria-label", "Visitor menu");

  const aboutMenuButton = document.createElement("button");
  aboutMenuButton.type = "button";
  aboutMenuButton.setAttribute("role", "menuitem");
  aboutMenuButton.textContent = "About";

  const exitMenuButton = document.createElement("button");
  exitMenuButton.type = "button";
  exitMenuButton.setAttribute("role", "menuitem");
  exitMenuButton.textContent = "Exit";

  visitorMenu.append(aboutMenuButton, exitMenuButton);
  document.body.appendChild(visitorMenu);

  const projectItems = [
    { href: "academic.html", title: "Academic Projects", icon: "🔬" },
    { href: "studio.html", title: "Studio", icon: "🧩" },
    { href: "hackathons.html", title: "Hackathons", icon: "⚡" },
    { href: "personal.html", title: "Personal", icon: "🛠" },
  ];
  const projectLinks = projectItems
    .map((item) => Array.from(navLinks).find((link) => link.getAttribute("href") === item.href))
    .filter(Boolean);

  const projectsFolderButton = document.createElement("button");
  projectsFolderButton.type = "button";
  projectsFolderButton.className = "dock-folder-button projects-folder-button";
  projectsFolderButton.dataset.dockIcon = "📁";
  projectsFolderButton.setAttribute("aria-label", "Open Projects folder");
  projectsFolderButton.setAttribute("aria-haspopup", "menu");
  projectsFolderButton.setAttribute("aria-expanded", "false");
  projectsFolderButton.textContent = "Projects";

  const projectsFolder = document.createElement("div");
  projectsFolder.className = "dock-folder-popover projects-folder";
  projectsFolder.setAttribute("role", "menu");
  projectsFolder.setAttribute("aria-label", "Projects folder");

  const projectFolderButtons = new Map();

  projectItems.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dock-folder-item";
    button.setAttribute("role", "menuitem");
    button.dataset.href = item.href;

    const icon = document.createElement("span");
    icon.className = "dock-folder-item-icon";
    icon.textContent = item.icon;

    const label = document.createElement("span");
    label.textContent = item.title;

    button.append(icon, label);
    projectsFolder.appendChild(button);
    projectFolderButtons.set(item.href, button);
  });

  projectLinks.forEach((link) => link.classList.add("is-project-link"));
  projectLinks[0]?.before(projectsFolderButton);
  document.body.appendChild(projectsFolder);

  const snapPreview = document.createElement("div");
  snapPreview.className = "snap-preview";
  snapPreview.setAttribute("aria-hidden", "true");
  document.body.appendChild(snapPreview);

  const desktopIcons = document.createElement("div");
  desktopIcons.className = "desktop-icons";

  const resumeDocument = document.createElement("button");
  resumeDocument.type = "button";
  resumeDocument.className = "desktop-item desktop-resume-document";
  resumeDocument.setAttribute("aria-label", "Open Deniz K. Acikbas - Resume");

  const resumeGlyph = document.createElement("span");
  resumeGlyph.className = "desktop-item-glyph";
  resumeGlyph.textContent = "📄";

  const resumeLabel = document.createElement("span");
  resumeLabel.className = "desktop-item-label";
  resumeLabel.textContent = "Deniz K. Acikbas - Resume";

  resumeDocument.append(resumeGlyph, resumeLabel);

  const trash = document.createElement("button");
  trash.type = "button";
  trash.className = "desktop-item desktop-trash";
  trash.setAttribute("aria-label", "Trash");

  const trashGlyph = document.createElement("span");
  trashGlyph.className = "desktop-item-glyph";
  trashGlyph.textContent = "🗑";

  const trashLabel = document.createElement("span");
  trashLabel.className = "desktop-item-label";
  trashLabel.textContent = "Trash";

  trash.append(trashGlyph, trashLabel);
  desktopIcons.append(resumeDocument, trash);
  document.body.appendChild(desktopIcons);

  let windowCount = 0;
  let topZ = 40;
  const openWindows = new Map();
  const resumeLink = Array.from(navLinks).find((link) => link.textContent.trim() === "Resume");
  const resumeHref = resumeLink?.getAttribute("href") || "https://1drv.ms/b/c/6db5c804a8c4f79d/IQDyLdw-plaLRKNoqoVLxlrSAQCte7wjPdTw1qqluVGbbr8?e=YoOnPq";

  function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleString([], {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function updateTopbarWindowTitle() {
    const activeWindow = document.querySelector(".desktop-window.is-active-window:not(.is-minimized)");
    activeWindowTitle.textContent = activeWindow?.dataset.title || "Desktop";
  }

  function hrefKey(href) {
    return href.split("?")[0].split("#")[0];
  }

  function updateFullscreenState() {
    const hasMaximized = Boolean(document.querySelector(".desktop-window.is-maximized:not(.is-minimized)"));
    document.body.classList.toggle("has-maximized-window", hasMaximized);

    if (hasMaximized) {
      closeVisitorMenu();
      closeProjectsFolder();
    }
  }

  function updateDockIndicators() {
    navLinks.forEach((link) => {
      const key = hrefKey(link.getAttribute("href") || "");
      const windows = openWindows.get(key) || [];
      const activeWindow = windows.find((win) => win.classList.contains("is-active-window"));

      link.classList.toggle("has-window", windows.length > 0);
      link.classList.toggle("active-window", Boolean(activeWindow));
    });

    const projectWindows = projectItems.flatMap((item) => openWindows.get(hrefKey(item.href)) || []);
    const activeProjectWindow = projectWindows.find((win) => win.classList.contains("is-active-window"));
    projectsFolderButton.classList.toggle("has-window", projectWindows.length > 0);
    projectsFolderButton.classList.toggle("active-window", Boolean(activeProjectWindow));
    projectItems.forEach((item) => {
      const windows = openWindows.get(hrefKey(item.href)) || [];
      const activeWindow = windows.find((win) => win.classList.contains("is-active-window"));
      const button = projectFolderButtons.get(item.href);

      button?.classList.toggle("has-window", windows.length > 0);
      button?.classList.toggle("active-window", Boolean(activeWindow));
    });
    updateTopbarWindowTitle();
  }

  function focusWindow(win) {
    document.querySelectorAll(".desktop-window").forEach((candidate) => {
      candidate.classList.remove("is-active-window");
    });
    win.classList.add("is-active-window");
    topZ += 1;
    win.style.zIndex = String(topZ);
    updateDockIndicators();
  }

  function createTrayButton(win) {
    win.trayButton?.remove();
    win.trayButton = null;
  }

  function restoreWindow(win) {
    win.classList.remove("is-minimized");
    win.trayButton?.remove();
    win.trayButton = null;
    focusWindow(win);
    updateFullscreenState();
    updateDockIndicators();
  }

  function pointInElement(event, element) {
    const rect = element.getBoundingClientRect();
    return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  }

  function openRejectionMail() {
    const subject = encodeURIComponent("Job Application Status: Rejection");
    const body = encodeURIComponent(
      "Dear [Recipient's Name],\n\n" +
      "We appreciate your interest in the position at [Company Name]. After careful consideration, we regret to inform you that we have decided not to move forward with your application at this time.\n\n" +
      "We received many strong applications and after a thorough review, we have selected candidates whose skills and experience closely match our requirements.\n\n" +
      "We appreciate the time and effort you put into your application and wish you all the best in your job search.\n\n" +
      "Thank you again for your interest in [Company Name].\n\n" +
      "Regards,\n[Your Name]\n[Company Name]"
    );

    window.location.href = `mailto:dacikbas@umich.edu?subject=${subject}&body=${body}`;
  }

  function makeDraggable(win, titlebar) {
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;
    const snapThreshold = 28;

    function snapEdge(event) {
      if (event.clientY <= snapThreshold) return "top";
      if (event.clientX <= snapThreshold) return "left";
      if (window.innerWidth - event.clientX <= snapThreshold) return "right";
      if (window.innerHeight - event.clientY <= snapThreshold) return "bottom";
      return "";
    }

    function updateSnapPreview(edge) {
      snapPreview.className = edge ? `snap-preview is-visible snap-${edge}` : "snap-preview";
    }

    titlebar.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".window-controls") || win.classList.contains("is-maximized")) return;
      dragging = true;
      const rect = win.getBoundingClientRect();
      offsetX = event.clientX - rect.left;
      offsetY = event.clientY - rect.top;
      titlebar.setPointerCapture(event.pointerId);
      focusWindow(win);
    });

    titlebar.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const maxLeft = window.innerWidth - win.offsetWidth - 12;
      const maxTop = window.innerHeight - win.offsetHeight - 120;
      const left = Math.max(12, Math.min(maxLeft, event.clientX - offsetX));
      const top = Math.max(12, Math.min(maxTop, event.clientY - offsetY));
      win.style.left = `${left}px`;
      win.style.top = `${top}px`;
      const edge = snapEdge(event);
      win.classList.toggle("is-snap-preview", Boolean(edge));
      updateSnapPreview(edge);
    });

    titlebar.addEventListener("pointerup", (event) => {
      if (!dragging) return;
      dragging = false;
      if (titlebar.hasPointerCapture(event.pointerId)) {
        titlebar.releasePointerCapture(event.pointerId);
      }

      const shouldSnap = Boolean(snapEdge(event));
      win.classList.remove("is-snap-preview");
      updateSnapPreview("");

      if (shouldSnap) {
        win.classList.add("is-maximized");
        focusWindow(win);
        updateFullscreenState();
      }
    });

    titlebar.addEventListener("pointercancel", (event) => {
      dragging = false;
      win.classList.remove("is-snap-preview");
      updateSnapPreview("");
      if (titlebar.hasPointerCapture(event.pointerId)) {
        titlebar.releasePointerCapture(event.pointerId);
      }
    });
  }

  function openDesktopWindow(href, title) {
    const key = hrefKey(href);
    windowCount += 1;
    const win = document.createElement("section");
    win.className = "desktop-window";
    win.dataset.href = key;
    win.dataset.title = title;
    win.style.left = `${Math.min(110 + windowCount * 26, 260)}px`;
    win.style.top = `${Math.min(74 + windowCount * 22, 180)}px`;
    win.setAttribute("aria-label", `${title} window`);

    const titlebar = document.createElement("div");
    titlebar.className = "window-titlebar";

    const titleText = document.createElement("div");
    titleText.className = "window-title";
    titleText.textContent = title;

    const controls = document.createElement("div");
    controls.className = "window-controls";

    const minimize = document.createElement("button");
    minimize.type = "button";
    minimize.className = "window-control minimize";
    minimize.setAttribute("aria-label", `Minimize ${title}`);
    minimize.textContent = "−";

    const maximize = document.createElement("button");
    maximize.type = "button";
    maximize.className = "window-control maximize";
    maximize.setAttribute("aria-label", `Maximize ${title}`);
    maximize.textContent = "+";

    const close = document.createElement("button");
    close.type = "button";
    close.className = "window-control close";
    close.setAttribute("aria-label", `Close ${title}`);
    close.textContent = "×";

    controls.append(minimize, maximize, close);
    titlebar.append(titleText, controls);

    const frame = document.createElement("iframe");
    frame.className = "window-frame";
    frame.title = title;
    frame.src = `${href}${href.includes("?") ? "&" : "?"}desktop-window=1`;

    win.append(titlebar, frame);
    desktopLayer.appendChild(win);
    const windows = openWindows.get(key) || [];
    windows.push(win);
    openWindows.set(key, windows);
    focusWindow(win);
    makeDraggable(win, titlebar);
    updateDockIndicators();

    win.addEventListener("pointerdown", () => focusWindow(win));
    minimize.addEventListener("click", () => {
      win.classList.add("is-minimized");
      win.classList.remove("is-active-window");
      createTrayButton(win, title);
      updateFullscreenState();
      updateDockIndicators();
    });
    maximize.addEventListener("click", () => {
      win.classList.remove("is-snap-preview");
      win.classList.toggle("is-maximized");
      focusWindow(win);
      updateFullscreenState();
    });
    close.addEventListener("click", () => {
      win.trayButton?.remove();
      win.remove();
      const remaining = (openWindows.get(key) || []).filter((candidate) => candidate !== win);
      if (remaining.length > 0) {
        openWindows.set(key, remaining);
      } else {
        openWindows.delete(key);
      }
      updateFullscreenState();
      updateDockIndicators();
    });
  }

  function openPageWindow(href, title) {
    const windows = openWindows.get(hrefKey(href)) || [];
    const existingWindow = windows[windows.length - 1];

    if (existingWindow) {
      restoreWindow(existingWindow);
      return;
    }

    openDesktopWindow(href, title);
  }

  function openResumeWindow() {
    const key = hrefKey(resumeHref);
    const windows = openWindows.get(key) || [];
    const existingWindow = windows[windows.length - 1];

    if (existingWindow) {
      restoreWindow(existingWindow);
      return;
    }

    windowCount += 1;
    const win = document.createElement("section");
    win.className = "desktop-window resume-window";
    win.dataset.href = key;
    win.dataset.title = "Resume";
    win.style.left = `${Math.min(128 + windowCount * 24, 280)}px`;
    win.style.top = `${Math.min(86 + windowCount * 20, 180)}px`;
    win.setAttribute("aria-label", "Resume window");

    const titlebar = document.createElement("div");
    titlebar.className = "window-titlebar";

    const titleText = document.createElement("div");
    titleText.className = "window-title";
    titleText.textContent = "Resume";

    const controls = document.createElement("div");
    controls.className = "window-controls";

    const minimize = document.createElement("button");
    minimize.type = "button";
    minimize.className = "window-control minimize";
    minimize.setAttribute("aria-label", "Minimize Resume");
    minimize.textContent = "-";

    const maximize = document.createElement("button");
    maximize.type = "button";
    maximize.className = "window-control maximize";
    maximize.setAttribute("aria-label", "Maximize Resume");
    maximize.textContent = "+";

    const close = document.createElement("button");
    close.type = "button";
    close.className = "window-control close";
    close.setAttribute("aria-label", "Close Resume");
    close.textContent = "x";

    controls.append(minimize, maximize, close);
    titlebar.append(titleText, controls);

    const content = document.createElement("div");
    content.className = "resume-window-content";

    const toolbar = document.createElement("div");
    toolbar.className = "resume-window-toolbar";

    const name = document.createElement("span");
    name.textContent = "Deniz K. Acikbas - Resume";

    const openLink = document.createElement("a");
    openLink.href = resumeHref;
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    openLink.textContent = "Open Resume";

    toolbar.append(name, openLink);

    const frame = document.createElement("iframe");
    frame.className = "resume-frame";
    frame.title = "Deniz K. Acikbas - Resume";
    frame.src = resumeHref;

    content.append(toolbar, frame);
    win.append(titlebar, content);
    desktopLayer.appendChild(win);
    windows.push(win);
    openWindows.set(key, windows);
    focusWindow(win);
    makeDraggable(win, titlebar);
    updateDockIndicators();

    win.addEventListener("pointerdown", () => focusWindow(win));
    minimize.addEventListener("click", () => {
      win.classList.add("is-minimized");
      win.classList.remove("is-active-window");
      createTrayButton(win, "Resume");
      updateFullscreenState();
      updateDockIndicators();
    });
    maximize.addEventListener("click", () => {
      win.classList.remove("is-snap-preview");
      win.classList.toggle("is-maximized");
      focusWindow(win);
      updateFullscreenState();
    });
    close.addEventListener("click", () => {
      win.trayButton?.remove();
      win.remove();
      openWindows.delete(key);
      updateFullscreenState();
      updateDockIndicators();
    });
  }

  function openAboutWindow() {
    const key = "about-x27";
    const windows = openWindows.get(key) || [];
    const existingWindow = windows[windows.length - 1];

    if (existingWindow) {
      restoreWindow(existingWindow);
      return;
    }

    windowCount += 1;
    const win = document.createElement("section");
    win.className = "desktop-window about-window";
    win.dataset.href = key;
    win.dataset.title = "About";
    win.style.left = `${Math.min(144 + windowCount * 24, 300)}px`;
    win.style.top = `${Math.min(92 + windowCount * 20, 190)}px`;
    win.setAttribute("aria-label", "About X27 Portfolio Edition window");

    const titlebar = document.createElement("div");
    titlebar.className = "window-titlebar";

    const titleText = document.createElement("div");
    titleText.className = "window-title";
    titleText.textContent = "About";

    const controls = document.createElement("div");
    controls.className = "window-controls";

    const minimize = document.createElement("button");
    minimize.type = "button";
    minimize.className = "window-control minimize";
    minimize.setAttribute("aria-label", "Minimize About");
    minimize.textContent = "-";

    const maximize = document.createElement("button");
    maximize.type = "button";
    maximize.className = "window-control maximize";
    maximize.setAttribute("aria-label", "Maximize About");
    maximize.textContent = "+";

    const close = document.createElement("button");
    close.type = "button";
    close.className = "window-control close";
    close.setAttribute("aria-label", "Close About");
    close.textContent = "x";

    controls.append(minimize, maximize, close);
    titlebar.append(titleText, controls);

    const content = document.createElement("div");
    content.className = "about-content";

    const flag = document.createElement("div");
    flag.className = "about-flag";
    flag.setAttribute("aria-hidden", "true");

    const product = document.createElement("h2");
    product.textContent = "X27 Portfolio Edition";

    const version = document.createElement("p");
    version.className = "about-version";
    version.textContent = "Version 1.0";

    const developer = document.createElement("p");
    developer.textContent = "Developed by Deniz K. Acikbas";

    const source = document.createElement("p");
    source.className = "about-source";
    const sourceLink = document.createElement("a");
    sourceLink.href = "https://github.com/denizkarya1999/denizkarya1999.github.io";
    sourceLink.target = "_blank";
    sourceLink.rel = "noopener noreferrer";
    sourceLink.textContent = "denizkarya1999/denizkarya1999.github.io";
    source.append("Source Code: ", sourceLink);

    const languageLabel = document.createElement("p");
    languageLabel.className = "about-label";
    languageLabel.textContent = "Programming Languages Used";

    const languages = document.createElement("div");
    languages.className = "about-languages";
    ["HTML", "CSS", "JavaScript"].forEach((language) => {
      const item = document.createElement("span");
      item.textContent = language;
      languages.appendChild(item);
    });

    const copyright = document.createElement("p");
    copyright.className = "about-copyright";
    copyright.textContent = "2026 © Deniz Karya Acikbas";

    content.append(flag, product, version, developer, source, languageLabel, languages, copyright);
    win.append(titlebar, content);
    desktopLayer.appendChild(win);
    windows.push(win);
    openWindows.set(key, windows);
    focusWindow(win);
    makeDraggable(win, titlebar);
    updateDockIndicators();

    win.addEventListener("pointerdown", () => focusWindow(win));
    minimize.addEventListener("click", () => {
      win.classList.add("is-minimized");
      win.classList.remove("is-active-window");
      createTrayButton(win, "About");
      updateFullscreenState();
      updateDockIndicators();
    });
    maximize.addEventListener("click", () => {
      win.classList.remove("is-snap-preview");
      win.classList.toggle("is-maximized");
      focusWindow(win);
      updateFullscreenState();
    });
    close.addEventListener("click", () => {
      win.trayButton?.remove();
      win.remove();
      openWindows.delete(key);
      updateFullscreenState();
      updateDockIndicators();
    });
  }

  function openTrashWindow() {
    const key = "trash";
    const windows = openWindows.get(key) || [];
    const existingWindow = windows[windows.length - 1];

    if (existingWindow) {
      restoreWindow(existingWindow);
      return;
    }

    windowCount += 1;
    const win = document.createElement("section");
    win.className = "desktop-window trash-window";
    win.dataset.href = key;
    win.dataset.title = "Trash";
    win.style.left = `${Math.min(156 + windowCount * 22, 300)}px`;
    win.style.top = `${Math.min(104 + windowCount * 18, 200)}px`;
    win.setAttribute("aria-label", "Trash window");

    const titlebar = document.createElement("div");
    titlebar.className = "window-titlebar";

    const titleText = document.createElement("div");
    titleText.className = "window-title";
    titleText.textContent = "Trash";

    const controls = document.createElement("div");
    controls.className = "window-controls";

    const minimize = document.createElement("button");
    minimize.type = "button";
    minimize.className = "window-control minimize";
    minimize.setAttribute("aria-label", "Minimize Trash");
    minimize.textContent = "-";

    const maximize = document.createElement("button");
    maximize.type = "button";
    maximize.className = "window-control maximize";
    maximize.setAttribute("aria-label", "Maximize Trash");
    maximize.textContent = "+";

    const close = document.createElement("button");
    close.type = "button";
    close.className = "window-control close";
    close.setAttribute("aria-label", "Close Trash");
    close.textContent = "x";

    controls.append(minimize, maximize, close);
    titlebar.append(titleText, controls);

    const content = document.createElement("div");
    content.className = "trash-content";

    const icon = document.createElement("div");
    icon.className = "trash-content-icon";
    icon.textContent = "🗑";
    icon.setAttribute("aria-hidden", "true");

    const message = document.createElement("h2");
    message.textContent = "Trash is empty";

    content.append(icon, message);
    win.append(titlebar, content);
    desktopLayer.appendChild(win);
    windows.push(win);
    openWindows.set(key, windows);
    focusWindow(win);
    makeDraggable(win, titlebar);
    updateDockIndicators();

    win.addEventListener("pointerdown", () => focusWindow(win));
    minimize.addEventListener("click", () => {
      win.classList.add("is-minimized");
      win.classList.remove("is-active-window");
      createTrayButton(win, "Trash");
      updateFullscreenState();
      updateDockIndicators();
    });
    maximize.addEventListener("click", () => {
      win.classList.remove("is-snap-preview");
      win.classList.toggle("is-maximized");
      focusWindow(win);
      updateFullscreenState();
    });
    close.addEventListener("click", () => {
      win.trayButton?.remove();
      win.remove();
      openWindows.delete(key);
      updateFullscreenState();
      updateDockIndicators();
    });
  }

  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const isInternalPage = href.endsWith(".html");
    const isResumeLink = link.textContent.trim() === "Resume";

    if (!isInternalPage && !isResumeLink) return;

    link.addEventListener("click", (event) => {
      event.preventDefault();

      if (isResumeLink) {
        openResumeWindow();
        return;
      }

      const projectItem = projectItems.find((item) => item.href === href);
      openPageWindow(href, projectItem?.title || link.textContent.trim());
    });
  });

  function positionVisitorMenu() {
    const rect = user.getBoundingClientRect();
    visitorMenu.style.top = `${rect.bottom + 8}px`;
    visitorMenu.style.right = `${Math.max(10, window.innerWidth - rect.right)}px`;
  }

  function closeVisitorMenu() {
    visitorMenu.classList.remove("is-open");
    user.setAttribute("aria-expanded", "false");
  }

  function toggleVisitorMenu() {
    const willOpen = !visitorMenu.classList.contains("is-open");

    if (willOpen) {
      closeProjectsFolder();
      positionVisitorMenu();
      visitorMenu.classList.add("is-open");
      user.setAttribute("aria-expanded", "true");
      return;
    }

    closeVisitorMenu();
  }

  function positionProjectsFolder() {
    const rect = projectsFolderButton.getBoundingClientRect();
    const popoverWidth = projectsFolder.offsetWidth || 360;
    const left = Math.max(12, Math.min(window.innerWidth - popoverWidth - 12, rect.left + rect.width / 2 - popoverWidth / 2));

    projectsFolder.style.left = `${left}px`;
    projectsFolder.style.bottom = `${Math.max(98, window.innerHeight - rect.top + 14)}px`;
  }

  function closeProjectsFolder() {
    projectsFolder.classList.remove("is-open");
    projectsFolderButton.setAttribute("aria-expanded", "false");
  }

  function toggleProjectsFolder() {
    const willOpen = !projectsFolder.classList.contains("is-open");

    if (willOpen) {
      closeVisitorMenu();
      positionProjectsFolder();
      projectsFolder.classList.add("is-open");
      projectsFolderButton.setAttribute("aria-expanded", "true");
      return;
    }

    closeProjectsFolder();
  }

  function makeDesktopDocumentDraggable() {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let originLeft = 0;
    let originTop = 0;
    let moved = false;

    resumeDocument.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      const rect = resumeDocument.getBoundingClientRect();
      startX = event.clientX;
      startY = event.clientY;
      originLeft = rect.left;
      originTop = rect.top;
      moved = false;
      dragging = true;
      resumeDocument.style.left = `${originLeft}px`;
      resumeDocument.style.top = `${originTop}px`;
      resumeDocument.style.right = "auto";
      resumeDocument.style.bottom = "auto";
      resumeDocument.setPointerCapture(event.pointerId);
    });

    resumeDocument.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;

      if (!moved && Math.hypot(dx, dy) < 5) return;

      moved = true;
      resumeDocument.classList.add("is-dragging");
      const maxLeft = window.innerWidth - resumeDocument.offsetWidth - 12;
      const maxTop = window.innerHeight - resumeDocument.offsetHeight - 12;
      resumeDocument.style.left = `${Math.max(12, Math.min(maxLeft, originLeft + dx))}px`;
      resumeDocument.style.top = `${Math.max(44, Math.min(maxTop, originTop + dy))}px`;
      trash.classList.toggle("is-drop-target", pointInElement(event, trash));
    });

    resumeDocument.addEventListener("pointerup", (event) => {
      if (!dragging) return;
      dragging = false;
      if (resumeDocument.hasPointerCapture(event.pointerId)) {
        resumeDocument.releasePointerCapture(event.pointerId);
      }
      resumeDocument.classList.remove("is-dragging");
      trash.classList.remove("is-drop-target");

      if (moved && pointInElement(event, trash)) {
        resumeDocument.classList.add("is-rejected");
        window.setTimeout(() => resumeDocument.classList.remove("is-rejected"), 700);
        openRejectionMail();
        return;
      }

      if (!moved) {
        openResumeWindow();
      }
    });

    resumeDocument.addEventListener("pointercancel", (event) => {
      dragging = false;
      if (resumeDocument.hasPointerCapture(event.pointerId)) {
        resumeDocument.releasePointerCapture(event.pointerId);
      }
      resumeDocument.classList.remove("is-dragging");
      trash.classList.remove("is-drop-target");
    });

    resumeDocument.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openResumeWindow();
    });
  }

  user.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleVisitorMenu();
  });

  projectsFolderButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleProjectsFolder();
  });

  projectsFolder.querySelectorAll(".dock-folder-item").forEach((button) => {
    button.addEventListener("click", () => {
      const item = projectItems.find((candidate) => candidate.href === button.dataset.href);
      if (!item) return;

      closeProjectsFolder();
      openPageWindow(item.href, item.title);
    });
  });

  aboutMenuButton.addEventListener("click", () => {
    closeVisitorMenu();
    openAboutWindow();
  });

  trash.addEventListener("click", openTrashWindow);

  exitMenuButton.addEventListener("click", () => {
    window.location.href = "https://www.google.com/";
  });

  document.addEventListener("click", (event) => {
    if (visitorMenu.contains(event.target) || user.contains(event.target)) return;
    if (projectsFolder.contains(event.target) || projectsFolderButton.contains(event.target)) return;
    closeVisitorMenu();
    closeProjectsFolder();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeVisitorMenu();
      closeProjectsFolder();
    }
  });

  window.addEventListener("resize", () => {
    closeVisitorMenu();
    closeProjectsFolder();
  });
  makeDesktopDocumentDraggable();

  function showBootScreen(onComplete) {
    document.body.classList.add("boot-active");

    const bootScreen = document.createElement("section");
    bootScreen.className = "boot-screen";
    bootScreen.setAttribute("aria-label", "X27 Portfolio Edition loading");

    const bootCard = document.createElement("div");
    bootCard.className = "boot-card";

    const bootFlag = document.createElement("div");
    bootFlag.className = "boot-flag";
    bootFlag.setAttribute("aria-hidden", "true");

    const title = document.createElement("div");
    title.className = "boot-title";
    title.textContent = "X27 Portfolio Edition";

    const subtitle = document.createElement("div");
    subtitle.className = "boot-subtitle";
    subtitle.textContent = "Preparing desktop environment";

    const progress = document.createElement("div");
    progress.className = "boot-progress";

    const progressFill = document.createElement("div");
    progressFill.className = "boot-progress-fill";
    progress.appendChild(progressFill);

    const hint = document.createElement("div");
    hint.className = "boot-hint";
    hint.textContent = "Loading windows, dock, and workspace";

    bootCard.append(bootFlag, title, subtitle, progress, hint);
    bootScreen.appendChild(bootCard);
    document.body.appendChild(bootScreen);

    const bootDelay = prefersReduced ? 120 : 520;
    window.setTimeout(() => {
      bootScreen.classList.add("is-done");
      window.setTimeout(() => {
        bootScreen.remove();
        document.body.classList.remove("boot-active");
        showLoginScreen(onComplete);
      }, 160);
    }, bootDelay);
  }

  function showLoginScreen(onComplete) {
    document.body.classList.add("login-active");

    const loginScreen = document.createElement("section");
    loginScreen.className = "login-screen";
    loginScreen.setAttribute("aria-label", "X27 Portfolio Edition login");

    const loginPanel = document.createElement("div");
    loginPanel.className = "login-panel";

    const loginAvatar = document.createElement("img");
    loginAvatar.className = "login-avatar";
    loginAvatar.src = "assets/visitor.svg";
    loginAvatar.alt = "Visitor avatar";

    const loginButton = document.createElement("button");
    loginButton.type = "button";
    loginButton.className = "login-user-button";
    loginButton.textContent = "Visitor";

    loginPanel.append(loginAvatar, loginButton);

    const product = document.createElement("div");
    product.className = "login-product";

    const productFlag = document.createElement("div");
    productFlag.className = "login-product-flag";
    productFlag.setAttribute("aria-hidden", "true");

    const productName = document.createElement("span");
    productName.textContent = "X27 Portfolio Edition";

    product.append(productFlag, productName);
    loginScreen.append(loginPanel, product);
    document.body.appendChild(loginScreen);

    let hasEntered = false;

    function enterDesktop() {
      if (hasEntered) return;
      hasEntered = true;
      loginScreen.classList.add("is-done");
      window.setTimeout(() => {
        loginScreen.remove();
        document.body.classList.remove("login-active");
        onComplete();
      }, prefersReduced ? 0 : 180);
    }

    loginButton.addEventListener("click", enterDesktop);
    loginScreen.addEventListener("keydown", (event) => {
      if (event.key === "Enter") enterDesktop();
    });
    window.requestAnimationFrame(() => loginButton.focus());
  }

  function launchInitialWindow() {
    if (page === "index") {
      openDesktopWindow("index.html", "Home");
      return;
    }

    const activeLink = Array.from(navLinks).find((link) => link.classList.contains("active"));
    const href = activeLink?.getAttribute("href") || `${page}.html`;
    const projectItem = projectItems.find((item) => item.href === href);
    const title = projectItem?.title || activeLink?.textContent.trim() || document.title.replace(/^X27:\s*/, "") || "Window";
    openDesktopWindow(href, title);
  }

  updateClock();
  window.setInterval(updateClock, 30000);
  showBootScreen(launchInitialWindow);
}

const canvas = document.getElementById("signal-canvas");
const ctx = canvas?.getContext("2d");
let particles = [];
let animationFrame;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(38, Math.min(92, Math.floor(window.innerWidth / 18)));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.42,
    vy: (Math.random() - 0.5) * 0.42,
    r: Math.random() * 1.8 + 0.7,
  }));
}

function drawSignals() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.fillStyle = "rgba(86, 246, 223, 0.68)";
  ctx.strokeStyle = "rgba(86, 246, 223, 0.12)";
  ctx.lineWidth = 1;

  for (const particle of particles) {
    if (!prefersReduced) {
      particle.x += particle.vx;
      particle.y += particle.vy;
    }

    if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
    if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (distance < 128) {
        ctx.globalAlpha = 1 - distance / 128;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  ctx.globalAlpha = 1;
  animationFrame = window.requestAnimationFrame(drawSignals);
}

if (canvas && ctx) {
  resizeCanvas();
  drawSignals();
  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(animationFrame);
    resizeCanvas();
    drawSignals();
  });
}
