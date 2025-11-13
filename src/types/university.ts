import { z } from "zod/v4";

export const createUniversitySchema = z.object({
    name: z.string().min(1, "El nombre de la universidad es requerido"),
});

export type CreateUniversity = z.infer<typeof createUniversitySchema>;

export const updateUniversitySchema = z.object({
    name: z.string().min(1, "El nombre de la universidad es requerido"),
});

export type UpdateUniversity = z.infer<typeof updateUniversitySchema>;

export interface University extends CreateUniversity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}