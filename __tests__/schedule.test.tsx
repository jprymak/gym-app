import { Schedule } from "@/app/schedule/[clientId]/schedule";
import { ScheduleWithDaysAndExercises } from "@/lib/data/types";
import { Exercise } from "@prisma/client";
import { render, screen, within } from "@testing-library/react";
import user from "@testing-library/user-event";

import "@testing-library/jest-dom";

//disable animations for testing purposes
jest.mock("@formkit/auto-animate/react", () => ({
  useAutoAnimate: () => [null],
}));

const mockScheduleData: ScheduleWithDaysAndExercises = {
  id: "6595d5ae61c8606677067a28",
  clientId: "6595d5ae61c8606677067a27",
  created: new Date("2024-01-03T21:46:22.000Z"),
  modified: new Date("2024-01-03T21:46:22.000Z"),
  days: [
    {
      id: "65a155075002e91c35f2f623",
      scheduleId: "6595d5ae61c8606677067a28",
      ordinalNum: 1,
      exercises: [
        {
          id: "65a2d784df5ea4e5cfc17d4e",
          sets: "1",
          reps: "1",
          rpe: "1",
          exerciseId: "659b27079f02df1dcc253c4c",
          comment: "",
          scheduledDayId: "65a155075002e91c35f2f623",
          ordinalNum: 1,
        },
      ],
    },
  ],
};

const mockExercises: Exercise[] = [
  {
    id: "6599b7d0ca0bb0ed96b00c59",
    name: "Bench press",
    muscleGroups: ["chest"],
    demoLink: "",
    created: new Date("2024-01-06T20:28:00.000Z"),
    modified: new Date("2024-01-06T20:28:00.000Z"),
    userId: "12345",
  },
  {
    id: "659b27079f02df1dcc253c4c", //initially selected in schedule above
    name: "Squat",
    muscleGroups: ["quadriceps"],
    demoLink: "",
    created: new Date("2024-01-07T22:34:47.000Z"),
    modified: new Date("2024-01-07T22:34:47.000Z"),
    userId: "12345",
  },
];

const renderComponent = () => {
  render(
    <Schedule scheduleData={mockScheduleData} exercises={mockExercises} />
  );
};

