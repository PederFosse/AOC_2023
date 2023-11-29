import type { LinksFunction } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';

import styles from './tailwind.css';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Advent Of Code 2023</title>
        <Meta />
        <Links />
      </head>
      <body className="text-thirdary font-primary">
        <video className="absolute -z-10 inset-0 ring min-w-full min-h-full bg-black object-fill" loop muted autoPlay src="/video/cozy2.mp4" />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
