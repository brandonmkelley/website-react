
// API events described by api-[api medium]-[api action]-[data entity]-[data translation]
export const EVENTS = {
    API_SOCKET_SUB_USER_ID: "api-socket-sub-user-id",
    API_SOCKET_PUT_USER_ID: "api-socket-put-user-id"
}

export function composeEvent(
    apiMedium: string,
    apiAction: string,
    dataEntity: string,
    dataTranslation: string): string {
    
    return "api-" + apiMedium + "-" + apiAction + "-" + dataEntity + "-" + dataTranslation
}
