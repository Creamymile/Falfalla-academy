export type Route =
  | { name: "home" }
  | { name: "courses" }
  | { name: "dashboard" }
  | { name: "gallery" }
  | { name: "upload" }
  | { name: "pricing" }
  | { name: "profile" }
  | { name: "certificate" }
  | { name: "checkout" }
  | { name: "course"; slug: string }
  | { name: "lesson"; slug: string; lessonId: string }
  | { name: "admin" }
  | { name: "login" }
  | { name: "redeem" }
  | { name: "terms" }
  | { name: "privacy" }
  | { name: "notFound" };

export function routeFromHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const parts = hash.split("/").filter(Boolean);
  if (parts[0] === "courses" && parts[1] && parts[2] === "lessons" && parts[3])
    return { name: "lesson", slug: parts[1], lessonId: parts[3] };
  if (parts[0] === "courses" && parts[1]) return { name: "course", slug: parts[1] };
  if (parts[0] === "courses") return { name: "courses" };
  if (parts[0] === "dashboard") return { name: "dashboard" };
  if (parts[0] === "gallery") return { name: "gallery" };
  if (parts[0] === "upload") return { name: "upload" };
  if (parts[0] === "pricing") return { name: "pricing" };
  if (parts[0] === "profile") return { name: "profile" };
  if (parts[0] === "certificate") return { name: "certificate" };
  if (parts[0] === "checkout") return { name: "checkout" };
  if (parts[0] === "admin") return { name: "admin" };
  if (parts[0] === "login") return { name: "login" };
  if (parts[0] === "redeem") return { name: "redeem" };
  if (parts[0] === "terms") return { name: "terms" };
  if (parts[0] === "privacy") return { name: "privacy" };
  if (parts.length === 0 || !parts[0]) return { name: "home" };
  return { name: "notFound" };
}

export function pathFor(route: Route) {
  switch (route.name) {
    case "home": return "#/";
    case "courses": return "#/courses";
    case "dashboard": return "#/dashboard";
    case "gallery": return "#/gallery";
    case "upload": return "#/upload";
    case "pricing": return "#/pricing";
    case "profile": return "#/profile";
    case "certificate": return "#/certificate";
    case "checkout": return "#/checkout";
    case "course": return `#/courses/${route.slug}`;
    case "lesson": return `#/courses/${route.slug}/lessons/${route.lessonId}`;
    case "admin": return "#/admin";
    case "login": return "#/login";
    case "redeem": return "#/redeem";
    case "terms": return "#/terms";
    case "privacy": return "#/privacy";
    case "notFound": return "#/404";
  }
}

export function go(route: Route) {
  window.location.hash = pathFor(route);
}
