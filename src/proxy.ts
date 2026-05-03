import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

import { appRoutes, defaultAppRoute, publicRoutes } from "@/lib/routes";

const isAuthPage = createRouteMatcher([publicRoutes.login, publicRoutes.signup]);
const isProtectedRoute = createRouteMatcher([
  appRoutes.add,
  appRoutes.review,
  appRoutes.stats,
  appRoutes.settings,
]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const isAuthenticated = await convexAuth.isAuthenticated();

  if (isAuthPage(request) && isAuthenticated) {
    return nextjsMiddlewareRedirect(request, defaultAppRoute);
  }

  if (isProtectedRoute(request) && !isAuthenticated) {
    return nextjsMiddlewareRedirect(request, publicRoutes.login);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
