import App from "next/app";
import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";
import "react-toastify/dist/ReactToastify.css";
import "semantic-ui-css/semantic.min.css";
import "cropperjs/dist/cropper.css";
import baseUrl from "../utils/baseUrl";
import { redirectUser } from "../utils/authUser";
import Layout from "../components/Layout/Layout";
import "../public/styles.css";
// MyApp component extending Next.js App
class MyApp extends App {
  // getInitialProps method to fetch initial props before rendering the app
  static async getInitialProps({ Component, ctx }) {
    // Parse cookies from the request context
    const { token } = parseCookies(ctx);
    // Initialize pageProps object
    let pageProps = {};

    // Protected Routes not accessible to the user if not logged in.
    const protectedRoutes =
      ctx.pathname === "/" ||
      ctx.pathname == "/trendy" ||
      ctx.pathname === "/[username]" ||
      ctx.pathname === "/notifications" ||
      ctx.pathname === "/post/[postId]" ||
      ctx.pathname === "/messages" ||
      ctx.pathname === "/search" ||
      ctx.pathname === "/extsearch";
    // If user is not logged in and accessing protected route, redirect to /popular
    if (!token) {
      protectedRoutes && redirectUser(ctx, "/popular");
    } else {
      // If user is logged in, check authentication and fetch initial props
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
      }

      try {
        // Fetch user data and follow stats from the authentication API
        const res = await axios.get(`${baseUrl}/api/auth`, {
          headers: { Authorization: token },
        });
        const { user, userFollowStats } = res.data;

        if (user) {
          // If user is authenticated and accessing non-protected route, redirect to /
          !protectedRoutes && redirectUser(ctx, "/");
        }
        // Update pageProps with user and userFollowStats data

        pageProps.user = user;
        pageProps.userFollowStats = userFollowStats;
      } catch (error) {
        // If authentication fails, destroy token and redirect to /popular
        destroyCookie(ctx, "token");
        redirectUser(ctx, "/popular");
      }
    }
    // Return the merged pageProps
    return { pageProps };
  }

  // Render method to render the app component
  render() {
    const { Component, pageProps } = this.props;
    // Render the Layout component with the wrapped Component and pageProps
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
