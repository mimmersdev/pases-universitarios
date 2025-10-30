export enum NotificationType {
    Orientation = 'Orientation',
    Midterms = 'Midterms',
    DeliverableDegree_English = 'DeliverableDegree_English',
    DeliverableDegree_Certificate = 'DeliverableDegree_Certificate',
    DeliverableDegree_Seminar = 'DeliverableDegree_Seminar',
    RegistrationDegree_English = 'RegistrationDegree_English',
    RegistrationDegree_Certificate = 'RegistrationDegree_Certificate',
    RegistrationDegree_Seminar = 'RegistrationDegree_Seminar',
    PendingDocuments = 'PendingDocuments',
    PaymentDue = 'PaymentDue',
    Preinscription_ExamTyT = 'Preinscription_TyT',
    Preinscription_ExamPro = 'Preinscription_ExamPro',
    GraduationByCity = 'GraduationByCity',
    RequiredDocumentsForGraduation = 'RequiredDocumentsForGraduation',
}

export const notificationTypeList = Object.values(NotificationType);

export const notifiactionTypeToLabel = (type: NotificationType): string => {
    switch (type) {
        case NotificationType.Orientation:
            return 'Inducción';
        case NotificationType.Midterms:
            return 'Parciales';
        case NotificationType.DeliverableDegree_English:
            return 'Entregable de opciones de grado: Inglés';
        case NotificationType.DeliverableDegree_Certificate:
            return 'Entregable de opciones de grado: Certificado';
        case NotificationType.DeliverableDegree_Seminar:
            return 'Entregable de opciones de grado: Seminario';
        case NotificationType.RegistrationDegree_English:
            return 'Inscripción a opciones de grado: Inglés';
        case NotificationType.RegistrationDegree_Certificate:
            return 'Inscripción a opciones de grado: Certificado';
        case NotificationType.RegistrationDegree_Seminar:
            return 'Inscripción a opciones de grado: Seminario';
        case NotificationType.PendingDocuments:
            return 'Documentos pendientes';
        case NotificationType.PaymentDue:
            return 'Pago pendiente';
        case NotificationType.Preinscription_ExamTyT:
            return 'Preinscripción: Pruebas TyT';
        case NotificationType.Preinscription_ExamPro:
            return 'Preinscripción: Pruebas Pro';
        case NotificationType.GraduationByCity:
            return 'Graduación por ciudad';
        case NotificationType.RequiredDocumentsForGraduation:
            return 'Documentos requeridos para graduación';
    }
}


// TODO: Verify if we can let end users insert content to the notifications, or if we leave them as generic as possible.
export const getNotificationContent = (type: NotificationType): { title: string, body: string } => {
    switch (type) {
        case NotificationType.Orientation:
            return {
                title: 'Inducción',
                body: 'La inducción es el proceso de inicio de un nuevo ciclo académico. Se realiza en el mes de septiembre y octubre de cada año. Es obligatorio para todos los estudiantes de la universidad.',
            }
        case NotificationType.Midterms:
            return {
                title: 'Parciales',
                body: 'Los parciales son evaluaciones que se realizan en el transcurso del semestre. Son obligatorias para todos los estudiantes de la universidad.',
            }
        case NotificationType.DeliverableDegree_English:
            return {
                title: 'Entregable de opciones de grado: Inglés',
                body: 'El entregable de opciones de grado: Inglés es un documento que se entrega a los estudiantes de la universidad. Es obligatorio para todos los estudiantes de la universidad.',
            }
        case NotificationType.DeliverableDegree_Certificate:
            return {
                title: 'Entregable de opciones de grado: Certificado',
                body: 'El entregable de opciones de grado: Certificado es un documento que se entrega a los estudiantes de la universidad. Es obligatorio para todos los estudiantes de la universidad.',
            }
        case NotificationType.DeliverableDegree_Seminar:
            return {
                title: 'Entregable de opciones de grado: Seminario',
                body: 'El entregable de opciones de grado: Seminario es un documento que se entrega a los estudiantes de la universidad. Es obligatorio para todos los estudiantes de la universidad.',
            }
        case NotificationType.RegistrationDegree_English:
            return {
                title: 'Inscripción a opciones de grado: Inglés',
                body: 'La inscripción a opciones de grado: Inglés es el proceso de inscripción de un estudiante a una opción de grado. Es obligatorio para todos los estudiantes de la universidad.',
            }
        case NotificationType.RegistrationDegree_Certificate:
            return {
                title: 'Inscripción a opciones de grado: Certificado',
                body: 'La inscripción a opciones de grado: Certificado es el proceso de inscripción de un estudiante a una opción de grado. Es obligatorio para todos los estudiantes de la universidad.',
            }
        case NotificationType.RegistrationDegree_Seminar:
            return {
                title: 'Inscripción a opciones de grado: Seminario',
                body: 'La inscripción a opciones de grado: Seminario es el proceso de inscripción de un estudiante a una opción de grado. Es obligatorio para todos los estudiantes de la universidad.',
            }
        case NotificationType.PendingDocuments:
            return {
                title: 'Documentos pendientes',
                body: 'Los documentos pendientes son documentos que se deben entregar a la universidad. Son obligatorios para todos los estudiantes de la universidad.',
            }
        case NotificationType.PaymentDue:
            return {
                title: 'Pago pendiente',
                body: 'El pago pendiente es el pago que se debe realizar a la universidad. Es obligatorio para todos los estudiantes de la universidad.',
            }
        case NotificationType.Preinscription_ExamTyT:
            return {
                title: 'Preinscripción: Pruebas TyT',
                body: 'Las pruebas TyT son pruebas que se realizan en el transcurso del semestre. Son obligatorias para todos los estudiantes de la universidad.',
            }
        case NotificationType.Preinscription_ExamPro:
            return {
                title: 'Preinscripción: Pruebas Pro',
                body: 'Las pruebas Pro son pruebas que se realizan en el transcurso del semestre. Son obligatorias para todos los estudiantes de la universidad.',
            }
        case NotificationType.GraduationByCity:
            return {
                title: 'Graduación por ciudad',
                body: 'La graduación por ciudad es la graduación que se realiza en la ciudad de la universidad. Es obligatoria para todos los estudiantes de la universidad.',
            }
        case NotificationType.RequiredDocumentsForGraduation:
            return {
                title: 'Documentos requeridos para graduación',
                body: 'Los documentos requeridos para graduación son documentos que se deben entregar a la universidad. Son obligatorios para todos los estudiantes de la universidad.',
            }
    }
}