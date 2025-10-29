// Export wallet managers - SERVER-ONLY, do not import in client components
export { AppleWalletManager } from './apple/apple-wallet-manager';
export type { AppleWalletCredentials } from './apple/apple-wallet-manager';
export type {
    AppleWalletIssueProps,
    AppleWalletImages,
    AppleWalletDevice,
    PassFieldContent
} from './apple/apple-wallet-types';
export type { AppleWalletRepository } from './apple/apple-wallet-repository-interface';

export { default as GoogleWalletManager } from './google/google-wallet-manager';
export type { GoogleWalletCredentials } from './google/google-wallet-manager';
export type {
    GoogleWalletIssueProps,
    GoogleWalletUpdateProps,
    TextModuleData,
    LinkModuleData
} from './google/google-wallet-types';
export { GoogleWallet_FrontFieldPaths } from './google/google-wallet-types';

