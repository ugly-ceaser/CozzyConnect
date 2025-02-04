import { UserData } from "./user";

export interface JobType {
  title: string;
  location: string;
  time: string;
  type: "remote" | "onsite" | "hybrid";
  company: {
    logo: string | any;
    name: string;
    profile: string;
  }
  description?: string;
  reviews?: { rating: number; comment: string; user: UserData }[];
  medium?: {
    name?: string;
    logo?: string;
    link?: string;
  } 
}