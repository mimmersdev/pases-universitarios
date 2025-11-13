import { z } from "zod/v4";
import { PaymentStatus } from "./pass";

// Types to filter passes

export enum SingularValueComparation {
    Equals = 'equals',
    GreaterThan = 'greaterThan',
    LessThan = 'lessThan',
    GreaterThanOrEqualTo = 'greaterThanOrEqualTo',
    LessThanOrEqualTo = 'lessThanOrEqualTo',
    NotEqualTo = 'notEqualTo',
}

export enum ListComparation {
    Include = 'include',
    Exclude = 'exclude',
    Equals = 'equals',
}

export const singleValueComparationSchema = z.object({
    singleValue: z.number("El valor singular debe ser un número").min(0, "El valor singular es requerido"),
    comparation: z.enum(SingularValueComparation, "La comparación es requerida"),
})

export type SingleValueComparation = z.infer<typeof singleValueComparationSchema>;

export const valueOrListSchema = z.union([
    singleValueComparationSchema,
    z.object({
        list: z.array(z.number("El valor de la lista debe ser un número").min(0, "El valor de la lista es requerido")),
    }),
])

export type ValueOrList = z.infer<typeof valueOrListSchema>;

export const singleDateComparationSchema = z.object({
    singleDate: z.string().pipe(z.coerce.date("La fecha singular debe ser una fecha válida")),
    comparation: z.enum(SingularValueComparation, "La comparación es requerida"),
})

export type SingleDateComparation = z.infer<typeof singleDateComparationSchema>;

export const dateRangeSchema = z.object({
    startDate: z.string().pipe(z.coerce.date("La fecha de inicio debe ser una fecha válida")),
    endDate: z.string().pipe(z.coerce.date("La fecha de fin debe ser una fecha válida")),
})

export const dateOrDateRangeSchema = z.union([
    singleDateComparationSchema,
    dateRangeSchema,
]);

// Types to create tags for passes

export enum TagType {
    Numeric = 'numeric',
    Date = 'date',
    Boolean = 'boolean',
    List = 'list',
}


export const createTagSchema = z.object({
    name: z.string("El nombre del tag debe ser textual").min(1, "El nombre del tag es requerido"),
    description: z.string("La descripción del tag debe ser textual").min(1, "La descripción del tag es requerida"),
    type: z.enum(TagType, "El tipo de tag es requerido"),
});

export type CreateTag = z.infer<typeof createTagSchema>;

export interface Tag extends CreateTag {
    id: string;
    universityId: string;
    createdAt: Date;
    updatedAt: Date;
}

export const updateTagSchema = z.object({
    name: z.string("El nombre del tag debe ser textual").min(1, "El nombre del tag es requerido"),
    description: z.string("La descripción del tag debe ser textual").min(1, "La descripción del tag es requerida"),
});

export type UpdateTag = z.infer<typeof updateTagSchema>;

// Numeric tag
export const createNumericTagSchema = z.object({
    value: z.number("El valor del tag debe ser un número"),
});

export type CreateNumericTag = z.infer<typeof createNumericTagSchema>;

export interface NumericTag extends CreateNumericTag {
    tagId: string;
    // Pass ids
    universityId: string;
    careerId: string;
    uniqueIdentifier: string;

    createdAt: Date;
    updatedAt: Date;
}

export const updateNumericTagSchema = z.object({
    value: z.number("El valor del tag debe ser un número"),
});

export type UpdateNumericTag = z.infer<typeof updateNumericTagSchema>;

// Date tag
export const createDateTagSchema = z.object({
    value: z.string().pipe(z.coerce.date("El valor del tag debe ser una fecha válida")),
})

export type CreateDateTag = z.infer<typeof createDateTagSchema>;

export interface DateTag extends CreateDateTag {
    tagId: string;
    // Pass ids
    universityId: string;
    careerId: string;
    uniqueIdentifier: string;

    createdAt: Date;
    updatedAt: Date;
}

