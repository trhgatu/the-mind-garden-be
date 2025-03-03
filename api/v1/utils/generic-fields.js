import { v4 as uuidv4 } from "uuid";

export function getGenericFields() {
  return {
    id: uuidv4(),
    isDel: false,
  };
}
