export enum TaskCategory {
  physical = "Physical",
  mental = "Mental Health",
  leisure = "Leisure",
}

export enum TaskFrequency {
  daily = "Daily",
  weekly = "Weekly",
  monthly = "Monthly",
}

export type Task = {
  createdDate: number;
  title: string;
  taskCategory: TaskCategory | string; // string for custom category
  frequency: TaskFrequency;
  desiredCount: number;
  currentCount: number;
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