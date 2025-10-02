import type { IDepartment } from "../models/Department.js";

export type DepartmentCoodinator = Pick<
  IDepartment,
  "nombre" | "coordinador_id"
>;
