import jwt from 'jsonwebtoken';
import { GoogleWalletError, GoogleWalletErrorType } from '../../types/errors';
import { google, walletobjects_v1 } from 'googleapis';
import { GoogleWallet_FrontFieldPaths, GoogleWalletIssueProps } from './google-wallet-types';

export interface GoogleWalletCredentials {
    project_id: string
    private_key: string
    client_email: string
    client_id: string
    auth_uri: string
    token_uri: string
    auth_provider_x509_cert_url: string
    client_x509_cert_url: string
}

export default class GoogleWalletManager {
    private walletClient: walletobjects_v1.Walletobjects;
    private issuerId: string;
    private credentials: GoogleWalletCredentials;

    constructor(issuerId: string, credentials: GoogleWalletCredentials) {
        this.issuerId = issuerId;
        this.credentials = credentials;

        try {
            const auth = new google.auth.GoogleAuth({
                credentials: this.credentials,
                scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
            });

            this.walletClient = google.walletobjects({ version: 'v1', auth });
        } catch (error) {
            throw new GoogleWalletError(GoogleWalletErrorType.INITIALIZATION_ERROR, error);
        }

    }

    public async sendPassNotification(objectId: string, header: string, body: string): Promise<void> {
        try {
            await this.walletClient.genericobject.addmessage({
                resourceId: `${this.issuerId}.${objectId}`,
                requestBody: {
                    message: {
                        header: header,
                        body: body,
                        id: "update_message_" + Date.now(),
                        messageType: "TEXT_AND_NOTIFY"
                    }
                }
            })
        } catch (error) {
            throw new GoogleWalletError(GoogleWalletErrorType.SEND_NOTIFICATION_ERROR, error);
        }
    }

    public async createPass(objectId: string, classId: string, props: GoogleWalletIssueProps, origin: string): Promise<string> {
        try {
            const passObject: walletobjects_v1.Schema$GenericObject = {
                classId: classId,
                id: `${this.issuerId}.${objectId}`,

                logo: {
                    sourceUri: {
                        uri: props.logoUri
                    },
                    contentDescription: {
                        defaultValue: {
                            language: "es",
                            value: "LOGO_IMAGE_DESCRIPTION"
                        }
                    }
                },
                cardTitle: {
                    defaultValue: {
                        language: "es",
                        value: props.cardTitle
                    }
                },
                header: {
                    defaultValue: {
                        language: "es",
                        value: props.header
                    }
                },
                subheader: {
                    defaultValue: {
                        language: "es",
                        value: props.subheader
                    }
                },
                hexBackgroundColor: props.hexBackgroundColor,
                textModulesData: props.textModulesData,
                barcode: {
                    type: "QR_CODE",
                    value: props.barcode.value,
                    alternateText: props.barcode.alternativeText
                },
                heroImage: {
                    sourceUri: {
                        uri: props.heroUri
                    },
                    contentDescription: {
                        defaultValue: {
                            language: "es",
                            value: "HERO_IMAGE_DESCRIPTION"
                        }
                    }
                },
                linksModuleData: {
                    uris: props.linksModuleData.map(link => ({
                        uri: link.uri,
                        description: link.description,
                        id: link.id
                    }))
                }
            }

            const token = createSignedJWT(passObject, this.credentials.private_key, this.credentials.client_email, origin);
            const saveLink = generateSaveLink(token);

            return saveLink;
        } catch (error) {
            throw new GoogleWalletError(GoogleWalletErrorType.CREATE_PASS_ERROR, error);
        }
    }

    private async getObject(objectId: string): Promise<walletobjects_v1.Schema$GenericObject> {
        try {
            const response = await this.walletClient.genericobject.get({
                resourceId: `${this.issuerId}.${objectId}`
            });

            return response.data;
        } catch (error) {
            throw new GoogleWalletError(GoogleWalletErrorType.GET_OBJECT_ERROR, error);
        }
    }

