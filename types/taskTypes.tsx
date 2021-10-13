export enum TaskCategory {
  physical = "Physical",
  mental = "Mental Health",
  leisure = "Leisure",
}
// TODO- make everything enums (+ custom string option)
export type Task = {
  id: number;
  title: string;
  duration?: number;
  taskCategory: TaskCategory | string; // string for custom category
};

export type Journal = {
  message: string;
}

export enum Mood {
  happy = "Happy",
  content = "Content",
  sad = "Sad",
  stressed = "Stressed",
}

// TODO move this into better place when ready
export type CompletionEntry = {
  entry: Task | Journal | Mood;
  date: Date;
}