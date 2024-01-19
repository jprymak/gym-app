import {
  ExerciseForm,
  exerciseFormMessages,
} from "@/app/exercises/exerciseForm";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";

import "@testing-library/jest-dom";

jest.mock("next-auth", () => {});

const renderComponent = () => {
  render(<ExerciseForm closeDialog={() => {}} />);
};

const renderComponentWithData = () => {
  const data = {
    created: new Date(),
    demoLink: "",
    id: "6599b7d0ca0bb0ed96b00c59",
    modified: new Date(),
    muscleGroups: ["chest"],
    name: "Bench press",
    scheduledExercise: [],
    userId: "12345",
  };

  const { container } = render(
    <ExerciseForm data={data} closeDialog={() => {}} />
  );

  return { data, container };
};

describe("Exercise Form", () => {
  it("renders all fields and submit button", () => {
    render(<ExerciseForm closeDialog={() => {}} />);

    const nameInput = screen.getByRole("textbox", { name: /exercise name/i });
    const muscleGroupsInput = screen.getByRole("combobox");
    const demoLink = screen.getByRole("textbox", { name: /demo link/i });

    expect(nameInput).toBeInTheDocument();
    expect(muscleGroupsInput).toBeInTheDocument();
    expect(demoLink).toBeInTheDocument();
  });

  it("shows errors when trying to sumbit without required fields", async () => {
    renderComponent();

    const submitBtn = screen.getByRole("button", { name: /submit/i });

    await user.click(submitBtn);

    const nameError = screen.getByText(exerciseFormMessages.nameMinError);
    const muscleGroupsError = screen.getByText(
      exerciseFormMessages.muscleGroupsError
    );

    expect(nameError).toBeInTheDocument();
    expect(muscleGroupsError).toBeInTheDocument();
  });

  it("should be filled with form data in edit mode", async () => {
    const { data } = renderComponentWithData();

    const nameInput = screen.getByRole("textbox", {
      name: /exercise name/i,
    });
    const chip = screen.getByText(data.muscleGroups[0]);

    expect(nameInput).toHaveValue(data.name);
    expect(chip).toBeInTheDocument();
  });
});
