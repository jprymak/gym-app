import { CalendarCheck, Dumbbell, Home, Users } from "lucide-react";

export const menuItems = [
  {
    title: "",
    list: [
      {
        title: "Home",
        path: "/",
        icon: <Home />,
      },
      {
        title: "Exercises",
        path: "/exercises",
        icon: <Dumbbell />,
      },
      {
        title: "Clients",
        path: "/clients",
        icon: <Users />,
      },

      {
        title: "Schedule",
        path: "/schedule",
        icon: <CalendarCheck />,
      },
    ],
  },
];
