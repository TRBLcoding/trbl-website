# TRBL website
A SvelteKit website with Supabase DB, styling with Tailwind and DaisyUI

- [SvelteKit in 100 seconds](https://youtu.be/H1eEFfAkIik)
- [Tailwind in 100 seconds](https://youtu.be/mr15Xzb1Ook)
- [Supabase in 100 seconds](https://youtu.be/zBZgdTb-dns)
- [DaisyUI](https://daisyui.com/components/)

## Setup project
### New to web dev
> Steps only required if you are new to web dev(No Node/NPM installed)

Install [nvm(Node Version Manager)](https://github.com/nvm-sh/nvm) and Node
```bash
winget install --id=CoreyButler.NVMforWindows -e
nvm install 22
nvm use 22
```

### Setup
Clone project and install dependencies
```bash
git clone https://github.com/TRBLcoding/trbl-website.git
cd trbl-website
npm install
```

Setup environement variables
- [Supabase setup](https://supabase.com/docs/guides/getting-started/quickstarts/sveltekit)
- [Google app password](https://support.google.com/accounts/answer/185833)
```env
# ./.env
PUBLIC_SUPABASE_URL="..."
PUBLIC_SUPABASE_ANON_KEY="..."

GOOGLE_INTERMEDIARY_EMAIL="..."
GOOGLE_ADMIN_EMAIL="..."
GOOGLE_APP_PASSWORD="..."
```

## Developing
Run dev server
```bash
npm run dev
```
