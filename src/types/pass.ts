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

// Base schema that can be extended by client projects
export const createPassSchema = z.object({
    uniqueIdentifier: z.string().min(1),
    name: z.string().min(1),
    careerId: z.string().min(1),
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

export interface Pass extends CreatePass {
    id: string;
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