    public async updatePass(objectId: string, props: GoogleWalletIssueProps): Promise<void> {
        try {
            const object = await this.getObject(objectId);

            // Title
            if(object.cardTitle?.defaultValue && props.cardTitle) {
                object.cardTitle.defaultValue.value = props.cardTitle;
            }
            // Header
            if(object.header?.defaultValue && props.header) {
                object.header.defaultValue.value = props.header;
            }
            // Subheader
            if(object.subheader?.defaultValue && props.subheader) {
                object.subheader.defaultValue.value = props.subheader;
            }

            // Text modules data
            if(object.textModulesData && props.textModulesData && props.textModulesData.length > 0) {
                object.textModulesData = props.textModulesData.map(module => ({
                    ...module,
                    body: props.textModulesData.find(m => m.id === module.id)?.body || module.body
                }))
            }
            // Links module data
            if(object.linksModuleData && object.linksModuleData.uris && props.linksModuleData && props.linksModuleData.length > 0) {
                object.linksModuleData.uris = object.linksModuleData.uris.map(uri => ({
                    ...uri,
                    uri: props.linksModuleData.find(l => l.id === uri.id)?.uri || uri.uri
                }))
            }

            await this.walletClient.genericobject.update({
                resourceId: `${this.issuerId}.${objectId}`,
                requestBody: object
            })
        } catch (error) {
            throw new GoogleWalletError(GoogleWalletErrorType.UPDATE_PASS_ERROR, error);
        }
    }

    public async createPassClass(classIdSufix: string): Promise<string> {
        try {
            const classId = `${this.issuerId}.${classIdSufix}`;

            const passClass: walletobjects_v1.Schema$GenericClass = {
                id: classId,
                classTemplateInfo: {
                    cardTemplateOverride: {
                        cardRowTemplateInfos: [
                            // Front card display - Payment info row
                            {
                                twoItems: {
                                    startItem: {
                                        firstValue: {
                                            fields: [
                                                {
                                                    fieldPath: `object.textModulesData['${GoogleWallet_FrontFieldPaths.PRIMARY_LEFT}']`
                                                }
                                            ]
                                        }
                                    },
                                    endItem: {
                                        firstValue: {
                                            fields: [
                                                {
                                                    fieldPath: `object.textModulesData['${GoogleWallet_FrontFieldPaths.PRIMARY_RIGHT}']`
                                                }
                                            ]
                                        }
                                    }
                                }
                            },
                            // Front card display - Status info row
                            {
                                twoItems: {
                                    startItem: {
                                        firstValue: {
                                            fields: [
                                                {
                                                    fieldPath: `object.textModulesData['${GoogleWallet_FrontFieldPaths.SECONDARY_LEFT}']`
                                                }
                                            ]
                                        }
                                    },
                                    endItem: {
                                        firstValue: {
                                            fields: [
                                                {
                                                    fieldPath: `object.textModulesData['${GoogleWallet_FrontFieldPaths.SECONDARY_RIGHT}']`
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            };

            await this.walletClient.genericclass.insert({
                requestBody: passClass
            });
    
            return classId;
        } catch (error) {
            throw new GoogleWalletError(GoogleWalletErrorType.CREATE_CLASS_ERROR, error);
        }
    }
}

const createSignedJWT = (passObject: walletobjects_v1.Schema$GenericObject, privateKey: string, googleWalletClientEmail: string, origin: string): string => {
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
    const now = Math.floor(Date.now() / 1000);

    const payload = {
        genericObjects: [passObject]
    };

    const claims = {
        iss: googleWalletClientEmail,
        aud: 'google',
        typ: 'savetowallet',
        iat: now,
        origins: [origin],
        payload: payload
    };

    // Sign the JWT with the private key
    const token = jwt.sign(claims, formattedPrivateKey, {
        algorithm: 'RS256'
    });

    return token;
};

const generateSaveLink = (token: string): string => {
    return `https://pay.google.com/gp/v/save/${token}`;
}; 