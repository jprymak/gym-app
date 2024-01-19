"use client";
import { createContext, useContext, useState } from "react";

type DialogContextType = {
  openDialogs: {
    edit: boolean;
    delete: boolean;
  };
  triggerOpenDialog: (rowData: any, dialogType: string) => void;
  rowData: any;
  close: (dialogType: string) => void;
};

export const DialogContext = createContext<DialogContextType | null>(null);

export const DialogContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [openDialogs, setOpenDialogs] = useState({
    edit: false,
    delete: false,
  });
  const [rowData, setRowData] = useState(null);

  const triggerOpenDialog = (data: any, dialogType: string) => {
    setRowData(data);
    setOpenDialogs((prev) => ({ ...prev, [dialogType]: true }));
  };
  const close = (dialogType: string) => {
    setRowData(null);
    setOpenDialogs((prev) => ({ ...prev, [dialogType]: false }));
  };

  return (
    <DialogContext.Provider
      value={{ openDialogs, triggerOpenDialog, rowData, close }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const useDialogContext = () => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error(
      "useDialogContext must be used inside the DialogContextProvider"
    );
  }

  return context;
};
