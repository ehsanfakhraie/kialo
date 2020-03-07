import {
    ADD_CLAIM_DIALOG,
    ADD_MANAGER_DIALOG,
} from '../actions/types';

const INIT_STATE = {
    AddClaimDialog: false,
    openDialog: false,
    suggestDialog:false,
    title:'',
    error:false
};

export default (state= INIT_STATE, action)=>{
    switch (action.type) {
        case ADD_CLAIM_DIALOG: {
            // console.log('aaaa', action.payload)
            return {
                ...state,
                AddClaimDialog: !state.AddClaimDialog,
                type: action.payload,
                error:action.error
            }
        }
        case ADD_MANAGER_DIALOG: {
            return {
                ...state,
                openDialog: !state.openDialog,
                title: action.payload
            }
        }
        case 'SUGGESTED_LIST_DIALOG':{
            return {
                ...state,
                suggestDialog: !state.suggestDialog
            }
        }

        default: {
            return state
        }
    }
}