import { PKPass } from "passkit-generator";
import { AppleWalletDevice, AppleWalletImages, AppleWalletIssueProps } from "./apple-wallet-types";
import crypto from 'crypto';
import { AppleWalletError, AppleWalletErrorType } from "../../types/errors";
import apn from '@parse/node-apn';

export interface AppleWalletCredentials {
    passTypeIdentifier: string;
    teamIdentifier: string;
    organizationName: string;
    wwdr: string;
    signerCert: string;
    signerKey: string;
}

const getAuthenticationToken = (serialNumber: string, tokenSecret: string): string => {
    return crypto
        .createHash('sha256')
        .update(serialNumber + tokenSecret)
        .digest('hex');
}

export const AppleWalletManager = {
    async generatePass(props: AppleWalletIssueProps, images: AppleWalletImages, credentials: AppleWalletCredentials, webServiceURL: string, tokenSecret: string): Promise<Buffer> {
        try {
            const passJson = {
                formatVersion: 1,
                description: props.description,
                passTypeIdentifier: credentials.passTypeIdentifier,
                teamIdentifier: credentials.teamIdentifier,
                organizationName: credentials.organizationName,
                backgroundColor: props.backgroundColorRgb,
                foregroundColor: props.foregroundColorRgb,
                labelColor: props.labelColorRgb,
                serialNumber: props.serialNumber,
                authenticationToken: getAuthenticationToken(props.serialNumber, tokenSecret),
                webServiceURL: webServiceURL,
                barcodes: [
                    {
                        format: 'PKBarcodeFormatQR',
                        message: props.barcode.value,
                        messageEncoding: 'iso-8859-1',
                        altText: props.barcode.alternativeText
                    },
                ],
                generic: {
                    headerFields: [
                        props.header
                    ],
                    primaryFields: [
                        props.primaryField
                    ],
                    secondaryFields: [
                        props.secondaryFields[0],
                        props.secondaryFields[1]
                    ],
                    auxiliaryFields: [
                        props.auxiliaryFields[0],
                        props.auxiliaryFields[1]
                    ],
                    backFields: props.backFields,
                }
            }

            // Load certificates
            const wwdr = Buffer.from(credentials.wwdr);
            const signerCert = Buffer.from(credentials.signerCert);
            const signerKey = Buffer.from(credentials.signerKey);

            const pass = new PKPass(
                {
                    'pass.json': Buffer.from(JSON.stringify(passJson)),
                    'icon.png': images.icon,
                    'icon@2x.png': images.iconX2,
                    'icon@3x.png': images.iconX3,
                    'logo.png': images.logo,
                    'logo@2x.png': images.logoX2,
                    'logo@3x.png': images.logoX3,
                    'thumbnail.png': images.thumbnail,
                    'thumbnail@2x.png': images.thumbnailX2,
                    'thumbnail@3x.png': images.thumbnailX3,
                },
                {
                    wwdr: wwdr,
                    signerCert: signerCert,
                    signerKey: signerKey,
                },
                {
                    serialNumber: props.serialNumber,
                }
            );

            const passBuffer = await pass.getAsBuffer();
            return passBuffer;
        } catch (error) {
            throw new AppleWalletError(AppleWalletErrorType.GENERATE_PASS_ERROR, error);
        }
    },

    async sendSilentPushNotification(provider: apn.Provider, devices: AppleWalletDevice[]): Promise<void> {
        try {
            await Promise.all(devices.map(async (device) => {
                if (!device.pushToken) {
                    console.log(`Skipping device ${device.passSerialNumber} because it has no push token`);
                    return;
                }

                const notification = new apn.Notification();
                notification.topic = device.passTypeIdentifier;
                notification.pushType = 'alert';
                notification.alert = "Update pass";
                // notification.payload = {};

                await provider.send(notification, device.pushToken);
            }))
        } catch (error) {
            throw new AppleWalletError(AppleWalletErrorType.SEND_PASS_NOTIFICATION_ERROR, error);
        }
    }
}