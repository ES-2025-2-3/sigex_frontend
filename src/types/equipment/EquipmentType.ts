export type Equipment = {
  id: number;
  name: string;
  description?: string | null;
};

export type InstituteEquipmentStock = {
  equipmentId: number;
  equipmentName: string;
  equipmentDescription?: string | null;
  total: number;
  available: number;
};

export type EquipmentAmountOperation =
  | "INCREMENT_TOTAL"
  | "DECREMENT_TOTAL"
  | "INCREMENT_AVAILABLE"
  | "DECREMENT_AVAILABLE";