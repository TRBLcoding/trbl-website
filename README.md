# TRBL website
<p align="center">
  <img src="./static/TRBL_Logo.avif" alt="TRBL logo" width="250">
</p>
A partially prerendered SvelteKit website with Supabase DB and styling with Tailwind and DaisyUI. Containerized with Docker and Docker Compose.

- [SvelteKit in 100 seconds](https://youtu.be/H1eEFfAkIik)
- [Tailwind in 100 seconds](https://youtu.be/mr15Xzb1Ook)
- [Supabase in 100 seconds](https://youtu.be/zBZgdTb-dns)
- [DaisyUI](https://daisyui.com/components/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Setup project
### New to web dev
> Steps only required if you are new to web dev(No Node/NPM installed), otherwise skip to [Setup](#Setup)

Install [nvm(Node Version Manager)](https://github.com/nvm-sh/nvm) and [Node.js](https://nodejs.org/en), with the following script:
```bash
winget install --id=CoreyButler.NVMforWindows -e
nvm install 25
nvm use 25
```

### Setup
Copy environment variables from [.env.example](./.env.example) to `.env` file, and fill in the required variables

Clone project and install dependencies
```bash
git clone https://github.com/TRBLcoding/trbl-website.git
cd trbl-website
npm install
```

## Developing
Run dev server
```bash
npm run dev
```
