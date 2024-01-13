import { ScheduledExercise } from "@prisma/client";

import { Direction } from "../constants";
import {
  ScheduledDayWithExercises,
  ScheduleWithDaysAndExercises,
} from "../data";
import { createInitialDay, createInitialExerciseRow } from "../initialData";
import {
  PreparedScheduledDay,
  PreparedScheduledExercise,
  ScheduleItems,
} from "../types/schedule";

export enum ScheduleActionKind {
  INITIAL_SETUP = "INITIAL_SETUP",
  ADD_DAY = "ADD_DAY",
  MOVE_DAY = "MOVE_DAY",
  DELETE_DAY = "DELETE_DAY",
  ADD_EXERCISE = "ADD_EXERCISE",
  COPY_EXERCISE = "COPY_EXERCISE",
  DELETE_EXERCISE = "DELETE_EXERCISE",
  UPDATE_EXERCISE = "UPDATE_EXERCISE",
  REORDER_EXERCISES = "REORDER_EXERCISES",
}

type ScheduleAction =
  | {
      type: ScheduleActionKind.INITIAL_SETUP;
      payload: ScheduleWithDaysAndExercises;
    }
  | {
      type: ScheduleActionKind.ADD_DAY;
      payload: null;
    }
  | {
      type: ScheduleActionKind.MOVE_DAY;
      payload: {
        direction: Direction;
        scheduledDayId: string;
      };
    }
  | {
      type: ScheduleActionKind.DELETE_DAY;
      payload: {
        idToDelete: string;
      };
    }
  | {
      type: ScheduleActionKind.ADD_EXERCISE;
      payload: {
        scheduledDayId: string;
      };
    }
  | {
      type: ScheduleActionKind.COPY_EXERCISE;
      payload: {
        scheduledExerciseToCopy: PreparedScheduledExercise;
      };
    }
  | {
      type: ScheduleActionKind.DELETE_EXERCISE;
      payload: { scheduledDayId: string; rowToDeleteId: string };
    }
  | {
      type: ScheduleActionKind.UPDATE_EXERCISE;
      payload: {
        columnId: string;
        scheduledDayId: string;
        rowId: string;
        value: string;
      };
    }
  | {
      type: ScheduleActionKind.REORDER_EXERCISES;
      payload: { array: PreparedScheduledExercise[]; scheduledDayId: string };
    };

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

export function scheduleReducer(
  state: ScheduleWithDaysAndExercises,
  action: ScheduleAction
): ScheduleWithDaysAndExercises {
  const { type, payload } = action;
  switch (type) {
    case ScheduleActionKind.INITIAL_SETUP: {
      return payload;
    }
    case ScheduleActionKind.ADD_DAY: {
      const newDay = createInitialDay();
      const exercisesWithOridinals = newDay.exercises.map((ex, index) => ({
        ...ex,
        ordinalNum: index + 1,
      }));
      const updatedSchedule = {
        ...state,
        days: applyOrdinalNumbers<ScheduledDayWithExercises>([
          ...state.days,
          { ...newDay, exercises: exercisesWithOridinals },
        ]),
      };
      return updatedSchedule;
    }
    case ScheduleActionKind.MOVE_DAY: {
      const { scheduledDayId, direction } = payload;
      const updatedDays = [...state.days];

      const oldIndex = updatedDays.findIndex(
        (day) => day.id === scheduledDayId
      );

      const newIndex =
        direction === Direction.Down ? oldIndex + 1 : oldIndex - 1;

      const temp = updatedDays[newIndex];
      updatedDays[newIndex] = updatedDays[oldIndex];
      updatedDays[oldIndex] = temp;

      return {
        ...state,
        days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
      };
    }
    case ScheduleActionKind.DELETE_DAY: {
      const { idToDelete } = payload;
      const updatedDays = state.days.reduce<PreparedScheduledDay[]>(
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
        ...state,
        days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
      };

      return updatedSchedule;
    }
    case ScheduleActionKind.ADD_EXERCISE: {
      const { scheduledDayId } = payload;
      const newRow = createInitialExerciseRow(scheduledDayId);
      const dayToUpdate = state.days.find((day) => day.id === scheduledDayId);
      if (!dayToUpdate) {
        return state;
      }

      const updatedDay = {
        ...dayToUpdate,
        exercises: applyOrdinalNumbers<ScheduledExercise>([
          ...dayToUpdate.exercises,
          newRow,
        ]),
      };

      const indexOfDayToUpdate = state.days.findIndex(
        (day) => day.id === scheduledDayId
      );

      const updatedDays = [...state.days];

      updatedDays.splice(indexOfDayToUpdate, 1, updatedDay);

      return {
        ...state,
        days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
      };
    }
    case ScheduleActionKind.COPY_EXERCISE: {
      const { scheduledExerciseToCopy } = payload;
      const dayToUpdate = state.days.find(
        (day) => day.id === scheduledExerciseToCopy.scheduledDayId
      );
      if (!dayToUpdate) {
        return state;
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
        exercises: applyOrdinalNumbers<ScheduledExercise>(
          dayToUpdate.exercises
        ),
      };

      const indexOfDayToUpdate = state.days.findIndex(
        (day) => day.id === scheduledExerciseToCopy.scheduledDayId
      );

      const updatedDays = [...state.days];

      updatedDays.splice(indexOfDayToUpdate, 1, updatedDay);

      return {
        ...state,
        days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
      };
    }
    case ScheduleActionKind.DELETE_EXERCISE: {
      const { scheduledDayId, rowToDeleteId } = payload;
      const dayToUpdate = state.days.find((day) => day.id === scheduledDayId);
      if (!dayToUpdate) {
        return state;
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

      const indexOfDayToUpdate = state.days.findIndex(
        (day) => day.id === scheduledDayId
      );

      const updatedDays = [...state.days];

      updatedDays.splice(indexOfDayToUpdate, 1, updatedDay);

      return {
        ...state,
        days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
      };
    }
    case ScheduleActionKind.UPDATE_EXERCISE: {
      const { columnId, scheduledDayId, rowId, value } = payload;

      const dayToUpdate = state.days.find((day) => day.id === scheduledDayId);

      if (!dayToUpdate) {
        return state;
      }

      const updatedExercises = dayToUpdate.exercises.map(
        (scheduledExercise) => {
          if (columnId && scheduledExercise.id === rowId) {
            return { ...scheduledExercise, [columnId]: value };
          }
          return scheduledExercise;
        }
      );

      const updatedDay = {
        ...dayToUpdate,
        exercises: updatedExercises,
      };

      const indexOfDayToUpdate = state.days.findIndex(
        (day) => day.id === scheduledDayId
      );

      const updatedDays = [...state.days];

      updatedDays.splice(indexOfDayToUpdate, 1, updatedDay);

      return {
        ...state,
        days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
      };
    }
    case ScheduleActionKind.REORDER_EXERCISES: {
      const { array, scheduledDayId } = payload;

      const dayToUpdate = state.days.find((day) => day.id === scheduledDayId);
      if (!dayToUpdate) {
        return state;
      }

      const updatedDay = {
        ...dayToUpdate,
        exercises: applyOrdinalNumbers<ScheduledExercise>(array),
      };

      const indexOfDayToUpdate = state.days.findIndex(
        (day) => day.id === scheduledDayId
      );

      const newDays = [...state.days];

      newDays.splice(indexOfDayToUpdate, 1, updatedDay);

      return {
        ...state,
        days: newDays,
      };
    }
    default:
      return state;
  }
}
