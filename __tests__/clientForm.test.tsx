import selectEvent from "react-select-event";

import { ClientForm, clientFormMessages } from "@/app/clients/clientForm";
import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";

import "@testing-library/jest-dom";

const renderComponent = () => {
  render(<ClientForm closeDialog={() => {}} />);
};

const renderComponentWithData = () => {
  const data = {
    id: "6595435ae49b40a3c4ad1d43",
    name: "John",
    surname: "Doe",
    email: "test@exqample.com",
    status: "inactive",
    created: "3.01.2024",
    modified: "3.01.2024",
  };

  render(<ClientForm data={data} closeDialog={() => {}} />);

  return { data };
};

describe("Client Form", () => {
  it("renders all fields and submit button", () => {
    renderComponent();

    const nameInput = screen.getByRole("textbox", { name: /^name$/i });
    const surnameInput = screen.getByRole("textbox", { name: /surname/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const statusSelect = screen.getByRole("combobox", { name: /status/i });
    const submitBtn = screen.getByRole("button", { name: /submit/i });

    expect(nameInput).toBeInTheDocument();
    expect(surnameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(statusSelect).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
  });

  it("shows errors when trying to sumbit without required fields", async () => {
    renderComponent();

    const submitBtn = screen.getByRole("button", { name: /submit/i });

    await user.click(submitBtn);

    const nameError = screen.getByText(clientFormMessages.nameMinError);
    const surnameError = screen.getByText(clientFormMessages.surnameMinError);
    const emailError = screen.getByText(clientFormMessages.nameMinError);
    const statusError = screen.getByText(clientFormMessages.statusError);

    expect(nameError).toBeInTheDocument();
    expect(surnameError).toBeInTheDocument();
    expect(emailError).toBeInTheDocument();
    expect(statusError).toBeInTheDocument();
  });

  it("should be filled with form data in edit mode", () => {
    const { data } = renderComponentWithData();

    const nameInput = screen.getByRole("textbox", { name: /^name$/i });
    const surnameInput = screen.getByRole("textbox", { name: /surname/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const statusSelect = screen.getByRole("combobox", { name: /status/i });

    selectEvent.select(statusSelect, "inactive");

    expect(nameInput).toHaveValue(data.name);
    expect(surnameInput).toHaveValue(data.surname);
    expect(emailInput).toHaveValue(data.email);
    expect(screen.getByRole("option", { name: data.status })).toHaveAttribute(
      "data-state",
      "checked"
    );
  });
});
