export type Rating =
  | "BORKED"
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM"
  | "NATIVE";

export interface App {
  id: string;
  name: string;
  logo?: string;
  rating: Rating;
  category: string;
  license: string;
  releaseDate: string;
  popularity: number;
}
