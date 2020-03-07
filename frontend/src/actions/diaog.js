import {ADD_CLAIM_DIALOG, ADD_MANAGER_DIALOG} from './types'

export const addClaimDialog = (type, error) => {
    return {
        type: ADD_CLAIM_DIALOG,
        payload: type,
        error: error
    };
};

export const addManagerDialog = (title) => {
    return {
        type: ADD_MANAGER_DIALOG,
        payload : title
    };
};

export const suggestedListrDialog = () => {
    return {
        type: 'SUGGESTED_LIST_DIALOG',
    };
};