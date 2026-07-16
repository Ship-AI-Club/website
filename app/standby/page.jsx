import "./standby.css";

export const metadata = {
  title: "Ship AI — Standby",
  robots: { index: false },
};

const LOGO = `                       ▒█░
                      ░███
                      ████▓
                     ▓█████▒
                    ▒███████▒
                   ░█████████░                      ░░░░
                   ███████████                     ▒▓███▒░
                  ▓███████████▓            ░░    ░░▒████▓▒
                 ▒█████████████▓         ▒███▓░░░  ░░▒▒▒░
                ░███████████████▒    ░░░▒▒▓██▒
                █████████████████░░░░            ░▒▒░
               ▓██████████████▓▒▒▒             ░▓▒░░▒▓
              ▒██████████▓▒░░▒▒▓██▓ ░░░░░░░░░░░▒▓░  ▒▓░
             ▒█████▓▒▒░░░▒▓████████▓            ░▒▒▒▒░
             ▓▒▒▒░▒▒▓▓██████████████▒
          ░░▒▓▓██████████████████████░    ░███░
   ░░▒▒▓▓█████▓▓▓▓▓▓▓████████████████▓▒░░░ ▒▓▒
          ░▒▒▓▓▓▓███████████████▓▓▓▓▓█▓
         ░██████████████████▓▓▓▓███████▓
      ░▒▓█████▓▓▓▓▓▓▓▓▓▓▒▒▒▓████████████▒
  ░░▒▒▒▒░░▒▒▓▓███▓▒░       ░▒▓▓██████████▒
       ▓█████▓▒░                ░░▒▓██████░
      ▒█▓▒░                           ░▒▓██`;

const WORDMARK = `███████╗ ██╗  ██╗ ██╗ ██████╗       █████╗  ██╗
██╔════╝ ██║  ██║ ██║ ██╔══██╗     ██╔══██╗ ██║
███████╗ ███████║ ██║ ██████╔╝     ███████║ ██║
╚════██║ ██╔══██║ ██║ ██╔═══╝      ██╔══██║ ██║
███████║ ██║  ██║ ██║ ██║          ██║  ██║ ██║
╚══════╝ ╚═╝  ╚═╝ ╚═╝ ╚═╝          ╚═╝  ╚═╝ ╚═╝`;

const TAGLINES = [
  "demos over memos",
  "feel the fear and do it anyways",
  "questions first · hot takes welcome · receipts required",
  "just ship it",
  "craft over hype",
  "back in a moment — grab a drink",
];

export default function Standby() {
  return (
    <main className="standby">
      <a href="/" className="standby-stage" aria-label="Back to shipai.club">
        <div className="standby-scan" aria-hidden="true" />
        <pre className="standby-logo" aria-hidden="true">
          {LOGO.split("\n").map((row, i) => (
            <span key={i} style={{ "--r": `${i * 60}ms` }}>
              {row + "\n"}
            </span>
          ))}
        </pre>
        <pre className="standby-wordmark" aria-hidden="true">{WORDMARK}</pre>
        <h1 className="sr-only">Ship AI</h1>
        <div className="standby-taglines" aria-hidden="true">
          {TAGLINES.map((t, i) => (
            <span key={t} style={{ "--i": i }}>{t}</span>
          ))}
        </div>
        <div className="standby-trail" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <span key={i} className="spx" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </div>
      </a>
    </main>
  );
}
