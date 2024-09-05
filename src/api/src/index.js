"use strict";
exports.__esModule = true;
exports.composeEvent = exports.EVENTS = void 0;
// API events described by api-[api medium]-[api action]-[data entity]-[data translation]
exports.EVENTS = {
    API_SOCKET_SUB_USER_ID: "api-socket-sub-user-id",
    API_SOCKET_PUT_USER_ID: "api-socket-put-user-id"
};
function composeEvent(apiMedium, apiAction, dataEntity, dataTranslation) {
    return "api-" + apiMedium + "-" + apiAction + "-" + dataEntity + "-" + dataTranslation;
}
exports.composeEvent = composeEvent;
