"use client";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  AlertCircle,
  CalendarPlus,
  Download,
  Loader2,
  Save,
} from "lucide-react";
import { useBeforeunload } from "react-beforeunload";
import { utils, writeFileXLSX } from "xlsx";

import { IconButton } from "@/components/iconButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { prepareScheduleForExport } from "@/lib/data";
import { updateSchedule } from "@/lib/data";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useSchedule } from "@/lib/hooks/useSchedule";
import {
  PreparedScheduledDay,
  PreparedScheduledExercise,
  ScheduleItems,
  ScheduleProps,
} from "@/lib/types/schedule";
import { createWorksheetFromData } from "@/lib/worksheet/helpers";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { AvailableStoredDataDialog } from "./availableStoredDataDialog";
import { columns } from "./columns";
import { ScheduledDay } from "./scheduledDay";

const filterDeletedItems = <T,>(items: ScheduleItems<T>[]) => {
  return items.filter((currentItem) => !currentItem.taggedForDelete);
};

export const Schedule = ({
  scheduleData: initialData,
  exercises,
}: ScheduleProps) => {
  const {
    state: scheduleData,
    handleSetData,
    hasChanges,
    addExercise,
    copyExercise,
    deleteExercise,
    updateExercise,
    reorderExercises,
    moveDay,
    addDay,
    deleteDay,
    scheduleIsValid,
    reachedWeekLimit,
  } = useSchedule(initialData);

  const [open, setOpen] = useState(false);
  const [scheduleAnimationWrapper] = useAutoAnimate();
  const [daysAnimationWrapper] = useAutoAnimate();
  const [isPending, startTransition] = useTransition();

  const scheduledIdKey = `schedule-${scheduleData.id}`;

  const { loadFromStorage, removeFromStorage, saveToStorage } = useLocalStorage(
    scheduledIdKey,
    scheduleData
  );

  const cannotSaveChanges = isPending || !hasChanges || !scheduleIsValid;

  useEffect(() => {
    const data = loadFromStorage();
    if (data) {
      setOpen(true);
    }
  }, [loadFromStorage]);

  useEffect(() => {
    if (hasChanges) {
      saveToStorage();
    }
  }, [hasChanges, saveToStorage]);

  useBeforeunload(hasChanges ? (event) => event.preventDefault() : undefined);

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

  const handleOpenDialog = () => {
    setOpen(false);
  };

  const acceptLoadFromStorage = () => {
    const data = loadFromStorage();
    if (data) {
      handleSetData(data);
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

  const daysWithoutDeleted = useMemo(() => {
    return filterDeletedItems<PreparedScheduledDay>(
      scheduleData.days.map((day) => {
        const filteredExercises = filterDeletedItems<PreparedScheduledExercise>(
          day.exercises
        );
        return { ...day, exercises: filteredExercises };
      })
    );
  }, [scheduleData.days]);

  return (
    <div className="overflow-auto flex flex-col w-full justify-end gap-2 mb-5 p-5 border-2 rounded-md">
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
        <IconButton
          tooltip="Save changes"
          icon={isPending ? <Loader2 className="animate-spin" /> : <Save />}
          disabled={cannotSaveChanges}
          onClick={saveChanges}
          {...(isPending && { label: "Saving..." })}
          {...(hasChanges &&
            !cannotSaveChanges && { className: "animate-bounce" })}
        />
        <IconButton
          tooltip="Export"
          icon={<Download />}
          disabled={hasChanges}
          onClick={exportData}
        />
        <IconButton
          tooltip="Add Day"
          icon={<CalendarPlus />}
          disabled={reachedWeekLimit}
          className=""
          onClick={addDay}
        />
      </div>
      <div ref={daysAnimationWrapper} className="flex flex-col gap-9">
        {daysWithoutDeleted.map((day, index) => {
          return (
            <ScheduledDay
              key={day.id}
              columns={columns}
              data={day.exercises}
              exercises={exercises}
              deleteDay={deleteDay}
              scheduledDayId={day.id}
              title={(index + 1).toString()}
              addExercise={addExercise}
              copyExercise={copyExercise}
              deleteExercise={deleteExercise}
              updateExercise={updateExercise}
              reorderExercises={reorderExercises}
              moveDay={moveDay}
              isFirst={index === 0}
              isLast={index === daysWithoutDeleted.length - 1}
            />
          );
        })}
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
