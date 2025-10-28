/**
 * Interface for the Apple Wallet repository
 * To be used with an object declared as const, not for a class since we would need to instantiate it
 * Example:
 * ```ts
 * const appleWalletRepository: AppleWalletRepository = {
 *     registerDevice: async () => {
 *         // TODO: Implement
 *     }
 * }
 * ```
 */
export interface AppleWalletRepository {
    /**
     * Register a new device in the Apple Wallet in the database
     * @param deviceLibraryIdentifier - The library identifier of the device
     * @param passTypeIdentifier - The pass type identifier
     * @param serialNumber - The serial number of the pass
     * @param pushToken - The push token of the device
     */
    registerDevice: (deviceLibraryIdentifier: string, passTypeIdentifier: string, serialNumber: string, pushToken: string) => Promise<void>;
    /**
     * Unregister a device from the Apple Wallet in the database
     * @param deviceLibraryIdentifier - The library identifier of the device
     * @param passTypeIdentifier - The pass type identifier
     * @param serialNumber - The serial number of the pass
     */
    unregisterDevice: (deviceLibraryIdentifier: string, passTypeIdentifier: string, serialNumber: string) => Promise<void>
}