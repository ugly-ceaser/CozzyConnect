import { PaginatedType } from "./property";

export interface NotificationType {
  id: string;
  icon: string;
  title: string;
  text?: string;
  date: string;
}

export interface NotificationData {
  id: number;
  userId: string;
  message: string;
  createdAt: string;
  status: string;
  type: string;
  priority: "high" | "low" | string;
  actionButtonLabel: string;
  actionButtonLink: string;
  relatedResourceLink: string;
}

export interface NotitificationResponseData extends PaginatedType {
  data: NotificationData[];
}
