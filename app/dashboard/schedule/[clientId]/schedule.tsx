"use client";
import { useState, useTransition } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { ScheduledDay } from "./scheduledDay";
import { Button } from "@/components/ui/button";
import { Exercise, ScheduledDay as ScheduledDayType } from "@prisma/client";
import { ScheduledDayWithExercises, ScheduledExercise } from "@/lib/data";
import { ScheduleWithDaysAndExercises, updateSchedule } from "@/lib/data";
import { columns } from "./columns";
import { createInitialDay, createInitialExerciseRow } from "@/lib/initialData";
import { Direction, SCHEDULE_DAY_LIMIT } from "@/lib/constants";
import { Loader2 } from "lucide-react";

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
  const [animationParent] = useAutoAnimate();
  const [isPending, startTransition] = useTransition();

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
          current.ordinalNum = -1;
          result.push({ ...current, taggedForDelete: true });
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

  const saveChanges = async () => {
    startTransition(() => {
      updateSchedule(scheduleData);
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

    const newDays = [...scheduleData.days];

    newDays.splice(indexOfDayToUpdate, 1, updatedDay);

    setScheduleData((prev) => ({ ...prev, days: newDays }));
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
        current.ordinalNum = -1;
        result.push({ ...current, taggedForDelete: true });
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

    const newDays = [...scheduleData.days];

    newDays.splice(indexOfDayToUpdate, 1, updatedDay);

    setScheduleData((prev) => ({ ...prev, days: newDays }));
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
        // @ts-ignore
        scheduledExercise[columnId] = value;
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

    const newDays = [...scheduleData.days];

    newDays.splice(indexOfDayToUpdate, 1, updatedDay);

    setScheduleData((prev) => ({ ...prev, days: newDays }));
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

  return (
    <div>
      <div className="flex w-full justify-end gap-2 mb-5">
        <Button onClick={saveChanges} disabled={isPending}>
          {isPending ? (
            <>
              <span className="mr-2">
                <Loader2 className="animate-spin" />
              </span>
              Saving...
            </>
          ) : (
            <>Save changes</>
          )}
        </Button>
        <Button disabled={reachedLimit} className="" onClick={addDay}>
          Add day
        </Button>
      </div>
      <div className="flex flex-col gap-5" ref={animationParent}>
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
    </div>
  );
};
