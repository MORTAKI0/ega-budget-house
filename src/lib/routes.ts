export const publicRoutes = {
  home: "/",
  login: "/login",
  signup: "/signup",
} as const;

export const appRoutes = {
  add: "/add",
  review: "/review",
  stats: "/stats",
  settings: "/settings",
} as const;

export const defaultAppRoute = appRoutes.add;
