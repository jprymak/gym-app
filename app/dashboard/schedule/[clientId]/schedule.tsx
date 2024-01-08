"use client";
import { useCallback, useEffect, useState, useTransition } from "react";
import { AlertCircle, Download, Loader2, Save } from "lucide-react";
import { useBeforeunload } from "react-beforeunload";
import { utils,writeFileXLSX } from "xlsx";

import { Alert, AlertDescription,AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {
  Direction,
  MARGINAL_VALUES,
  SCHEDULE_DAY_LIMIT,
} from "@/lib/constants";
import {
  prepareScheduleForExport,
  ScheduledDayWithExercises,
  ScheduledExercise,
} from "@/lib/data";
import { ScheduleWithDaysAndExercises, updateSchedule } from "@/lib/data";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { createInitialDay, createInitialExerciseRow } from "@/lib/initialData";
import { createWorksheetFromData } from "@/lib/worksheet/helpers";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Exercise } from "@prisma/client";

import { AvailableStoredDataDialog } from "./availableStoredDataDialog";
import { columns } from "./columns";
import { ScheduledDay } from "./scheduledDay";

interface ScheduleProps {
  scheduleData: ScheduleWithDaysAndExercises;
  exercises: Exercise[];
}

interface PreparedScheduledDay extends ScheduledDayWithExercises {
  taggedForDelete?: boolean;
}

export interface PreparedScheduledExercise extends ScheduledExercise {
  taggedForDelete?: boolean;
}

type ScheduleItems<T> = T extends PreparedScheduledDay
  ? PreparedScheduledDay
  : PreparedScheduledExercise;

const filterDeletedItems = <T,>(items: ScheduleItems<T>[]) => {
  return items.filter((currentItem) => !currentItem.taggedForDelete);
};

const applyOrdinalNumbers = <T,>(items: ScheduleItems<T>[]) => {
  let counter = 1;
  return items.map((item, i) => {
    if (!item.taggedForDelete) {
      const itemWithNum = { ...item, ordinalNum: counter };
      counter++;
      return itemWithNum;
    } else {
      return item;
    }
  });
};

