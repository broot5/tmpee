import { Elysia } from "elysia";

export const homeRouter = new Elysia().get("/", () => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>tmpee</title>

      <script
        src="https://unpkg.com/htmx.org@1.9.12"
        integrity="sha384-ujb1lZYygJmzgSwoxRggbCHcjc0rB2XoQrxeTUQyRjrOnlCoYta87iKBWq3EsdM2"
        crossorigin="anonymous"
      ></script>

      <link href="https://cdn.jsdelivr.net/npm/beercss@3.5.6/dist/cdn/beer.min.css" rel="stylesheet" />
      <script type="module" src="https://cdn.jsdelivr.net/npm/beercss@3.5.6/dist/cdn/beer.min.js"></script>
      <script
        type="module"
        src="https://cdn.jsdelivr.net/npm/material-dynamic-colors@1.1.0/dist/cdn/material-dynamic-colors.min.js"
      ></script>

      <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/persist@3.x.x/dist/cdn.min.js"></script>
      <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

      <style>
        {`
          .fade-me-in.htmx-added {
            opacity: 0;
          }
          .fade-me-in {
            opacity: 1;
            transition: opacity 0.2s ease-out;
          }
          .fade-me-out.htmx-swapping {
            opacity: 0;
            transition: opacity 0.2s ease-out;
          }
      `}
      </style>
    </head>
    <body class="light">
      <header class="responsive primary-container bottom-round">
        <nav
          x-data="{
            color: $persist('#000000'),
            darkMode: $persist(false),
            changeColor(rgb) {
              ui('theme', rgb);
            },
            changeDarkMode(isDark) {
              if (isDark) {
                ui('mode', 'dark');
              } else {
                ui('mode', 'light'); 
              }
            }
          }"
          x-init="$nextTick(() => { changeDarkMode(darkMode); changeColor(color); })"
        >
          <h5 class="max">tmpee</h5>
          <button class="circle transparent" x-on:click="navigator.clipboard.writeText(document.querySelector('#emailAddress').innerText)">
            <i>content_copy</i>
          </button>
          <button class="circle transparent" hx-trigger="click" hx-get="/sign?refresh=1" hx-target="#emailAddress">
            <i>restart_alt</i>
          </button>
          <button class="circle transparent" hx-trigger="click" hx-get="/sign" hx-target="#emailAddress">
            <i>casino</i>
          </button>
          <button class="circle transparent">
            <i>palette</i>
            <input type="color" x-model="color" x-on:change="changeColor(color)" />
          </button>
          <label class="switch icon">
            <input type="checkbox" x-model="darkMode" x-on:change="changeDarkMode(darkMode)" />
            <span>
              <i>dark_mode</i>
            </span>
          </label>
        </nav>
        <div class="small-space"></div>
        <div>
          <h5 id="emailAddress" class="large-padding" hx-trigger="load" hx-get="/sign" hx-indicator="#progress">
            &nbsp;
          </h5>
          <progress id="progress" class="htmx-indicator"></progress>
        </div>
      </header>
      <main class="responsive">
        <div hx-trigger="every 1s" hx-get="/email">
          <div class="active overlay blur center-align middle-align">
            <progress class="circle"></progress>
          </div>
        </div>
        <div id="dialog" class="fade-me-in fade-me-out"></div>
      </main>
      <footer class="responsive top-round">
        <a class="link" href="https://github.com/broot5/tmpee">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </a>
      </footer>
    </body>
  </html>
));
