import { utils } from "xlsx";

import {
  ScheduledExercisePreparedForExport,
  SchedulePreparedForExport,
} from "../data";

export const createWorksheetFromData = (result: SchedulePreparedForExport) => {
  const { days, clientName, clientSurname } = result;

  const columnsCount = Object.keys(days[0].exercises[0]).length;

  /* gathers info about width for each column based on content length */
  const maxLengths: Record<string, number> = {};

  /* extract exercises from each day and calculate column widths */
  const tables = days.map((day) => {
    day.exercises.forEach((exercise) => {
      Object.keys(exercise).forEach((key, index) => {
        const keyOrValueLength = Math.max(
          key.length,
          exercise[key as keyof ScheduledExercisePreparedForExport].toString()
            .length
        );
        maxLengths[index] = maxLengths[index]
          ? Math.max(keyOrValueLength, maxLengths[index])
          : keyOrValueLength;
      });
    });
    return day.exercises;
  });

  /* create new worksheet */
  const ws = utils.sheet_new();

  /* collects indexes of rows for column merge */
  const rowIndexesForColumnMerge: number[] = [0];

  let counter = 1;

  tables.forEach((table, index) => {
    /* insert day number */
    if (index === 0) {
      rowIndexesForColumnMerge.push(counter);
      /* leave first part without empty rows above */
      utils.sheet_add_json(
        ws,
        [{ "1": `Schedule - ${clientName} ${clientSurname}` }],
        {
          origin: -1,
          skipHeader: true,
        }
      );
      utils.sheet_add_json(ws, [{ "1": `Day - ${index + 1}` }], {
        origin: -1,
        skipHeader: true,
      });
    } else {
      rowIndexesForColumnMerge.push(counter);
      /* set two empty rows above following days ("", "") */
      utils.sheet_add_json(ws, ["", "", { "1": `Day - ${index + 1}` }], {
        origin: -1,
        skipHeader: true,
      });
    }
    /* insert proper data */
    utils.sheet_add_json(ws, table, {
      origin: -1,
      skipHeader: false,
    });
    counter += table.length + 4;
  });

  /* create !cols array if it does not exist */
  if (!ws["!cols"]) ws["!cols"] = [];

  /* apply width to each column */
  for (let i = 0; i <= columnsCount; i++) {
    ws["!cols"][i] = { width: maxLengths[i] + 2 };
  }

  /* merge columns with Day number */
  const merge = [];
  for (const index of rowIndexesForColumnMerge) {
    merge.push({ s: { r: index, c: 0 }, e: { r: index, c: columnsCount } });
  }
  ws["!merges"] = merge;

  return ws;
};
