import { ClientDataTable } from "@/app/dashboard/clients/clientsDataTable";
import { render, screen, within } from "@testing-library/react";
import user from "@testing-library/user-event";

import "@testing-library/jest-dom";

const mockTableData = [
  {
    id: "6595435ae49b40a3c4ad1d43",
    name: "John",
    surname: "Doe",
    email: "test1@example.com",
    status: "inactive",
    created: "3.01.2024",
    modified: "3.01.2024",
  },
  {
    id: "6595878d61c86066770679f5",
    name: "Qwerty",
    surname: "Uiop",
    email: "test2@example.com",
    status: "injured",
    created: "3.01.2024",
    modified: "3.01.2024",
  },
  {
    id: "6595bda661c8606677067a15",
    name: "Asdf",
    surname: "Ghjkl",
    email: "test3@example.com",
    status: "active",
    created: "3.01.2024",
    modified: "3.01.2024",
  },
];

const renderComponent = () => {
  render(<ClientDataTable data={mockTableData} />);
};

describe("Clients Table", () => {
  it("renders all columns and key elements", async () => {
    renderComponent();

    //headers
    const name = screen.getByRole("columnheader", { name: /^name$/i });
    const surname = screen.getByRole("columnheader", {
      name: /surname/i,
    });
    const created = screen.getByRole("columnheader", { name: /created/i });
    const actions = screen.getByRole("columnheader", { name: /actions/i });

    expect(name).toBeInTheDocument();
    expect(surname).toBeInTheDocument();
    expect(created).toBeInTheDocument();
    expect(actions).toBeInTheDocument();

    //action buttons
    const addClient = screen.getByRole("button", {
      name: /add client/i,
    });
    const editClientBtns = screen.getAllByRole("button", {
      name: /edit client/i,
    });
    const deleteClientBtns = screen.getAllByRole("button", {
      name: /delete client/i,
    });
    expect(addClient).toBeInTheDocument();
    expect(editClientBtns[0]).toBeInTheDocument();
    expect(deleteClientBtns[0]).toBeInTheDocument();

    //search bar
    const searchBar = screen.getByRole("textbox");
    expect(searchBar).toBeInTheDocument();
  });

  it("allows filtering by search string", async () => {
    renderComponent();

    //string present in name
    const searchBar = screen.getByRole("textbox");
    await user.click(searchBar);
    await user.keyboard("qwerty");

    expect(screen.getAllByRole("row")).toHaveLength(2); //header row included, that is why 2

    //string present in surname
    await user.click(screen.getByRole("textbox"));
    await user.clear(screen.getByRole("textbox"));
    await user.keyboard("Ghjkl");

    expect(screen.getAllByRole("row")).toHaveLength(2);
  });

  it("opens form dialog if add or edit client is clicked, can close dialog", async () => {
    renderComponent();

    const editClientBtns = screen.getAllByRole("button", {
      name: /edit client/i,
    });

    await user.click(editClientBtns[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add client/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens delete confirmation dialog if delete client is clicked, closes dialog on cancel", async () => {
    renderComponent();

    //delete specific row
    const rowZero = screen.getByTestId("row-0");
    const deleteClient = within(rowZero).getByRole("button", {
      name: /delete client/i,
    });
    await user.click(deleteClient);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /delete client/i })
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it.only("can sort rows", async () => {
    renderComponent();

    //name column
    const name = screen.getByRole("button", {
      name: /^name$/i,
      hidden: true,
    });

    const rowThree = screen.getByTestId("row-2");
    expect(
      within(rowThree).getByRole("cell", { name: /asdf/i })
    ).toBeInTheDocument();

    await user.click(name);

    let rowZero = screen.getByTestId("row-0");
    expect(
      within(rowZero).getByRole("cell", { name: /asdf/i })
    ).toBeInTheDocument();

    //surname column
    const surname = screen.getByRole("button", {
      name: /surname/i,
      hidden: true,
    });

    await user.click(surname);

    const rowOne = screen.getByTestId("row-1");
    expect(
      within(rowOne).getByRole("cell", { name: /ghjkl/i })
    ).toBeInTheDocument();

    //email column
    const email = screen.getByRole("button", { name: /email/i });

    await user.click(email);

    const rowTwo = screen.getByTestId("row-2");
    expect(
      within(rowTwo).getByRole("cell", { name: /ghjkl/i })
    ).toBeInTheDocument();

    //status column
    const status = screen.getByRole("button", { name: /status/i });

    await user.click(status);

    rowZero = screen.getByTestId("row-0");
    expect(
      within(rowZero).getByRole("cell", { name: /ghjkl/i })
    ).toBeInTheDocument();
  });
});
