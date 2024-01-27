"use client";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useBeforeunload } from "react-beforeunload";

import {
  Direction,
  MARGINAL_VALUES,
  SCHEDULE_WEEK_LIMIT,
} from "@/lib/constants/schedule";

import { ScheduleWithDaysAndExercises } from "../data/types";
import {
  ScheduleActionKind,
  scheduleReducer,
} from "../reducers/scheduleReducer";
import {
  PreparedScheduledDay,
  PreparedScheduledExercise,
  ScheduleItem,
} from "../types/schedule";

const filterDeletedItems = <T extends ScheduleItem>(items: T[]) => {
  return items.filter((currentItem) => !currentItem.taggedForDelete);
};

export const useSchedule = (initialData: ScheduleWithDaysAndExercises) => {
  const [state, dispatch] = useReducer(scheduleReducer, initialData);

  const [scheduleIsValid, setScheduleIsValid] = useState(true);

  const hasChanges =
    JSON.stringify(initialData.days) !== JSON.stringify(state.days);

  useEffect(() => {
    dispatch({
      type: ScheduleActionKind.INITIAL_SETUP,
      payload: initialData,
    });
  }, [initialData]);

  const validateSchedule = useCallback(() => {
    let valid = true;
    for (const day of state.days as PreparedScheduledDay[]) {
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
  }, [state.days]);

  useEffect(() => {
    setScheduleIsValid(validateSchedule());
  }, [state, validateSchedule]);
  useBeforeunload(hasChanges ? (event) => event.preventDefault() : undefined);

  const addDay = () => {
    dispatch({ type: ScheduleActionKind.ADD_DAY });
  };

  const deleteDay = (idToDelete: string) => {
    dispatch({ type: ScheduleActionKind.DELETE_DAY, payload: { idToDelete } });
  };

  const addExercise = (scheduledDayId: string) => {
    dispatch({
      type: ScheduleActionKind.ADD_EXERCISE,
      payload: { scheduledDayId },
    });
  };

  const copyExercise = (scheduledExerciseToCopy: PreparedScheduledExercise) => {
    dispatch({
      type: ScheduleActionKind.COPY_EXERCISE,
      payload: { scheduledExerciseToCopy },
    });
  };

  const deleteExercise = (scheduledDayId: string, rowToDeleteId: string) => {
    dispatch({
      type: ScheduleActionKind.DELETE_EXERCISE,
      payload: { scheduledDayId, rowToDeleteId },
    });
  };

  const updateExercise = (
    scheduledDayId: string,
    columnId: string,
    value: string,
    rowId: string
  ) => {
    dispatch({
      type: ScheduleActionKind.UPDATE_EXERCISE,
      payload: { scheduledDayId, columnId, value, rowId },
    });
  };

  const reorderExercises = (
    scheduledDayId: string,
    array: PreparedScheduledExercise[]
  ) => {
    dispatch({
      type: ScheduleActionKind.REORDER_EXERCISES,
      payload: { scheduledDayId, array },
    });
  };

  const moveDay = (scheduledDayId: string, direction: Direction) => {
    dispatch({
      type: ScheduleActionKind.MOVE_DAY,
      payload: { scheduledDayId, direction },
    });
  };

  const handleSetData = (data: ScheduleWithDaysAndExercises) => {
    dispatch({
      type: ScheduleActionKind.INITIAL_SETUP,
      payload: data,
    });
  };

  const dataToDisplay = useMemo(() => {
    return filterDeletedItems<PreparedScheduledDay>(
      state.days.map((day) => {
        const filteredExercises = filterDeletedItems<PreparedScheduledExercise>(
          day.exercises
        );
        return { ...day, exercises: filteredExercises };
      })
    );
  }, [state.days]);

  const reachedWeekLimit = dataToDisplay.length >= SCHEDULE_WEEK_LIMIT;

  return {
    state,
    dataToDisplay,
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
