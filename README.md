# tmpee
tmpee is a temporary email service that allows users to receive emails at a temporary address.

## Usage
- `bun worker deploy` to deploy worker
- `bun server serve` to run server

## Packages
tmpee is a monorepo composed of the following packages:

- `worker`: Handles email forwarding using Cloudflare Workers.
- `server`: Manages the backend server using Elysia.js.
- `shared`: Contains shared code used by both `worker` and `server`.

## Stack
This project uses the following stack:

- **Bun**: A fast JavaScript runtime and package manager.
- **Elysia.js**: A web framework for building fast and efficient servers.
- **htmx**: A library for creating dynamic web applications with minimal JavaScript.
- **Alpine.js**: A lightweight JavaScript framework for adding interactivity to HTML.
