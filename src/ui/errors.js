export function installErrorOverlay(box) {
  function show(text) {
    box.hidden = false;
    box.textContent += text + "\n";
  }
  addEventListener("error", e => show(e.message || "Unknown error"));
  addEventListener("unhandledrejection", e => show(String((e.reason && e.reason.message) || e.reason)));
  return show;
}
