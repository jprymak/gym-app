import {
  ExerciseForm,
  exerciseFormMessages,
} from "@/app/dashboard/exercises/exerciseForm";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";

import "@testing-library/jest-dom";

const renderComponent = () => {
  render(<ExerciseForm closeDialog={() => {}} />);
};

const renderComponentWithData = () => {
  const data = {
    created: "6.01.2024",
    demoLink: "",
    id: "6599b7d0ca0bb0ed96b00c59",
    modified: "6.01.2024",
    muscleGroups: ["chest"],
    name: "Bench press",
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
