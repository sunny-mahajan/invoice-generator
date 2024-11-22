import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  console.log(process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID, "client id");
  return (
    <Html lang="en">
      <Head>
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4374900296081612`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