//TO DO: test exercise drag and drop in cypress
describe("Schedule", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("allows you to add and delete day", async () => {
    renderComponent();

    const day = screen.getByTestId("day-1");
    const addDay = screen.getByRole("button", { name: /add day/i });

    //add day
    await user.click(addDay);
    expect(screen.getAllByRole("table")).toHaveLength(2);

    //delete day
    const deleteDay = within(day).getByRole("button", { name: /delete day/i });
    await user.click(deleteDay);
    expect(screen.getAllByRole("table")).toHaveLength(1);
  });

  it("allows you to add, copy and delete exercise", async () => {
    renderComponent();

    const day = screen.getByTestId("day-1");
    const tBody = within(day).getByTestId("tbody");
    const exerciseRow = within(day).getByTestId("row-0");
    const copyRow = within(exerciseRow).getByRole("button", {
      name: /copy row/i,
    });
    const addExerciseRow = within(day).getByRole("button", {
      name: /add exercise row/i,
    });

    //add and copy  exercise
    await user.click(addExerciseRow);
    await user.click(copyRow);
    let exerciseRows = within(tBody).getAllByRole("row");
    expect(exerciseRows).toHaveLength(3);

    //delete exercise
    const deleteRow = within(exerciseRow).getByRole("button", {
      name: /delete row/i,
    });
    await user.click(deleteRow);
    exerciseRows = within(tBody).getAllByRole("row");
    expect(exerciseRows).toHaveLength(2);
  });

  it("allows you to input data within exercise and validate", async () => {
    renderComponent();

    const exercise = screen.getByRole("combobox");
    const sets = screen.getByRole("spinbutton", { name: /sets/i });
    const reps = screen.getByRole("spinbutton", { name: /reps/i });
    const rpe = screen.getByRole("spinbutton", { name: /rpe/i });
    const comment = screen.getByRole("textbox");
    const save = screen.getByRole("button", { name: /save changes/i });

    //change input in all fields and assert change
    await user.click(exercise);
    const benchPressOption = screen.getByRole("option", {
      name: /bench press/i,
    });
    await user.click(benchPressOption);
    await user.click(sets);
    await user.keyboard("{Backspace}{8}");

    await user.click(reps);
    await user.keyboard("{Backspace}{7}");

    await user.click(rpe);
    await user.keyboard("{Backspace}{6}");

    await user.click(comment);
    await user.keyboard("heavy");

    expect(sets).toHaveDisplayValue("8");
    expect(reps).toHaveDisplayValue("7");
    expect(rpe).toHaveDisplayValue("6");
    expect(comment).toHaveDisplayValue("heavy");
    expect(exercise).toHaveTextContent(/bench press/i);

    //change input one by one and check if validation works

    //sets validation
    await user.click(screen.getByRole("spinbutton", { name: /sets/i }));
    await user.keyboard("{Backspace}{-}{5}");

    //click away to trigger state change
    await user.click(comment);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(save).toBeDisabled();

    await user.click(screen.getByRole("spinbutton", { name: /sets/i }));
    await user.keyboard("{Backspace}{Backspace}{5}");
    await user.click(comment);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(save).toBeEnabled();

    //reps validation
    await user.click(reps);
    await user.keyboard("{Backspace}{-}{5}");

    //click away to trigger state change
    await user.click(comment);

    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.click(reps);
    await user.keyboard("{Backspace}{Backspace}{5}");
    await user.click(comment);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    //rpe validation
    await user.click(rpe);
    await user.keyboard("{Backspace}{-}{5}");

    //click away to trigger state change
    await user.click(comment);

    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.click(rpe);
    await user.keyboard("{Backspace}{Backspace}{5}");
    await user.click(comment);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    //exercise validation
    await user.click(exercise);
    await user.click(
      screen.getByRole("option", {
        name: /bench press/i,
      })
    );
    //click away to trigger state change
    await user.click(comment);

    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.click(exercise);
    await user.click(
      screen.getByRole("option", {
        name: /bench press/i,
      })
    );
    await user.click(comment);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("allows you to swap days", async () => {
    renderComponent();

    let dayOne = screen.getByTestId("day-1");
    const addDay = screen.getByRole("button", { name: /add day/i });

    //add day
    await user.click(addDay);

    const dayTwo = screen.getByTestId("day-2");

    let textBoxOne = within(dayOne).getByRole("textbox");
    await user.click(textBoxOne);
    await user.keyboard("1");

    const textBoxTwo = within(dayTwo).getByRole("textbox");
    await user.click(textBoxTwo);
    await user.keyboard("2");

    //swap days
    const moveDown = within(dayOne).getByRole("button", {
      name: /move down/i,
    });
    await user.click(moveDown);
    dayOne = screen.getByTestId("day-1");

    //assert
    textBoxOne = within(dayOne).getByRole("textbox");
    expect(textBoxOne).toHaveDisplayValue("2");
  });

  it("disables add day if limit is reached", async () => {
    renderComponent();
    const addDay = screen.getByRole("button", { name: /add day/i });

    for (let i = 1; i <= 6; i++) {
      await user.click(addDay);
    }

    expect(addDay).toBeDisabled();
  });

  it("disables add/copy exercise buttons if limit is reached", async () => {
    renderComponent();

    const dayOne = screen.getByTestId("day-1");
    const exerciseRow = within(dayOne).getByTestId("row-0");
    const copyRow = within(exerciseRow).getByRole("button", {
      name: /copy row/i,
    });
    const addExerciseRow = within(dayOne).getByRole("button", {
      name: /add exercise row/i,
    });

    for (let i = 1; i <= 7; i++) {
      await user.click(addExerciseRow);
    }

    expect(copyRow).toBeDisabled();
    expect(addExerciseRow).toBeDisabled();
  });

  it("disables move down button for last visible day", async () => {
    renderComponent();

    let dayOne = screen.getByTestId("day-1");

    let moveDown = within(dayOne).getByRole("button", {
      name: /move down/i,
    });
    const addDay = screen.getByRole("button", {
      name: /add day/i,
    });

    await user.click(addDay);
    await user.click(moveDown);

    const dayTwo = screen.getByTestId("day-2");
    const deleteDay = within(dayTwo).getByRole("button", {
      name: /delete day/i,
    });

    await user.click(deleteDay);

    dayOne = screen.getByTestId("day-1");
    moveDown = within(dayOne).getByRole("button", {
      name: /move down/i,
    });

    expect(moveDown).toBeDisabled();
  });
});
