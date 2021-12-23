import { customerConstants } from '../constants';

export function registration(state = {}, action) {
  switch (action.type) {
    case customerConstants.REGISTER_REQUEST:
      return { registering: true };
    case customerConstants.REGISTER_SUCCESS:
      return {};
    case customerConstants.REGISTER_FAILURE:
      return {};
    default:
      return state
  }
}