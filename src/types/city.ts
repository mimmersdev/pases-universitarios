import { z } from "zod/v4";

export const createCitySchema = z.object({
    code: z.string().min(1, "El código (ID) de la ciudad es requerido"),
    name: z.string().min(1, "El nombre de la ciudad es requerido"),
});

export type CreateCity = z.infer<typeof createCitySchema>;

export const updateCitySchema = z.object({
    name: z.string().min(1, "El nombre de la ciudad es requerido"),
});

export type UpdateCity = z.infer<typeof updateCitySchema>;

export interface City extends CreateCity {
    createdAt: Date;
    updatedAt: Date;
}