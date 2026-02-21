export enum EventTags {
  PALESTRA = "PALESTRA",
  WORKSHOP = "WORKSHOP",
  TREINAMENTO = "TREINAMENTO",
  HACKATHON = "HACKATHON",
  CERIMONIA = "CERIMONIA",
}

export const EventTagsLabels: Record<EventTags, string> = {
  [EventTags.PALESTRA]: "Palestra",
  [EventTags.WORKSHOP]: "Workshop",
  [EventTags.TREINAMENTO]: "Treinamento",
  [EventTags.HACKATHON]: "Hackathon",
  [EventTags.CERIMONIA]: "Cerimônia",
};