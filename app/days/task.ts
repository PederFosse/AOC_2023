export interface Task {
  name: string;
  solve(input: string): Record<string, unknown>;
}
