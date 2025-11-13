import { z } from "zod/v4";

export const createCitySchema = z.object({
    code: z.string().min(1, "El código (ID) de la ciudad es requerido"),
    name: z.string().min(1, "El nombre de la ciudad es requerido"),
});

export type CreateCity = z.infer<typeof createCitySchema>;

export const createManyCitiesSchema = z.object({
    data: z.array(createCitySchema).min(1).superRefine((data, ctx) => {
        const seen = new Map<string, number>();
        
        data.forEach((item, index) => {
            if (seen.has(item.code)) {
                ctx.addIssue({
                    code: "custom",
                    message: `Código duplicado encontrado: "${item.code}" (en índice ${index} y ${seen.get(item.code)})`,
                    path: [index]
                });
            } else {
                seen.set(item.code, index);
            }
        });
    })
});

export type CreateManyCities = z.infer<typeof createManyCitiesSchema>;

export const updateCitySchema = z.object({
    name: z.string().min(1, "El nombre de la ciudad es requerido"),
});

export type UpdateCity = z.infer<typeof updateCitySchema>;

export interface City extends CreateCity {
    universityId: string;
    createdAt: Date;
    updatedAt: Date;
}