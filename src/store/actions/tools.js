export const RECEIVE_TOOLS = "RECEIVE_TOOLS";
//export const DELETE_ACCOUNT = "DELETE_ACCOUNT";

export function receiveTools(tools) {
  return {
    type: RECEIVE_TOOLS,
    tools,
  };
}

// export function deleteAccount(id) {
//   return {
//     type: DELETE_ACCOUNT,
//     id,
//   };
// }
