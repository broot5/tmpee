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

      <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/persist@3.x.x/dist/cdn.min.js"></script>
      <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

      <link href="https://cdn.jsdelivr.net/npm/beercss@3.5.6/dist/cdn/beer.min.css" rel="stylesheet" />
      <script type="module" src="https://cdn.jsdelivr.net/npm/beercss@3.5.6/dist/cdn/beer.min.js"></script>
      <script
        type="module"
        src="https://cdn.jsdelivr.net/npm/material-dynamic-colors@1.1.0/dist/cdn/material-dynamic-colors.min.js"
      ></script>
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
          <button
            class="circle transparent"
            x-data="{
              copy(text) {
                navigator.clipboard.writeText(text);
              }
            }"
            x-on:click="copy(document.querySelector('#emailAddress').innerText)"
          >
            <i>content_copy</i>
          </button>
          <button class="circle transparent" hx-get="/sign?force=1" hx-trigger="click" hx-target="#emailAddress">
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
        <h5 id="emailAddress" class="large-padding" hx-get="/sign" hx-trigger="every 1s">
          &nbsp;
        </h5>
      </header>
      <main class="responsive">
        <div hx-get="/email" hx-trigger="every 1s">
          <div class="active overlay blur center-align middle-align">
            <progress class="circle"></progress>
          </div>
        </div>
        <div id="dialog"></div>
      </main>
    </body>
  </html>
));
