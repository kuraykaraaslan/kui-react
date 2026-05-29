'use client';

import Script from 'next/script';

/**
 * Injects the Google Analytics (gtag.js) snippet. Reads the measurement ID
 * from `NEXT_PUBLIC_GOOGLE_TAG` and renders nothing when it is unset, so the
 * site stays clean in environments without analytics configured.
 */
export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GOOGLE_TAG;

  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
