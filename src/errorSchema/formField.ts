import z from "zod";
import { fieldValidationCodes } from "../errorCodes";

export const fieldValidationErrorSchemas = {
    unknown: z.object({
        code: z.literal(fieldValidationCodes.unknown),
        debugMessage: z.string(),
    }),

    nil: z.object({
        code: z.literal(fieldValidationCodes.nil),
        debugMessage: z.string(),
    }),

    empty: z.object({
        code: z.literal(fieldValidationCodes.empty),
        debugMessage: z.string(),
    }),

    dateInvalid: z.object({
        code: z.literal(fieldValidationCodes.dateInvalid),
        debugMessage: z.string(),
    }),

    dateTooEarly: z.object({
        code: z.literal(fieldValidationCodes.dateTooEarly),
        debugMessage: z.string(),
        min: z.coerce.date(),
        debugMin: z.string(),
    }),

    dateTooLate: z.object({
        code: z.literal(fieldValidationCodes.dateTooLate),
        debugMessage: z.string(),
        max: z.coerce.date(),
        debugMax: z.string(),
    }),

    dateOutOfRange: z.object({
        code: z.literal(fieldValidationCodes.dateOutOfRange),
        debugMessage: z.string(),
        min: z.coerce.date(),
        max: z.coerce.date(),
        debugMin: z.string(),
        debugMax: z.string(),
    }),

    lengthTooLong: z.object({
        code: z.literal(fieldValidationCodes.lengthTooLong),
        debugMessage: z.string(),
        max: z.number(),
    }),

    lengthTooShort: z.object({
        code: z.literal(fieldValidationCodes.lengthTooShort),
        debugMessage: z.string(),
        min: z.number(),
    }),

    lengthInvalid: z.object({
        code: z.literal(fieldValidationCodes.lengthInvalid),
        debugMessage: z.string(),
        min: z.number(),
    }),

    lengthOutOfRange: z.object({
        code: z.literal(fieldValidationCodes.lengthOutOfRange),
        debugMessage: z.string(),
        min: z.number(),
        max: z.number(),
    }),

    lengthEmptyRequired: z.object({
        code: z.literal(fieldValidationCodes.lengthEmptyRequired),
        debugMessage: z.string(),
    }),

    keyWrongType: z.object({
        code: z.literal(fieldValidationCodes.keyWrongType),
        debugMessage: z.string(),
    }),

    keyMissing: z.object({
        code: z.literal(fieldValidationCodes.keyMissing),
        debugMessage: z.string(),
    }),

    keyUnexpected: z.object({
        code: z.literal(fieldValidationCodes.keyUnexpected),
        debugMessage: z.string(),
    }),

    minGreaterEqualThanRequired: z.object({
        code: z.literal(fieldValidationCodes.minGreaterEqualThanRequired),
        debugMessage: z.string(),
        threshold: z.union([z.number(), z.coerce.date()]),
    }),

    maxLessEqualThanRequired: z.object({
        code: z.literal(fieldValidationCodes.maxLessEqualThanRequired),
        debugMessage: z.string(),
        threshold: z.union([z.number(), z.coerce.date()]),
    }),

    minGreaterThanRequired: z.object({
        code: z.literal(fieldValidationCodes.minGreaterThanRequired),
        debugMessage: z.string(),
        threshold: z.union([z.number(), z.coerce.date()]),
    }),

    maxLessThanRequired: z.object({
        code: z.literal(fieldValidationCodes.maxLessThanRequired),
        debugMessage: z.string(),
        threshold: z.union([z.number(), z.coerce.date()]),
    }),

    required: z.object({
        code: z.literal(fieldValidationCodes.required),
        debugMessage: z.string(),
    }),

    nilOrNotEmptyRequired: z.object({
        code: z.literal(fieldValidationCodes.nilOrNotEmptyRequired),
        debugMessage: z.string(),
    }),

    inInvalid: z.object({
        code: z.literal(fieldValidationCodes.inInvalid),
        debugMessage: z.string(),
        valid: z.array(z.unknown()),
    }),

    matchInvalid: z.object({
        code: z.literal(fieldValidationCodes.matchInvalid),
        debugMessage: z.string(),
    }),

    multipleOfInvalid: z.object({
        code: z.literal(fieldValidationCodes.multipleOfInvalid),
        debugMessage: z.string(),
        base: z.number(),
    }),

    notInInvalid: z.object({
        code: z.literal(fieldValidationCodes.notInInvalid),
        debugMessage: z.string(),
        valid: z.array(z.unknown()),
    }),

    notNilRequired: z.object({
        code: z.literal(fieldValidationCodes.notNilRequired),
        debugMessage: z.string(),
    }),

    isEmail: z.object({
        code: z.literal(fieldValidationCodes.isEmail),
        debugMessage: z.string(),
    }),

    isURL: z.object({
        code: z.literal(fieldValidationCodes.isURL),
        debugMessage: z.string(),
    }),

    isRequestURL: z.object({
        code: z.literal(fieldValidationCodes.isRequestURL),
        debugMessage: z.string(),
    }),

    requestIsRequestURI: z.object({
        code: z.literal(fieldValidationCodes.requestIsRequestURI),
        debugMessage: z.string(),
    }),

    isAlpha: z.object({
        code: z.literal(fieldValidationCodes.isAlpha),
        debugMessage: z.string(),
    }),

    isDigit: z.object({
        code: z.literal(fieldValidationCodes.isDigit),
        debugMessage: z.string(),
    }),

    isAlphanumeric: z.object({
        code: z.literal(fieldValidationCodes.isAlphanumeric),
        debugMessage: z.string(),
    }),

    isUTFLetter: z.object({
        code: z.literal(fieldValidationCodes.isUTFLetter),
        debugMessage: z.string(),
    }),

    isUTFDigit: z.object({
        code: z.literal(fieldValidationCodes.isUTFDigit),
        debugMessage: z.string(),
    }),

    isUTFLetterNumeric: z.object({
        code: z.literal(fieldValidationCodes.isUTFLetterNumeric),
        debugMessage: z.string(),
    }),

    isUTFNumeric: z.object({
        code: z.literal(fieldValidationCodes.isUTFNumeric),
        debugMessage: z.string(),
    }),

    isLowerCase: z.object({
        code: z.literal(fieldValidationCodes.isLowerCase),
        debugMessage: z.string(),
    }),

    isUpperCase: z.object({
        code: z.literal(fieldValidationCodes.isUpperCase),
        debugMessage: z.string(),
    }),

    isHexadecimal: z.object({
        code: z.literal(fieldValidationCodes.isHexadecimal),
        debugMessage: z.string(),
    }),

    isHexColor: z.object({
        code: z.literal(fieldValidationCodes.isHexColor),
        debugMessage: z.string(),
    }),

    isRGBColor: z.object({
        code: z.literal(fieldValidationCodes.isRGBColor),
        debugMessage: z.string(),
    }),

    isInt: z.object({
        code: z.literal(fieldValidationCodes.isInt),
        debugMessage: z.string(),
    }),

    isFloat: z.object({
        code: z.literal(fieldValidationCodes.isFloat),
        debugMessage: z.string(),
    }),

    isUUIDv3: z.object({
        code: z.literal(fieldValidationCodes.isUUIDv3),
        debugMessage: z.string(),
    }),

    isUUIDv4: z.object({
        code: z.literal(fieldValidationCodes.isUUIDv4),
        debugMessage: z.string(),
    }),

    isUUIDv5: z.object({
        code: z.literal(fieldValidationCodes.isUUIDv5),
        debugMessage: z.string(),
    }),

    isUUID: z.object({
        code: z.literal(fieldValidationCodes.isUUID),
        debugMessage: z.string(),
    }),

    isCreditCard: z.object({
        code: z.literal(fieldValidationCodes.isCreditCard),
        debugMessage: z.string(),
    }),

    isISBN10: z.object({
        code: z.literal(fieldValidationCodes.isISBN10),
        debugMessage: z.string(),
    }),

    isISBN13: z.object({
        code: z.literal(fieldValidationCodes.isISBN13),
        debugMessage: z.string(),
    }),

    isISBN: z.object({
        code: z.literal(fieldValidationCodes.isISBN),
        debugMessage: z.string(),
    }),

    isJSON: z.object({
        code: z.literal(fieldValidationCodes.isJSON),
        debugMessage: z.string(),
    }),

    isASCII: z.object({
        code: z.literal(fieldValidationCodes.isASCII),
        debugMessage: z.string(),
    }),

    isPrintableASCII: z.object({
        code: z.literal(fieldValidationCodes.isPrintableASCII),
        debugMessage: z.string(),
    }),

    isMultibyte: z.object({
        code: z.literal(fieldValidationCodes.isMultibyte),
        debugMessage: z.string(),
    }),

    isFullWidth: z.object({
        code: z.literal(fieldValidationCodes.isFullWidth),
        debugMessage: z.string(),
    }),

    isHalfWidth: z.object({
        code: z.literal(fieldValidationCodes.isHalfWidth),
        debugMessage: z.string(),
    }),

    isVariableWidth: z.object({
        code: z.literal(fieldValidationCodes.isVariableWidth),
        debugMessage: z.string(),
    }),

    isBase64: z.object({
        code: z.literal(fieldValidationCodes.isBase64),
        debugMessage: z.string(),
    }),

    isDataURI: z.object({
        code: z.literal(fieldValidationCodes.isDataURI),
        debugMessage: z.string(),
    }),

    isE164Number: z.object({
        code: z.literal(fieldValidationCodes.isE164Number),
        debugMessage: z.string(),
    }),

    isCountryCode2Letter: z.object({
        code: z.literal(fieldValidationCodes.isCountryCode2Letter),
        debugMessage: z.string(),
    }),

    isCountryCode3Letter: z.object({
        code: z.literal(fieldValidationCodes.isCountryCode3Letter),
        debugMessage: z.string(),
    }),

    isCurrencyCode: z.object({
        code: z.literal(fieldValidationCodes.isCurrencyCode),
        debugMessage: z.string(),
    }),

    isDialString: z.object({
        code: z.literal(fieldValidationCodes.isDialString),
        debugMessage: z.string(),
    }),

    isMACAddress: z.object({
        code: z.literal(fieldValidationCodes.isMACAddress),
        debugMessage: z.string(),
    }),

    isIP: z.object({
        code: z.literal(fieldValidationCodes.isIP),
        debugMessage: z.string(),
    }),

    isIPv4: z.object({
        code: z.literal(fieldValidationCodes.isIPv4),
        debugMessage: z.string(),
    }),

    isIPv6: z.object({
        code: z.literal(fieldValidationCodes.isIPv6),
        debugMessage: z.string(),
    }),

    isSubDomain: z.object({
        code: z.literal(fieldValidationCodes.isSubDomain),
        debugMessage: z.string(),
    }),

    isDomain: z.object({
        code: z.literal(fieldValidationCodes.isDomain),
        debugMessage: z.string(),
    }),

    isDNSName: z.object({
        code: z.literal(fieldValidationCodes.isDNSName),
        debugMessage: z.string(),
    }),

    isHost: z.object({
        code: z.literal(fieldValidationCodes.isHost),
        debugMessage: z.string(),
    }),

    isPort: z.object({
        code: z.literal(fieldValidationCodes.isPort),
        debugMessage: z.string(),
    }),

    isMongoID: z.object({
        code: z.literal(fieldValidationCodes.isMongoID),
        debugMessage: z.string(),
    }),

    isLatitude: z.object({
        code: z.literal(fieldValidationCodes.isLatitude),
        debugMessage: z.string(),
    }),

    isLongitude: z.object({
        code: z.literal(fieldValidationCodes.isLongitude),
        debugMessage: z.string(),
    }),

    isSSN: z.object({
        code: z.literal(fieldValidationCodes.isSSN),
        debugMessage: z.string(),
    }),

    isSemver: z.object({
        code: z.literal(fieldValidationCodes.isSemver),
        debugMessage: z.string(),
    }),
} as const;

function valuesAsTuple<T extends Record<string, unknown>>(obj: T) {
    return Object.values(obj) as [T[keyof T], ...T[keyof T][]];
}

export const formFieldDiscriminatedUnionSchema = z.discriminatedUnion(
    "code",
    valuesAsTuple(fieldValidationErrorSchemas)
);

export type FormFieldError = z.infer<typeof formFieldDiscriminatedUnionSchema>;
