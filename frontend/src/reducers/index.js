import { combineReducers } from "redux";
import discussions from "./discussions";
import claims from "./claims";
import auth from "./auth";
import messages from './messages';
import errors from './errors';
import dialog from "./dialog";


export default combineReducers({
    discussions,claims,auth,messages,errors,dialog

});
