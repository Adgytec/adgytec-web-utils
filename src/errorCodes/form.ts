export const formCodes = {
    formValidationFailed: "validation-failed",
} as const;

export const fieldValidationCodes = {
    unknown: "unknown-error",

    nil: "validation_nil",
    empty: "validation_empty",

    dateInvalid: "validation_date_invalid",
    dateTooEarly: "validation_date_too_early",
    dateTooLate: "validation_date_too_late",
    dateOutOfRange: "validation_date_out_of_range",

    lengthTooLong: "validation_length_too_long",
    lengthTooShort: "validation_length_too_short",
    lengthInvalid: "validation_length_invalid",
    lengthOutOfRange: "validation_length_out_of_range",
    lengthEmptyRequired: "validation_length_empty_required",

    keyWrongType: "validation_key_wrong_type",
    keyMissing: "validation_key_missing",
    keyUnexpected: "validation_key_unexpected",

    minGreaterEqualThanRequired: "validation_min_greater_equal_than_required",
    maxLessEqualThanRequired: "validation_max_less_equal_than_required",
    minGreaterThanRequired: "validation_min_greater_than_required",
    maxLessThanRequired: "validation_max_less_than_required",

    required: "validation_required",
    nilOrNotEmptyRequired: "validation_nil_or_not_empty_required",

    inInvalid: "validation_in_invalid",
    matchInvalid: "validation_match_invalid",
    multipleOfInvalid: "validation_multiple_of_invalid",
    notInInvalid: "validation_not_in_invalid",
    notNilRequired: "validation_not_nil_required",

    isEmail: "validation_is_email",
    isURL: "validation_is_url",
    isRequestURL: "validation_is_request_url",
    requestIsRequestURI: "validation_request_is_request_uri",

    isAlpha: "validation_is_alpha",
    isDigit: "validation_is_digit",
    isAlphanumeric: "validation_is_alphanumeric",
    isUTFLetter: "validation_is_utf_letter",
    isUTFDigit: "validation_is_utf_digit",
    isUTFLetterNumeric: "validation_is utf_letter_numeric",
    isUTFNumeric: "validation_is_utf_numeric",

    isLowerCase: "validation_is_lower_case",
    isUpperCase: "validation_is_upper_case",

    isHexadecimal: "validation_is_hexadecimal",
    isHexColor: "validation_is_hex_color",
    isRGBColor: "validation_is_rgb_color",

    isInt: "validation_is_int",
    isFloat: "validation_is_float",

    isUUIDv3: "validation_is_uuid_v3",
    isUUIDv4: "validation_is_uuid_v4",
    isUUIDv5: "validation_is_uuid_v5",
    isUUID: "validation_is_uuid",

    isCreditCard: "validation_is_credit_card",

    isISBN10: "validation_is_isbn_10",
    isISBN13: "validation_is_isbn_13",
    isISBN: "validation_is_isbn",

    isJSON: "validation_is_json",

    isASCII: "validation_is_ascii",
    isPrintableASCII: "validation_is_printable_ascii",
    isMultibyte: "validation_is_multibyte",
    isFullWidth: "validation_is_full_width",
    isHalfWidth: "validation_is_half_width",
    isVariableWidth: "validation_is_variable_width",

    isBase64: "validation_is_base64",
    isDataURI: "validation_is_data_uri",

    isE164Number: "validation_is_e164_number",

    isCountryCode2Letter: "validation_is_country_code_2_letter",
    isCountryCode3Letter: "validation_is_country_code_3_letter",
    isCurrencyCode: "validation_is_currency_code",

    isDialString: "validation_is_dial_string",

    isMACAddress: "validation_is_mac_address",

    isIP: "validation_is_ip",
    isIPv4: "validation_is_ipv4",
    isIPv6: "validation_is_ipv6",

    isSubDomain: "validation_is_sub_domain",
    isDomain: "validation_is_domain",
    isDNSName: "validation_is_dns_name",
    isHost: "validation_is_host",
    isPort: "validation_is_port",

    isMongoID: "validation_is_mongo_id",

    isLatitude: "validation_is_latitude",
    isLongitude: "validation_is_longitude",

    isSSN: "validation_is_ssn",

    isSemver: "validation_is_semver",
} as const;
