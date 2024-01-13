"use client";
import { useCallback, useEffect, useState } from "react";
import { useBeforeunload } from "react-beforeunload";

import {
  Direction,
  MARGINAL_VALUES,
  SCHEDULE_WEEK_LIMIT,
} from "@/lib/constants";
import { ScheduledDayWithExercises, ScheduledExercise } from "@/lib/data";
import { ScheduleWithDaysAndExercises } from "@/lib/data";
import { createInitialDay, createInitialExerciseRow } from "@/lib/initialData";

import {
  PreparedScheduledDay,
  PreparedScheduledExercise,
  ScheduleItems,
} from "../types/schedule";

const applyOrdinalNumbers = <T>(items: ScheduleItems<T>[]) => {
  let counter = 1;
  return items.map((item) => {
    if (!item.taggedForDelete) {
      const itemWithNum = { ...item, ordinalNum: counter };
      counter++;
      return itemWithNum;
    } else {
      return item;
    }
  });
};

export const useSchedule = (initialData: ScheduleWithDaysAndExercises) => {
  const [scheduleData, setScheduleData] = useState(initialData);
  const [scheduleIsValid, setScheduleIsValid] = useState(true);

  const reachedWeekLimit = scheduleData.days.length >= SCHEDULE_WEEK_LIMIT;

  const hasChanges =
    JSON.stringify(initialData.days) !== JSON.stringify(scheduleData.days);

  useEffect(() => {
    setScheduleData(initialData);
  }, [initialData]);

  const validateSchedule = useCallback(() => {
    let valid = true;
    for (const day of scheduleData.days as PreparedScheduledDay[]) {
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

  const addExercise = (scheduledDayId: string) => {
    const newRow: any = createInitialExerciseRow(scheduledDayId);
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

  const copyExercise = (scheduledExerciseToCopy: PreparedScheduledExercise) => {
    const dayToUpdate = scheduleData.days.find(
      (day) => day.id === scheduledExerciseToCopy.scheduledDayId
    );
    if (!dayToUpdate) {
      return;
    }
    const indexOfCopiedExercise = dayToUpdate.exercises.findIndex(
      (exercise) => scheduledExerciseToCopy.id === exercise.id
    );

    const newScheduledExercise = {
      ...createInitialExerciseRow(),
      exerciseId: scheduledExerciseToCopy.exerciseId,
      sets: scheduledExerciseToCopy.sets,
      reps: scheduledExerciseToCopy.reps,
      rpe: scheduledExerciseToCopy.rpe,
      comment: scheduledExerciseToCopy.comment,
      scheduledDayId: scheduledExerciseToCopy.scheduledDayId,
    };

    dayToUpdate.exercises.splice(
      indexOfCopiedExercise,
      0,
      newScheduledExercise
    );

    const updatedDay = {
      ...dayToUpdate,
      exercises: applyOrdinalNumbers<ScheduledExercise>(dayToUpdate.exercises),
    };

    const indexOfDayToUpdate = scheduleData.days.findIndex(
      (day) => day.id === scheduledExerciseToCopy.scheduledDayId
    );

    const updatedDays = [...scheduleData.days];

    updatedDays.splice(indexOfDayToUpdate, 1, updatedDay);

    const updatedSchedule = {
      ...scheduleData,
      days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
    };

    setScheduleData(updatedSchedule);
  };

  const deleteExercise = (scheduledDayId: string, rowToDeleteId: string) => {
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

  const updateExercise = (
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

  const handleSetData = (data: ScheduleWithDaysAndExercises) => {
    setScheduleData(data);
  };

  return {
    scheduleData,
    scheduleIsValid,
    hasChanges,
    moveDay,
    reorderExercises,
    updateExercise,
    deleteExercise,
    copyExercise,
    addExercise,
    deleteDay,
    addDay,
    handleSetData,
    reachedWeekLimit,
  };
};
