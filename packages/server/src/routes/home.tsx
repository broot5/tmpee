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

      <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

      <link href="https://cdn.jsdelivr.net/npm/beercss@3.5.6/dist/cdn/beer.min.css" rel="stylesheet" />
      <script type="module" src="https://cdn.jsdelivr.net/npm/beercss@3.5.6/dist/cdn/beer.min.js"></script>
      <script
        type="module"
        src="https://cdn.jsdelivr.net/npm/material-dynamic-colors@1.1.0/dist/cdn/material-dynamic-colors.min.js"
      ></script>
    </head>
    <body class="light">
      <header>
        <nav>
          <h5 class="max">tmpee</h5>
          <button class="circle transparent" hx-get="/sign?force=1" hx-trigger="click" hx-target="#email-address">
            <i>casino</i>
          </button>
          <button
            class="circle transparent"
            x-data="{ 
              rgb: `#000000`,
              rgbChanged() {
                ui(`theme`, this.rgb);
              } 
            }"
          >
            <i>palette</i>
            <input type="color" x-model="rgb" x-on:change="rgbChanged" />
          </button>
          <label
            class="switch icon"
            x-data="{ 
              toggle: false,
              toggleChanged() {
                if (this.toggle) {
                  ui(`mode`, `dark`);
                } else {
                  ui(`mode`, `light`);
                }
              } 
            }"
          >
            <input type="checkbox" x-model="toggle" x-on:change="toggleChanged" />
            <span>
              <i>dark_mode</i>
            </span>
          </label>
        </nav>
        <div class="small-space"></div>
        <h5 class="medium-padding" id="email-address" hx-get="/sign" hx-trigger="every 1s"></h5>
      </header>
      <main class="responsive">
        <div hx-get="/email" hx-trigger="every 1s">
          <progress class="circle center"></progress>
        </div>
        <div id="dialog"></div>
      </main>
    </body>
  </html>
));
