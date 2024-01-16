export const getHeaderString = (pathname: string) => {
  if (pathname === "/") return "Homepage";
  const pathnames = pathname.split("/");
  if (pathnames[pathnames.length - 2] === "schedule") {
    return "Schedule";
  }
  return pathname.split("/").pop();
};
