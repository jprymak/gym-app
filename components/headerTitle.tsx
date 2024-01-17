interface HeaderTitleProps {
  pathname: string;
}

export const HeaderTitle = ({ pathname }: HeaderTitleProps) => {
  let title = "";
  const pathnames = pathname.split("/");

  if (pathname === "/") {
    title = "Gym App";
  } else if (pathnames[pathnames.length - 2] === "schedule") {
    title = "Schedule";
  } else {
    title = pathname.split("/").pop() || "";
  }

  return <h1 className="text-2xl font-bold mr-auto">{title}</h1>;
};
