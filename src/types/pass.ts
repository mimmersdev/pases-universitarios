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
    uniqueIdentifier: z.string().min(1),
    careerId: z.string().min(1),
    name: z.string().min(1),
    semester: z.number().min(1).int(),
    enrollmentYear: z.number().positive().int(),
    paymentReference: z.string().min(1),
    paymentStatus: z.enum(PaymentStatus),
    totalToPay: z.number().min(0),
    startDueDate: z.date(),
    endDueDate: z.date(),
    // Backfields per pass
    onlinePaymentLink: z.url().nullable(),
    academicCalendarLink: z.url().nullable(),
    // Not visible fields
    graduated: z.boolean(),
    currentlyStudying: z.boolean(),
});

export type CreatePass = z.infer<typeof createPassSchema>;

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
    uniqueIdentifier: z.string().min(1),
    careerId: z.string().min(1),
    totalToPay: z.number().min(0),
    startDueDate: z.date(),
    endDueDate: z.date(),
    onlinePaymentLink: z.url().nullable(),
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
                    message: `Duplicate pair found: uniqueIdentifier "${item.uniqueIdentifier}" and careerId "${item.careerId}" (at index ${index} and ${seen.get(key)})`,
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
    singleValue: z.number(),
    comparation: z.enum(SingularValueComparation),
})

export type SingleValueComparation = z.infer<typeof singleValueComparationSchema>;

export const valueOrListSchema = z.union([
    singleValueComparationSchema,
    z.object({
        list: z.array(z.number()),
    }),
])

export type ValueOrList = z.infer<typeof valueOrListSchema>;

export const singleDateComparationSchema = z.object({
    singleDate: z.date(),
    comparation: z.enum(SingularValueComparation),
})

export type SingleDateComparation = z.infer<typeof singleDateComparationSchema>;

export const dateRangeSchema = z.object({
    startDate: z.date(),
    endDate: z.date(),
})

export const dateOrDateRangeSchema = z.union([
    singleDateComparationSchema,
    dateRangeSchema,
])

export const filterPassesSchema = z.object({
    careerId: z.array(z.object({
        value: z.string().min(1),
        comparation: z.enum(ListComparation),
    })).optional(),
    semester: valueOrListSchema.optional(),
    semesterList: z.array(z.number().positive().int()).optional(),
    enrollmentYear: valueOrListSchema.optional(),
    paymentStatus: z.array(z.enum(PaymentStatus)).optional(),
    totalToPay: singleValueComparationSchema.optional(),
    endDueDate: dateOrDateRangeSchema.optional(),
    graduated: z.boolean().optional(),
    currentlyStudying: z.boolean().optional(),
})

export type FilterPasses = z.infer<typeof filterPassesSchema>;