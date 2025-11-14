export enum GoogleWallet_FrontFieldPaths {
    PRIMARY_LEFT = "primary_left",
    PRIMARY_RIGHT = "primary_right",
    SECONDARY_LEFT = "secondary_left",
    SECONDARY_RIGHT = "secondary_right",
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