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
    </head>
    <body class="light">
      <header>
        <nav>
          <h5 class="max">tmpee</h5>
          <button class="circle transparent" hx-get="/sign?force=1" hx-trigger="click" hx-target="#email-address">
            <i>casino</i>
          </button>
          <label class="switch icon">
            <input type="checkbox" />
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