export const updateDateTagSchema = z.object({
    value: z.string().pipe(z.coerce.date("El valor del tag debe ser una fecha válida")),
});

export type UpdateDateTag = z.infer<typeof updateDateTagSchema>;

// Boolean tag
export const createBooleanTagSchema = z.object({
    value: z.boolean("El valor del tag debe ser un booleano"),
});

export type CreateBooleanTag = z.infer<typeof createBooleanTagSchema>;

export interface BooleanTag extends CreateBooleanTag {
    tagId: string;
    // Pass ids
    universityId: string;
    careerId: string;
    uniqueIdentifier: string;

    createdAt: Date;
    updatedAt: Date;
}

export const updateBooleanTagSchema = z.object({
    value: z.boolean("El valor del tag debe ser un booleano"),
});

export type UpdateBooleanTag = z.infer<typeof updateBooleanTagSchema>;

// List tags
// Create types to manage the options for the list tag
export const createListTagOptionSchema = z.object({
    value: z.string("El valor de la opción debe ser textual").min(1, "El valor de la opción es requerido"),
});

export type CreateListTagOption = z.infer<typeof createListTagOptionSchema>;

export interface ListTagOption extends CreateListTagOption {
    id: string;
    tagId: string;
    createdAt: Date;
    updatedAt: Date;
}

export const updateListTagOptionSchema = z.object({
    value: z.string("El valor de la opción debe ser textual").min(1, "El valor de la opción es requerido"),
});

export type UpdateListTagOption = z.infer<typeof updateListTagOptionSchema>;

// Types to create a tag of type list

export const createListTagSchema = z.object({
    options: z.array(createListTagOptionSchema).min(1, "Las opciones del tag deben ser al menos una"),
});

export type CreateListTag = z.infer<typeof createListTagSchema>;

export interface ListTag extends CreateListTag {
    tagId: string;
    // Pass ids
    universityId: string;
    careerId: string;
    uniqueIdentifier: string;

    createdAt: Date;
    updatedAt: Date;
}

export const updateListTagSchema = z.object({
    options: z.array(updateListTagOptionSchema).min(1, "Las opciones del tag deben ser al menos una"),
})

export type UpdateListTag = z.infer<typeof updateListTagSchema>;


// type to filter tags and basic fields
export const filterTagsSchema = z.object({
    careerId: z.object({
        values: z.array(z.string("El valor de la lista debe ser textual").min(1, "El valor de la lista es requerido")),
        comparation: z.enum(ListComparation, "La comparación es requerida"),
    }).optional(),
    semester: valueOrListSchema.optional(),
    enrollmentYear: valueOrListSchema.optional(),
    paymentStatus: z.array(z.enum(PaymentStatus, "El estado de pago es requerido")).optional(),
    totalToPay: singleValueComparationSchema.optional(),
    endDueDate: dateOrDateRangeSchema.optional(),
    graduated: z.boolean("El campo graduado debe ser un booleano").optional(),
    currentlyStudying: z.boolean("El campo actualmente estudiando debe ser un booleano").optional(),
    // Filters for tags
    genericNumericTag: z.array(z.object({
        tagId: z.string("El ID del tag debe ser textual").min(1, "El ID del tag es requerido"),
        value: singleValueComparationSchema,
    })).optional(),
    genericDateTag: z.array(z.object({
        tagId: z.string("El ID del tag debe ser textual").min(1, "El ID del tag es requerido"),
        value: singleDateComparationSchema,
    })).optional(),
    genericBooleanTag: z.array(z.object({
        tagId: z.string("El ID del tag debe ser textual").min(1, "El ID del tag es requerido"),
        value: z.boolean("El valor del tag debe ser un booleano"),
    })).optional(),
    genericListTag: z.array(z.object({
        tagId: z.string("El ID del tag debe ser textual").min(1, "El ID del tag es requerido"),
        value: valueOrListSchema,
    })).optional(),
})

export type FilterTags = z.infer<typeof filterTagsSchema>;