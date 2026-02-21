export enum EventTags {
  LECTURE = "LECTURE",
  WORKSHOP = "WORKSHOP",
  TRAINING = "TRAINING",
  HACKATHON = "HACKATHON",
  CEREMONY = "CEREMONY",
}

export const EventTagsLabels: Record<EventTags, string> = {
  [EventTags.LECTURE]: "Palestra",
  [EventTags.WORKSHOP]: "Workshop",
  [EventTags.TRAINING]: "Treinamento",
  [EventTags.HACKATHON]: "Hackathon",
  [EventTags.CEREMONY]: "Cerimônia",
};