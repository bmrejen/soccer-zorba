import { useReducer } from "react"

export function useReducerWithMiddleware(reducer: any, initialState: any, afterwareFunction: Function) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchWithAfterware = (action: any) => {
    afterwareFunction(action);
    dispatch(action);
  };
  return [state, dispatchWithAfterware];
}