export const Schedule = ({
  scheduleData: initialData,
  exercises,
}: ScheduleProps) => {
  const [scheduleData, setScheduleData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [scheduleAnimationWrapper] = useAutoAnimate();
  const [daysAnimationWrapper] = useAutoAnimate();
  const [isPending, startTransition] = useTransition();
  const [scheduleIsValid, setScheduleIsValid] = useState(true);

  const scheduledIdKey = `schedule-${scheduleData.id}`;

  const { loadFromStorage, removeFromStorage, saveToStorage } = useLocalStorage(
    scheduledIdKey,
    scheduleData
  );

  const hasChanges =
    JSON.stringify(initialData.days) !== JSON.stringify(scheduleData.days);

  const cannotSaveChanges = isPending || !hasChanges || !scheduleIsValid;

  useEffect(() => {
    const data = loadFromStorage();
    if (data) {
      setOpen(true);
    }
  }, [loadFromStorage]);

  useEffect(() => {
    setScheduleData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (hasChanges) {
      saveToStorage();
    }
  }, [hasChanges, saveToStorage]);

  const validateSchedule = useCallback(() => {
    let valid = true;
    for (let day of scheduleData.days as PreparedScheduledDay[]) {
      if (day.taggedForDelete) {
        continue;
      }
      const exercises = day.exercises as PreparedScheduledExercise[];

      valid = exercises.every((exercise) => {
        if (exercise.taggedForDelete) {
          return true;
        }
        if (!exercise.exerciseId) {
          return false;
        }
        const keysToCheck = Object.keys(
          MARGINAL_VALUES
        ) as (keyof typeof MARGINAL_VALUES)[];
        return keysToCheck.every((key) => {
          const value = exercise[key];
          if (key === "comment") {
            return (
              value.length >= MARGINAL_VALUES[key].min &&
              value.length <= MARGINAL_VALUES[key].max
            );
          }
          return (
            +value >= MARGINAL_VALUES[key].min &&
            +value <= MARGINAL_VALUES[key].max
          );
        });
      });
      if (!valid) {
        return false;
      }
    }

    return valid;
  }, [scheduleData.days]);

  useEffect(() => {
    setScheduleIsValid(validateSchedule());
  }, [scheduleData, validateSchedule]);
  useBeforeunload(hasChanges ? (event) => event.preventDefault() : undefined);

  const reachedLimit = scheduleData.days.length >= SCHEDULE_DAY_LIMIT;

  const addDay = () => {
    const newDay = createInitialDay();
    const exercisesWithOridinals = newDay.exercises.map((ex, index) => ({
      ...ex,
      ordinalNum: index + 1,
    }));
    const updatedSchedule = {
      ...scheduleData,
      days: applyOrdinalNumbers<ScheduledDayWithExercises>([
        ...scheduleData.days,
        { ...newDay, exercises: exercisesWithOridinals },
      ]),
    };
    setScheduleData(updatedSchedule);
  };

  const deleteDay = (idToDelete: string) => {
    const updatedDays = scheduleData.days.reduce<PreparedScheduledDay[]>(
      (result, current) => {
        if (current.id === idToDelete && current.id.startsWith("temp")) {
          return result;
        } else if (current.id === idToDelete) {
          current.ordinalNum = -1;
          result.push({ ...current, taggedForDelete: true });
          return result;
        } else {
          current.ordinalNum = result.length + 1;
          result.push(current);

          return result;
        }
      },
      []
    );

    const updatedSchedule = {
      ...scheduleData,
      days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
    };
    setScheduleData(updatedSchedule);
  };

  const saveChanges = () => {
    startTransition(async () => {
      const result = await updateSchedule(scheduleData);

      if ("error" in result) {
        toast({
          variant: "destructive",
          title: result.error,
        });
      } else {
        toast({
          title: "Schedule was saved.",
        });
      }

      removeFromStorage();
    });
  };

  const addRow = (scheduledDayId: string) => {
    const newRow: any = createInitialExerciseRow();
    const dayToUpdate = scheduleData.days.find(
      (day) => day.id === scheduledDayId
    );
    if (!dayToUpdate) {
      return;
    }

    const updatedDay = {
      ...dayToUpdate,
      exercises: applyOrdinalNumbers<ScheduledExercise>([
        ...dayToUpdate.exercises,
        newRow,
      ]),
    };

    const indexOfDayToUpdate = scheduleData.days.findIndex(
      (day) => day.id === scheduledDayId
    );

    const updatedDays = [...scheduleData.days];

    updatedDays.splice(indexOfDayToUpdate, 1, updatedDay);

    const updatedSchedule = {
      ...scheduleData,
      days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
    };

    setScheduleData(updatedSchedule);
  };

  const deleteRow = (scheduledDayId: string, rowToDeleteId: string) => {
    const dayToUpdate = scheduleData.days.find(
      (day) => day.id === scheduledDayId
    );
    if (!dayToUpdate) {
      return;
    }

    const newExercises = dayToUpdate.exercises.reduce<
      PreparedScheduledExercise[]
    >((result, current) => {
      if (current.id === rowToDeleteId && current.id.startsWith("temp")) {
        return result;
      } else if (current.id === rowToDeleteId) {
        current.ordinalNum = -1;
        result.push({ ...current, taggedForDelete: true });
        return result;
      } else {
        current.ordinalNum = result.length + 1;
        result.push(current);

        return result;
      }
    }, []);

    const updatedDay = {
      ...dayToUpdate,
      exercises: applyOrdinalNumbers(newExercises),
    };

    const indexOfDayToUpdate = scheduleData.days.findIndex(
      (day) => day.id === scheduledDayId
    );

    const updatedDays = [...scheduleData.days];

    updatedDays.splice(indexOfDayToUpdate, 1, updatedDay);

    const updatedSchedule = {
      ...scheduleData,
      days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
    };

    setScheduleData(updatedSchedule);
  };

  const updateRow = (
    scheduledDayId: string,
    columnId: string,
    value: string,
    rowId: string
  ) => {
    const dayToUpdate = scheduleData.days.find(
      (day) => day.id === scheduledDayId
    );

    if (!dayToUpdate) {
      return;
    }

    const updatedExercises = dayToUpdate.exercises.map((scheduledExercise) => {
      if (columnId && scheduledExercise.id === rowId) {
        return { ...scheduledExercise, [columnId]: value };
      }
      return scheduledExercise;
    });

    const updatedDay = {
      ...dayToUpdate,
      exercises: updatedExercises,
    };

    const indexOfDayToUpdate = scheduleData.days.findIndex(
      (day) => day.id === scheduledDayId
    );

    const updatedDays = [...scheduleData.days];

    updatedDays.splice(indexOfDayToUpdate, 1, updatedDay);

    const updatedSchedule = {
      ...scheduleData,
      days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
    };

    setScheduleData(updatedSchedule);
  };

  const reorderExercises = (
    scheduledDayId: string,
    array: PreparedScheduledExercise[]
  ) => {
    const dayToUpdate = scheduleData.days.find(
      (day) => day.id === scheduledDayId
    );
    if (!dayToUpdate) {
      return;
    }

    const updatedDay = {
      ...dayToUpdate,
      exercises: applyOrdinalNumbers<ScheduledExercise>(array),
    };

    const indexOfDayToUpdate = scheduleData.days.findIndex(
      (day) => day.id === scheduledDayId
    );

    const newDays = [...scheduleData.days];

    newDays.splice(indexOfDayToUpdate, 1, updatedDay);

    setScheduleData((prev) => ({ ...prev, days: newDays }));
  };

  const moveDay = (scheduledDayId: string, direction: Direction) => {
    const updatedDays = [...scheduleData.days];

    const oldIndex = updatedDays.findIndex((day) => day.id === scheduledDayId);

    const newIndex = direction === Direction.Down ? oldIndex + 1 : oldIndex - 1;

    const temp = updatedDays[newIndex];
    updatedDays[newIndex] = updatedDays[oldIndex];
    updatedDays[oldIndex] = temp;

    setScheduleData((prev) => ({
      ...prev,
      days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
    }));
  };

  const handleOpenDialog = () => {
    setOpen(false);
  };

  const acceptLoadFromStorage = () => {
    const data = loadFromStorage();
    if (data) {
      setScheduleData(data);
      setOpen(false);
    }
  };

  const rejectLoadFromStorage = () => {
    removeFromStorage();
    setOpen(false);
  };

  const exportData = async () => {
    try {
      const result = await prepareScheduleForExport(scheduleData.clientId);
      if (!result) return;

      const { clientName, clientSurname } = result;

      const ws = createWorksheetFromData(result);

      //create new workbook
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, ws, "Date range here"); //TO DO: Pass date range here once date-rage feature is ready

      //write file
      writeFileXLSX(workbook, `${clientName} ${clientSurname}.xlsx`);

      toast({
        title: "Schedule was exported.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Schedule could not be exported.",
      });
    }
  };

  return (
    <div className="flex flex-col w-full justify-end gap-2 mb-5 p-5 border-2 rounded-md">
      <div ref={scheduleAnimationWrapper}>
        {!scheduleIsValid && (
          <Alert variant="destructive" className="mb-5">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Schedule cannot be saved. One or more fields have invalid or
              missing values.
            </AlertDescription>
          </Alert>
        )}
      </div>
      <div className="flex gap-2 mb-5">
        <Button
          onClick={saveChanges}
          disabled={cannotSaveChanges}
          {...(hasChanges &&
            !cannotSaveChanges && { className: "animate-bounce" })}
        >
          {isPending ? (
            <>
              <span className="mr-2">
                <Loader2 className="animate-spin" />
              </span>
              Saving...
            </>
          ) : (
            <Save />
          )}
        </Button>
        <Button disabled={hasChanges} onClick={exportData}>
          <Download />
        </Button>
        <Button disabled={reachedLimit} className="" onClick={addDay}>
          Add day
        </Button>
      </div>
      <div ref={daysAnimationWrapper} className="flex flex-col gap-5">
        {filterDeletedItems<PreparedScheduledDay>(scheduleData.days).map(
          (day, index) => {
            return (
              <ScheduledDay
                key={day.id}
                columns={columns}
                data={filterDeletedItems<PreparedScheduledExercise>(
                  day.exercises
                )}
                exercises={exercises}
                deleteDay={deleteDay}
                scheduledDayId={day.id}
                title={(index + 1).toString()}
                addRow={addRow}
                deleteRow={deleteRow}
                updateRow={updateRow}
                reorderExercises={reorderExercises}
                moveDay={moveDay}
                isFirst={index === 0}
                isLast={index === scheduleData.days.length - 1}
              />
            );
          }
        )}
      </div>
      <AvailableStoredDataDialog
        open={open}
        setOpen={handleOpenDialog}
        handleAccept={acceptLoadFromStorage}
        handleReject={rejectLoadFromStorage}
      />
    </div>
  );
};
