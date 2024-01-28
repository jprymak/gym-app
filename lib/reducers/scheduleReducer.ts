import { Direction } from "../constants/schedule";
import type {
  ScheduledDayWithExercises,
  ScheduledExercise,
  ScheduleWithDaysAndExercises,
} from "../data/types";
import {
  createInitialDay,
  createInitialExerciseRow,
} from "../helpers/initialData";
import type {
  PreparedScheduledDay,
  PreparedScheduledExercise,
  ScheduleItem,
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

const applyOrdinalNumbers = <T extends ScheduleItem>(items: T[]) => {
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

const findDayById = (state: ScheduleWithDaysAndExercises, dayId: string) => {
  return state.days.find((day) => day.id === dayId);
};

const findItemIndex = <T extends ScheduleItem>(items: T[], itemId: string) => {
  return items.findIndex((item) => item.id === itemId);
};

export function scheduleReducer(
  state: ScheduleWithDaysAndExercises,
  action: ScheduleAction
): ScheduleWithDaysAndExercises {
  const { type } = action;
  switch (type) {
    case ScheduleActionKind.INITIAL_SETUP: {
      return action.payload;
    }
    case ScheduleActionKind.ADD_DAY: {
      return {
        ...state,
        days: [...state.days, createInitialDay()],
      };
    }
    case ScheduleActionKind.MOVE_DAY: {
      const { scheduledDayId, direction } = action.payload;
      const updatedDays = [...state.days];

      const oldIndex = findItemIndex<ScheduledDayWithExercises>(
        updatedDays,
        scheduledDayId
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
      const { idToDelete } = action.payload;
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

      return {
        ...state,
        days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
      };
    }
    case ScheduleActionKind.ADD_EXERCISE: {
      const { scheduledDayId } = action.payload;
      const newRow = createInitialExerciseRow(scheduledDayId);
      const dayToUpdate = findDayById(state, scheduledDayId);
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
      const updatedDays = [...state.days];

      const indexOfDayToUpdate = findItemIndex<ScheduledDayWithExercises>(
        updatedDays,
        scheduledDayId
      );

      updatedDays.splice(indexOfDayToUpdate, 1, updatedDay);

      return {
        ...state,
        days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
      };
    }
    case ScheduleActionKind.COPY_EXERCISE: {
      const { scheduledExerciseToCopy } = action.payload;

      const dayToUpdate = findDayById(
        state,
        scheduledExerciseToCopy.scheduledDayId
      );
      if (!dayToUpdate) {
        return state;
      }

      const indexOfCopiedExercise = findItemIndex<ScheduledExercise>(
        dayToUpdate.exercises,
        scheduledExerciseToCopy.id
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

      const updatedExercises = [...dayToUpdate.exercises];

      updatedExercises.splice(indexOfCopiedExercise, 0, newScheduledExercise);

      const updatedDay = {
        ...dayToUpdate,
        exercises: applyOrdinalNumbers<ScheduledExercise>(updatedExercises),
      };

      const indexOfDayToUpdate = findItemIndex<ScheduledDayWithExercises>(
        state.days,
        scheduledExerciseToCopy.scheduledDayId
      );

      const updatedDays = [...state.days];

      updatedDays.splice(indexOfDayToUpdate, 1, updatedDay);

      return {
        ...state,
        days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
      };
    }
    case ScheduleActionKind.DELETE_EXERCISE: {
      const { scheduledDayId, rowToDeleteId } = action.payload;

      const dayToUpdate = findDayById(state, scheduledDayId);

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
        exercises: applyOrdinalNumbers<ScheduledExercise>(newExercises),
      };

      const indexOfDayToUpdate = findItemIndex<ScheduledDayWithExercises>(
        state.days,
        scheduledDayId
      );

      const updatedDays = [...state.days];

      updatedDays.splice(indexOfDayToUpdate, 1, updatedDay);

      return {
        ...state,
        days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
      };
    }
    case ScheduleActionKind.UPDATE_EXERCISE: {
      const { columnId, scheduledDayId, rowId, value } = action.payload;

      const dayToUpdate = findDayById(state, scheduledDayId);

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

      const indexOfDayToUpdate = findItemIndex<ScheduledDayWithExercises>(
        state.days,
        scheduledDayId
      );

      const updatedDays = [...state.days];

      updatedDays.splice(indexOfDayToUpdate, 1, updatedDay);

      return {
        ...state,
        days: applyOrdinalNumbers<ScheduledDayWithExercises>(updatedDays),
      };
    }
    case ScheduleActionKind.REORDER_EXERCISES: {
      const { array, scheduledDayId } = action.payload;

      const dayToUpdate = findDayById(state, scheduledDayId);

      if (!dayToUpdate) {
        return state;
      }

      const updatedDay = {
        ...dayToUpdate,
        exercises: applyOrdinalNumbers<ScheduledExercise>(array),
      };

      const indexOfDayToUpdate = findItemIndex<ScheduledDayWithExercises>(
        state.days,
        scheduledDayId
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
