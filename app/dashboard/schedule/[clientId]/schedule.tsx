"use client";
import { useState } from "react";

import { ScheduledDay } from "./scheduledDay";
import { Button } from "@/components/ui/button";
import { Exercise } from "@prisma/client";
import { ScheduledExercise } from "@/lib/data";
import { ScheduleWithDaysAndExercises, updateSchedule } from "@/lib/data";
import { columns } from "./columns";
import { createInitialDay, createInitialExerciseRow } from "@/lib/initials";
import { SCHEDULE_DAY_LIMIT } from "@/lib/constants";

interface ScheduleProps {
  scheduleData: ScheduleWithDaysAndExercises;
  exercises: Exercise[];
}

export interface PreparedRow {
  id: string;
  sets: string;
  reps: string;
  rpe: string;
  comment: string;
  exerciseId: string | null;
  taggedForDelete?: boolean;
  scheduledDayId: string | null;
}

const prepareRows = (
  scheduledExercises: (ScheduledExercise & { taggedForDelete?: boolean })[]
): PreparedRow[] => {
  return scheduledExercises.reduce<PreparedRow[]>((result, currentExercise) => {
    if (!currentExercise.taggedForDelete) {
      result.push({
        id: currentExercise.id,
        sets: currentExercise.sets,
        reps: currentExercise.reps,
        rpe: currentExercise.rpe,
        comment: currentExercise.comment,
        exerciseId: currentExercise.exerciseId,
        taggedForDelete: currentExercise.taggedForDelete,
        scheduledDayId: currentExercise.scheduledDayId,
      });
    }
    return result;
  }, []);
};

export const Schedule = ({
  scheduleData: initialData,
  exercises,
}: ScheduleProps) => {
  const [scheduleData, setScheduleData] = useState(initialData);

  const reachedLimit = scheduleData.days.length >= SCHEDULE_DAY_LIMIT;

  const addDay = () => {
    const newDay = createInitialDay();
    const updatedSchedule = {
      ...scheduleData,
      days: [...scheduleData.days, newDay],
    };
    setScheduleData(updatedSchedule);
  };

  const deleteDay = (idToDelete: string) => {
    const updatedSchedule = {
      ...scheduleData,
      days: scheduleData.days.filter((day) => day.id !== idToDelete),
    };
    setScheduleData(updatedSchedule);
  };

  const saveChanges = async () => {
    const result = await updateSchedule(scheduleData);
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
      exercises: [...dayToUpdate.exercises, newRow],
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

    const updatedDay = {
      ...dayToUpdate,
      exercises: dayToUpdate.exercises.reduce<PreparedRow[]>(
        (result, current) => {
          if (current.id === rowToDeleteId && current.id.startsWith("temp")) {
            return result;
          } else if (current.id === rowToDeleteId) {
            result.push({ ...current, taggedForDelete: true });
            return result;
          } else {
            result.push(current);

            return result;
          }
        },
        []
      ),
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

    const updatedDay = {
      ...dayToUpdate,
      exercises: dayToUpdate.exercises.map((scheduledExercise) => {
        if (scheduledExercise.id === rowId) {
          scheduledExercise[columnId as keyof ScheduledExercise] = value;
        }
        return scheduledExercise;
      }),
    };

    const indexOfDayToUpdate = scheduleData.days.findIndex(
      (day) => day.id === scheduledDayId
    );

    const newDays = [...scheduleData.days];

    newDays.splice(indexOfDayToUpdate, 1, updatedDay);

    setScheduleData((prev) => ({ ...prev, days: newDays }));
  };

  const moveExercises = (scheduledDayId: string, array: PreparedRow[]) => {
    const dayToUpdate = scheduleData.days.find(
      (day) => day.id === scheduledDayId
    );
    if (!dayToUpdate) {
      return;
    }

    const updatedDay = {
      ...dayToUpdate,
      exercises: array,
    };

    const indexOfDayToUpdate = scheduleData.days.findIndex(
      (day) => day.id === scheduledDayId
    );

    const newDays = [...scheduleData.days];

    newDays.splice(indexOfDayToUpdate, 1, updatedDay);

    setScheduleData((prev) => ({ ...prev, days: newDays }));
  };
  return (
    <div>
      <div className="flex w-full justify-end gap-2 mb-5">
        <Button onClick={saveChanges}>Save changes</Button>
        <Button disabled={reachedLimit} className="" onClick={addDay}>
          Add day
        </Button>
      </div>
      <div className="flex flex-col gap-5">
        {scheduleData.days.map((day, index) => {
          return (
            <ScheduledDay
              key={day.id}
              columns={columns}
              data={prepareRows(day.exercises)}
              exercises={exercises}
              deleteDay={deleteDay}
              scheduledDayId={day.id}
              title={(index + 1).toString()}
              addRow={addRow}
              deleteRow={deleteRow}
              updateRow={updateRow}
              moveExercises={moveExercises}
            />
          );
        })}
      </div>
    </div>
  );
};
