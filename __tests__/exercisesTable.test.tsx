import { ExercisesDataTable } from "@/app/exercises/exercisesDataTable";
import { DialogContextProvider } from "@/lib/context/useDialogContext";
import type { ExerciseWithScheduledExercises } from "@/lib/data/types";
import { render, screen, within } from "@testing-library/react";
import user from "@testing-library/user-event";

import "@testing-library/jest-dom";

jest.mock("next-auth", () => {});

const mockTableData: ExerciseWithScheduledExercises[] = [
  {
    id: "6599b7d0ca0bb0ed96b00c59",
    name: "Bench press",
    muscleGroups: ["chest"],
    demoLink: "",
    created: new Date(),
    modified: new Date(),
    scheduledExercise: [],
    userId: "12345",
  },
  {
    id: "659b27079f02df1dcc253c4c",
    name: "Squat",
    muscleGroups: ["quadriceps"],
    demoLink: "",
    created: new Date(),
    modified: new Date(),
    scheduledExercise: [],
    userId: "12345",
  },
  {
    id: "65a07f0c7fe7e9ada3d348a1",
    name: "Deadlift",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    demoLink: "",
    created: new Date(),
    modified: new Date(),
    scheduledExercise: [{ id: "12345" }],
    userId: "12345",
  },
];

const renderComponent = () => {
  render(
    <DialogContextProvider>
      <ExercisesDataTable data={mockTableData} />
    </DialogContextProvider>
  );
};

describe("Exercise Table", () => {
  it("renders all columns and key elements", async () => {
    renderComponent();

    //headers
    const name = screen.getByRole("columnheader", { name: /name/i });
    const muscleGroups = screen.getByRole("columnheader", {
      name: /muscle groups/i,
    });
    const demo = screen.getByRole("columnheader", { name: /demo/i });
    const create = screen.getByRole("columnheader", { name: /created/i });
    const modified = screen.getByRole("columnheader", { name: /modified/i });
    const actions = screen.getByRole("columnheader", { name: /actions/i });

    expect(name).toBeInTheDocument();
    expect(muscleGroups).toBeInTheDocument();
    expect(demo).toBeInTheDocument();
    expect(create).toBeInTheDocument();
    expect(modified).toBeInTheDocument();
    expect(actions).toBeInTheDocument();

    //action buttons
    const addExerciseBtns = screen.getAllByRole("button", {
      name: /add exercise/i,
    });
    const editExerciseBtns = screen.getAllByRole("button", {
      name: /edit exercise/i,
    });
    const deleteExercise = screen.getAllByRole("button", {
      name: /delete exercise/i,
    });
    expect(addExerciseBtns[0]).toBeInTheDocument();
    expect(editExerciseBtns[0]).toBeInTheDocument();
    expect(deleteExercise[0]).toBeInTheDocument();

    //optional bulk delete button
    const selectAll = screen.getByRole("checkbox", { name: /select all/i });
    await user.click(selectAll);

    const deleteExercises = screen.getByRole("button", {
      name: /Delete exercises/i,
    });

    expect(deleteExercises).toBeInTheDocument();

    //search bar
    const searchBar = screen.getByRole("textbox");
    expect(searchBar).toBeInTheDocument();
  });

  it("filter rows by search string", async () => {
    renderComponent();

    //string present in name
    const searchBar = screen.getByRole("textbox");
    await user.click(searchBar);
    await user.keyboard("bench");

    expect(screen.getAllByRole("row")).toHaveLength(2); //header row included, that is why 2

    //string present in muscle group
    await user.click(screen.getByRole("textbox"));
    await user.clear(screen.getByRole("textbox"));
    await user.keyboard("quadriceps");

    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("opens form dialog if add or edit exercise is clicked, can close dialog", async () => {
    renderComponent();

    const editExerciseBtns = screen.getAllByRole("button", {
      name: /edit exercise/i,
    });

    await user.click(editExerciseBtns[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add exercise/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens delete confirmation dialog if delete exercise is clicked, closes dialog on cancel", async () => {
    renderComponent();

    //delete specific row
    const rowZero = screen.getByTestId("row-0");
    const deleteExercise = within(rowZero).getByRole("button", {
      name: /delete exercise/i,
    });
    await user.click(deleteExercise);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /delete exercise/i })
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    //bundle delete
    const checkbox = screen.getByRole("checkbox", { name: /select all/i });
    await user.click(checkbox);
    const deleteExercises = screen.getByRole("button", {
      name: /delete exercises/i,
    });
    await user.click(deleteExercises);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /delete exercise/i })
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("can sort rows", async () => {
    renderComponent();

    //name column
    const nameColumn = screen.getByRole("button", {
      name: /name/i,
      hidden: true,
    });

    const rowThree = screen.getByTestId("row-2");

    expect(
      within(rowThree).getByRole("cell", { name: /deadlift/i })
    ).toBeInTheDocument();

    await user.click(nameColumn);
    const rowOne = screen.getByTestId("row-1");
    expect(
      within(rowOne).getByRole("cell", { name: /deadlift/i })
    ).toBeInTheDocument();
  });
  it("disables checkboxes and delete buttons for assigned exercises", async () => {
    renderComponent();

    const rowTwo = screen.getByTestId("row-2");
    expect(within(rowTwo).getByRole("checkbox")).toBeDisabled();
    expect(
      within(rowTwo).getByRole("button", {
        name: /delete/i,
      })
    ).toBeDisabled();

    const checkAll = screen.getByRole("checkbox", { name: /select all/i });
    await user.click(checkAll);
    expect(within(rowTwo).getByRole("checkbox")).toBeDisabled();
  });
});
