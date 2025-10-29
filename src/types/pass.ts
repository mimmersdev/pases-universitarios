import { z } from "zod/v4";

export enum PaymentStatus {
    Due = 'Due',
    Overdue = 'Overdue',
    Paid = 'Paid',
}

export enum PassStatus {
    Active = 'Active',
    Inactive = 'Inactive'
}

export enum InstallationStatus {
    Pending = 'Pending',
    Installed = 'Installed',
}

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
}

// Base schema that can be extended by client projects
export const createPassSchema = z.object({
    uniqueIdentifier: z.string("El identificador único debe ser textual").min(1, "El identificador único es requerido"),
    careerId: z.string("El código (ID) de la carrera debe ser textual").min(1, "El código (ID) de la carrera es requerido"),
    name: z.string("El nombre debe ser textual").min(1, "El nombre es requerido"),
    email: z.email("El correo electrónico es requerido"),
    cityId: z.string("El código (ID) de la ciudad debe ser textual").min(1, "El Código (ID) de la ciudad es requerido"),
    semester: z.number("El semestre debe ser un número").min(1, "El semestre es requerido").int("El semestre debe ser un número entero"),
    enrollmentYear: z.number("El año de ingreso debe ser un número").positive("El año de ingreso debe ser un número positivo").int("El año de ingreso debe ser un número entero"),
    paymentReference: z.string("La referencia de pago debe ser textual").min(1, "La referencia de pago es requerida"),
    paymentStatus: z.enum(PaymentStatus, "El estado de pago es requerido"),
    totalToPay: z.number("El total a pagar debe ser un número").min(0, "El total a pagar es requerido"),
    startDueDate: z.string().pipe(z.coerce.date("La fecha de inicio de vencimiento es requerida")),
    endDueDate: z.string().pipe(z.coerce.date("La fecha de fin de vencimiento es requerida")),
    // Backfields per pass
    onlinePaymentLink: z.url("El enlace de pago en línea debe ser una URL válida").nullable(),
    academicCalendarLink: z.url("El enlace del calendario académico debe ser una URL válida").nullable(),
    // Not visible fields
    graduated: z.boolean("El campo graduado es requerido"),
    currentlyStudying: z.boolean("El campo actualmente estudiando es requerido"),
});

export type CreatePass = z.infer<typeof createPassSchema>;

export const createManyPassesSchema = z.object({
    data: z.array(createPassSchema).min(1).superRefine((data, ctx) => {
        const seen = new Map<string, number>();
        
        data.forEach((item, index) => {
            const key = `${item.uniqueIdentifier}:${item.careerId}`;
            
            if (seen.has(key)) {
                ctx.addIssue({
                    code: "custom",
                    message: `Pareja duplicada encontrada: identificador único "${item.uniqueIdentifier}" y código (ID) de carrera "${item.careerId}" (en índice ${index} y ${seen.get(key)})`,
                    path: [index]
                });
            } else {
                seen.set(key, index);
            }
        });
    })
})

export type CreateManyPasses = z.infer<typeof createManyPassesSchema>;

export interface SimplePass {
    uniqueIdentifier: string;
    careerId: string;
    status: PassStatus;
    googleWalletObjectID: string | null;
    appleWalletSerialNumber: string | null;
    googleWalletInstallationStatus: InstallationStatus;
    appleWalletInstallationStatus: InstallationStatus;
    notificationCount: number;
    lastNotificationDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Pass extends SimplePass, CreatePass {

}

export const updatePassDueSchema = z.object({
    uniqueIdentifier: z.string("El identificador único debe ser textual").min(1, "El identificador único es requerido"),
    careerId: z.string("El código (ID) de la carrera debe ser textual").min(1, "El código (ID) de la carrera es requerido"),
    totalToPay: z.number("El total a pagar debe ser un número").min(0, "El total a pagar es requerido"),
    startDueDate: z.string().pipe(z.coerce.date()),
    endDueDate: z.string().pipe(z.coerce.date()),
    onlinePaymentLink: z.url("El enlace de pago en línea debe ser una URL válida").nullable(),
});

export type UpdatePassDue = z.infer<typeof updatePassDueSchema>;

export const updatePassDueRequestSchema = z.object({
    data: z.array(updatePassDueSchema).min(1).superRefine((data, ctx) => {
        const seen = new Map<string, number>();
        
        data.forEach((item, index) => {
            const key = `${item.uniqueIdentifier}:${item.careerId}`;
            
            if (seen.has(key)) {
                ctx.addIssue({
                    code: "custom",
                    message: `Pareja duplicada encontrada: identificador único "${item.uniqueIdentifier}" y código (ID) de carrera "${item.careerId}" (en índice ${index} y ${seen.get(key)})`,
                    path: [index]
                });
            } else {
                seen.set(key, index);
            }
        });
    })
});

export type UpdatePassDueRequest = z.infer<typeof updatePassDueRequestSchema>;

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
])

export const filterPassesSchema = z.object({
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
})

export type FilterPasses = z.infer<typeof filterPassesSchema>;