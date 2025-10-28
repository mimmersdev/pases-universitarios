export interface UserReadableError {
    getError(): string;
}

const GOOGLE_WALLET_ERROR_PREFIX = 'G';
export enum GoogleWalletErrorType {
    INITIALIZATION_ERROR = '001',
    SEND_NOTIFICATION_ERROR = '002',
    CREATE_PASS_ERROR = '003',
    GET_OBJECT_ERROR = '004',
    UPDATE_PASS_ERROR = '005',
    CREATE_CLASS_ERROR = '006'
}

export class GoogleWalletError extends Error implements UserReadableError {
    constructor(
        public readonly type: GoogleWalletErrorType,
        public readonly cause?: unknown
    ) {
        super(`Google Wallet error: ${GOOGLE_WALLET_ERROR_PREFIX}-${type}`);
        // Log code
        console.error(`Google Wallet error: ${this.getError()}`);
        // Log original error
        if (this.cause) {
            console.error('Details:');
            console.error(this.cause);
        }
    }

    getError(): string {
        return `${GOOGLE_WALLET_ERROR_PREFIX}-${this.type}`;
    }
}

const APPLE_WALLET_ERROR_PREFIX = 'A';
export enum AppleWalletErrorType {
    GENERATE_PASS_ERROR = '001',
    SEND_PASS_NOTIFICATION_ERROR = '002'
}

export class AppleWalletError extends Error implements UserReadableError {
    constructor(
        public readonly type: AppleWalletErrorType,
        public readonly cause?: unknown
    ) {
        super(`Apple Wallet error: ${APPLE_WALLET_ERROR_PREFIX}-${type}`);
        // Log code
        console.error(`Apple Wallet error: ${this.getError()}`);
        // Log original error
        if (this.cause) {
            console.error('Details:');
            console.error(this.cause);
        }
    }

    getError(): string {
        return `${APPLE_WALLET_ERROR_PREFIX}-${this.type}`;
    }
}