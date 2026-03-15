export const httpReqHeaders = {
    contentType: {
        key: "Content-Type",
        valueApplicationJSON: "application/json",
    },
    authorization: {
        key: "Authorization",
        schemeBearer: "Bearer",
        schemeBasic: "Basic",
    },
    userLocale: {
        key: "x-user-locale",
    },
} as const;
