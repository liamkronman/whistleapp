export const INIT = '[INIT]'
export const INIT_APPLICATION = `${INIT} Set Initial values for the application`

export const initializeApp = () => ({
    type: INIT_APPLICATION,
    payload: {},
});