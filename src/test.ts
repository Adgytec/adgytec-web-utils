// TESTS will be added in new pr
// this is for basic check of poc

import {
    formCodes,
    formFieldInvalidTypeCauses,
    formFieldTypes,
} from "./errorCodes";
import { ApplicationError } from "./errors";
import { flattenFieldNodes, type ErrorDetails } from "./errorSchema";
import { parseErrorResponse } from "./response/errorResponse";

const json = {
    code: formCodes.formValidationFailed,
    details: [
        {
            key: "emails",
            children: [
                {
                    key: "0",
                    errors: [
                        {
                            type: formFieldTypes.invalid,
                            details: {
                                cause: formFieldInvalidTypeCauses.invalidEmail,
                            },
                        },
                    ],
                },
                {
                    key: "1",
                    errors: [
                        {
                            type: formFieldTypes.invalid,
                            details: {
                                cause: formFieldInvalidTypeCauses.missingMxRecords,
                            },
                        },
                    ],
                },
            ],
        },

        {
            key: "profile",
            children: [
                {
                    key: "name",
                    children: [
                        {
                            key: "first",
                            errors: [
                                {
                                    type: formFieldTypes.length,
                                    details: { min: 2, max: 30 },
                                },
                            ],
                        },
                        {
                            key: "last",
                            errors: [
                                {
                                    type: formFieldTypes.missing,
                                },
                            ],
                        },
                    ],
                },

                {
                    key: "contact",
                    children: [
                        {
                            key: "phones",
                            children: [
                                {
                                    key: "0",
                                    children: [
                                        {
                                            key: "countryCode",
                                            errors: [
                                                {
                                                    type: formFieldTypes.invalid,
                                                    details: {
                                                        cause: formFieldInvalidTypeCauses.notDigit,
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            key: "number",
                                            errors: [
                                                {
                                                    type: formFieldTypes.length,
                                                    details: {
                                                        min: 10,
                                                        max: 10,
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    key: "1",
                                    errors: [
                                        {
                                            type: formFieldTypes.invalid,
                                            details: {
                                                cause: formFieldInvalidTypeCauses.notDigit,
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },

        {
            key: "age",
            errors: [
                {
                    type: formFieldTypes.underflow,
                    details: { min: 18 },
                },
            ],
        },

        {
            key: "price",
            errors: [
                {
                    type: formFieldTypes.overflow,
                    details: { max: 1000 },
                },
            ],
        },

        {
            key: "username",
            errors: [
                {
                    type: formFieldTypes.length,
                    details: { min: 3, max: 20 },
                },
            ],
        },

        {
            key: "createdAt",
            errors: [
                {
                    type: formFieldTypes.overflow,
                    details: {
                        max: "2026-01-01T00:00:00Z",
                    },
                },
            ],
        },

        {
            key: "address",
            children: [
                {
                    key: "street",
                    errors: [
                        {
                            type: formFieldTypes.missing,
                        },
                    ],
                },
                {
                    key: "location",
                    children: [
                        {
                            key: "city",
                            errors: [
                                {
                                    type: formFieldTypes.length,
                                    details: { min: 2, max: 50 },
                                },
                            ],
                        },
                        {
                            key: "coordinates",
                            children: [
                                {
                                    key: "lat",
                                    errors: [
                                        {
                                            type: formFieldTypes.invalid,
                                            details: {
                                                cause: formFieldInvalidTypeCauses.invalidValue,
                                            },
                                        },
                                    ],
                                },
                                {
                                    key: "lng",
                                    errors: [
                                        {
                                            type: formFieldTypes.invalid,
                                            details: {
                                                cause: formFieldInvalidTypeCauses.invalidValue,
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    key: "zipcode",
                    errors: [
                        {
                            type: formFieldTypes.length,
                            details: { min: 5, max: 6 },
                        },
                    ],
                },
            ],
        },
    ],
};

function parseError(err: ApplicationError): ErrorDetails | null {
    try {
        return err.parse();
    } catch (err) {
        console.log("++++++++++++++++++++++++++++++++++++++++++");
        console.log(err);
        console.log("++++++++++++++++++++++++++++++++++++++++++");

        return null;
    }
}

function main() {
    try {
        parseErrorResponse(json);
    } catch (err) {
        console.log("----------------------------------------");
        console.log(err);
        console.log("----------------------------------------");

        if (!(err instanceof ApplicationError)) {
            return null;
        }

        const val = parseError(err);

        if (!val) {
            console.log("****************************************");
            console.log("weird err this should not happen right now");
            console.log("****************************************");
            return;
        }

        if (val.code === formCodes.formValidationFailed) {
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            console.log(flattenFieldNodes(val.details));
            // for (const item of val.details) {
            //     if ("errors" in item) {
            //         for (const error of item.errors) {
            //             console.log(error);
            //         }
            //     } else {
            //         for (const children of item.children) {
            //             console.log(children);
            //         }
            //     }
            // }
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            return;
        }

        console.log("=========================================");
        console.log("hmm this is wrong, check what is wrong");
        console.log("=========================================");
        console.log(val);
    }
}

main();
