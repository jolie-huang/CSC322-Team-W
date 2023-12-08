import Head from "next/head";

const HeadTags = () => (
  <>
    <Head>
      {/* Setting the viewport for responsive design */}
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      {/* Setting character encoding */}
      <meta charSet="UTF-8" />
      {/* Adding a favicon */}
      <link rel="icon" href="/favicon.ico" sizes="16*16" type="image/png" />
      {/* Linking external CSS files */}
      <link rel="stylesheet" type="text/css" href="/listMessages.css" />
      <link rel="stylesheet" type="text/css" href="/styles.css" />
      <link rel="stylesheet" type="text/css" href="/nprogress.css" />

      {/* Setting the title of the page */}
      <title>SocialPulse</title>
    </Head>
  </>
);
export default HeadTags;
