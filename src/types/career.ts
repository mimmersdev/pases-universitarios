import { z } from "zod/v4";

export const createCareerSchema = z.object({
    code: z.string().min(1),
    name: z.string().min(1),
});

export type CreateCareer = z.infer<typeof createCareerSchema>;

export const updateCareerSchema = z.object({
    name: z.string().min(1),
});

export type UpdateCareer = z.infer<typeof updateCareerSchema>;

export interface Career extends CreateCareer {
    createdAt: Date;
    updatedAt: Date;
}
