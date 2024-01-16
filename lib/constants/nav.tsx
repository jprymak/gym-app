import { CalendarCheck, Dumbbell, Users } from "lucide-react";

export const menuItems = [
  {
    title: "",
    list: [
      {
        title: "Clients",
        path: "/clients",
        icon: <Users />,
      },
      {
        title: "Exercises",
        path: "/exercises",
        icon: <Dumbbell />,
      },
      {
        title: "Schedule",
        path: "/schedule",
        icon: <CalendarCheck />,
      },
    ],
  },
];
