import { z } from "zod/v4";

export enum PaymentStatus {
    Due = 'Due',
    Overdue = 'Overdue',
    Paid = 'Paid',
}
export const paymentStatusList = Object.values(PaymentStatus);
export const getPaymentStatusLabel = (paymentStatus: PaymentStatus): string => {
    switch (paymentStatus) {
        case PaymentStatus.Due:
            return 'Pendiente';
        case PaymentStatus.Overdue:
            return 'En Mora';
        case PaymentStatus.Paid:
            return 'Pagado';
    }
}

export enum PassStatus {
    Active = 'Active',
    Inactive = 'Inactive'
}
export const passStatusList = Object.values(PassStatus);
export const getPassStatusLabel = (passStatus: PassStatus): string => {
    switch (passStatus) {
        case PassStatus.Active:
            return 'Activo';
        case PassStatus.Inactive:
            return 'Inactivo';
    }
}

export enum StudentStatus {
    Active = 'Active',
    Inactive = 'Inactive',
    Graduated = 'Graduated',
}
export const studentStatusList = Object.values(StudentStatus);
export const getStudentStatusLabel = (studentStatus: StudentStatus): string => {
    switch (studentStatus) {
        case StudentStatus.Active:
            return 'Activo';
        case StudentStatus.Inactive:
            return 'Inactivo';
        case StudentStatus.Graduated:
            return 'Graduado';
    }
}

export enum InstallationStatus {
    Pending = 'Pending',
    Installed = 'Installed',
}
export const installationStatusList = Object.values(InstallationStatus);
export const getInstallationStatusLabel = (installationStatus: InstallationStatus): string => {
    switch (installationStatus) {
        case InstallationStatus.Pending:
            return 'Pendiente';
        case InstallationStatus.Installed:
            return 'Instalado';
    }
}


// Base schema that can be extended by client projects
export const createPassSchema = z.object({
    uniqueIdentifier: z.string("El identificador único debe ser textual").min(1, "El identificador único es requerido"),
    careerId: z.string("El código (ID) de la carrera debe ser textual").min(1, "El código (ID) de la carrera es requerido"),
    name: z.string("El nombre debe ser textual").min(1, "El nombre es requerido"),
    email: z.email("El correo electrónico es requerido"),
    semester: z.number("El semestre debe ser un número").min(1, "El semestre es requerido").int("El semestre debe ser un número entero"),
    enrollmentYear: z.number("El año de ingreso debe ser un número").positive("El año de ingreso debe ser un número positivo").int("El año de ingreso debe ser un número entero"),
    paymentReference: z.string("La referencia de pago debe ser textual").min(1, "La referencia de pago es requerida"),
    paymentStatus: z.enum(PaymentStatus, "El estado de pago es requerido"),
    totalToPay: z.number("El total a pagar debe ser un número").min(0, "El total a pagar es requerido"),
    startDueDate: z.string().pipe(z.coerce.date("La fecha de inicio de vencimiento es requerida")),
    endDueDate: z.string().pipe(z.coerce.date("La fecha de fin de vencimiento es requerida")),
    cashback: z.number("El cashback debe ser un número").min(0, "El cashback es requerido"),
    studentStatus: z.enum(StudentStatus, "El estado del estudiante es requerido"),
    // Backfields per pass
    onlinePaymentLink: z.url("El enlace de pago en línea debe ser una URL válida").nullable(),
    academicCalendarLink: z.url("El enlace del calendario académico debe ser una URL válida").nullable(),
    // Image
    photoUrl: z.url("La URL de la foto debe ser una URL válida"),
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
    universityId: string;
    status: PassStatus;
    googleWalletObjectID: string | null;
    appleWalletSerialNumber: string | null;
    googleWalletInstallationStatus: InstallationStatus;
    appleWalletInstallationStatus: InstallationStatus;
    cashback: number;
    notificationCount: number;
    lastNotificationDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreatePassBackend extends CreatePass {
    photo1Url: string;
    photo2Url: string;
    photo3Url: string;
    photoGoogleHeroUrl: string;
}

export interface SimplePass_Extra extends SimplePass {
    careerName: string;
}

export interface Pass extends SimplePass, Omit<CreatePass, 'photoUrl'> {
    careerName: string;
    informationField: string;
    photo1Url: string;
    photo2Url: string;
    photo3Url: string;
    photoGoogleHeroUrl: string;
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

export const sendOpenNotificationSchema = z.object({
    ids: z.array(z.object({
        uniqueIdentifier: z.string("El identificador único debe ser textual").min(1, "El identificador único es requerido"),
        careerId: z.string("El código (ID) de la carrera debe ser textual").min(1, "El código (ID) de la carrera es requerido"),
    })).min(1, "El array de IDs es requerido"),
    header: z.string("El encabezado debe ser textual").min(1, "El encabezado es requerido"),
    body: z.string("El cuerpo debe ser textual").min(1, "El cuerpo es requerido"),
});

export type SendOpenNotification = z.infer<typeof sendOpenNotificationSchema>;