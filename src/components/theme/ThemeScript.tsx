export function ThemeScript() {
  // Runs in <head> before paint to set the right data-theme attribute and avoid
  // flash-of-incorrect-theme. Storage values are JSON-encoded (matches the rest
  // of the app's storage layer).
  const code = `
    (function () {
      try {
        var raw = localStorage.getItem('ish:theme');
        var stored = null;
        try { if (raw) stored = JSON.parse(raw); } catch (e) {}
        var resolved;
        if (stored === 'light' || stored === 'dark') {
          resolved = stored;
        } else {
          resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', resolved);
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
