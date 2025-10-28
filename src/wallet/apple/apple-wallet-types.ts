type DataDetectorTypes = 'PKDataDetectorTypePhoneNumber' | 'PKDataDetectorTypeLink' | 'PKDataDetectorTypeAddress' | 'PKDataDetectorTypeCalendarEvent'
type DateStyle = 'PKDateStyleNone' | 'PKDateStyleShort' | 'PKDateStyleMedium' | 'PKDateStyleLong' | 'PKDateStyleFull'
type NumberStyle = 'PKNumberStyleDecimal' | 'PKNumberStylePercent' | 'PKNumberStyleScientific' | 'PKNumberStyleSpellOut'
type TextAlignment = 'PKTextAlignmentLeft' | 'PKTextAlignmentCenter' | 'PKTextAlignmentRight' | 'PKTextAlignmentNatural'
export interface PassFieldContent {
    /**
     * Used for markup links. Example: `<a href='http://example.com/customers/123'>Edit my profile</a>`
     */
    attributedValue?: string
    /**
     * A format string for the alert text to display when the pass updates. The format string needs to contain the escape %@, which the field’s new value replaces. For example, Gate changed to %@.
     */
    changeMessage?: string
    /**
     * ISO 4217 currency code as a string
     */
    currencyCode?: string
    dataDetectorTypes?: DataDetectorTypes[]
    dateStyle?: DateStyle
    key: string
    label?: string
    numberStyle?: NumberStyle
    textAlignment?: TextAlignment
    timeStyle?: DateStyle
    value?: string | number

}
export interface AppleWalletImages {
    icon: Buffer;
    iconX2: Buffer;
    iconX3: Buffer;
    logo: Buffer;
    logoX2: Buffer;
    logoX3: Buffer;
    thumbnail: Buffer;
    thumbnailX2: Buffer;
    thumbnailX3: Buffer;
}

export interface AppleWalletIssueProps {
    description: string;
    backgroundColorRgb: string;
    foregroundColorRgb: string;
    labelColorRgb: string;
    serialNumber: string;
    barcode: {
        value: string;
        alternativeText: string;
    }
    header: PassFieldContent
    primaryField: PassFieldContent
    secondaryFields: [PassFieldContent, PassFieldContent]
    auxiliaryFields: [PassFieldContent, PassFieldContent]
    backFields: PassFieldContent[]
}

export interface AppleWalletDevice {
    passSerialNumber: string;
    pushToken: string | null;
    passTypeIdentifier: string;
}