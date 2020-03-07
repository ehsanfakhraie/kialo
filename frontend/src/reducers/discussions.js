import { GET_DISCUSSIONS, DELETE_DISCUSSION, ADD_DISCUSSION, SELECT_DISCUSSION, GET_USER_DISCUSSIONS, ADD_DISCUSSION_SUCCESS } from "../actions/types.js";
import {ADD_CLAIM_DIALOG, EDIT_DISCUSSION} from "../actions/types";

const initialState = {
    discussions: [],
    discussionAdded:false,
    haveError:'no',
    editDiscussion:{'Add new manager':[], 'Add new writer':[], 'Add new editor':[]}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_DISCUSSIONS:
            return {
                ...state,
                discussions: action.payload,loading:true
            };
        case DELETE_DISCUSSION:
            return {
                ...state,
                discussions: state.discussions.filter(discussions => discussions.id !== action.payload)
            };
        case SELECT_DISCUSSION:
            return{
                ...state,
                selectedDiscussion:action.payload
            }
        case ADD_DISCUSSION:
            return {
                ...state,
                discussionAdding:true
            }

        case ADD_DISCUSSION_SUCCESS:
            return {
                ...state,
                discussions: [...state.discussions, action.payload],
                discussionAdding:false,
                discussionAdded:true,
            }
        case GET_USER_DISCUSSIONS:
            return{
                ...state,
                discussions: action.payload,loading:true
            }
        case EDIT_DISCUSSION:
            var joined = state.editDiscussion[action.name].concat(action.payload);
            return {
                ...state,
                editDiscussion:{...state.editDiscussion,
                    [action.name]: joined
                }
            }
        default:
            return state;
    }
}
