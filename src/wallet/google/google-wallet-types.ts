export enum GoogleWallet_FrontFieldPaths {
    PRIMARY_LEFT = "primaryLeft",
    PRIMARY_RIGHT = "primaryRight",
    SECONDARY_LEFT = "secondaryLeft",
    SECONDARY_RIGHT = "secondaryRight",
}

export interface TextModuleData {
    id: string;
    header: string;
    body: string;
}
export interface LinkModuleData {
    id: string;
    uri: string;
    description: string;
}


export interface GoogleWalletIssueProps {
    logoUri: string;
    heroUri: string;
    cardTitle: string;
    header: string;
    subheader: string;
    hexBackgroundColor: string;

    textModulesData: TextModuleData[];
    linksModuleData: LinkModuleData[];
    barcode: {
        value: string;
        alternativeText: string;
    }
}

export interface GoogleWalletUpdateProps {
    logoUri?: string;
    heroUri?: string;
    cardTitle?: string;
    header?: string;
    subheader?: string;

    textModulesData?: TextModuleData[];
    linksModuleData?: LinkModuleData[];
}