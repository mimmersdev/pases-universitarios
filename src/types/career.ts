import { z } from "zod/v4";

export const createCareerSchema = z.object({
    code: z.string().min(1, "El código (ID) de la carrera es requerido"),
    name: z.string().min(1, "El nombre de la carrera es requerido"),
});

export type CreateCareer = z.infer<typeof createCareerSchema>;

export const updateCareerSchema = z.object({
    name: z.string().min(1),
});

export type UpdateCareer = z.infer<typeof updateCareerSchema>;

export interface Career extends CreateCareer {
    universityId: string;
    createdAt: Date;
    updatedAt: Date;
}
