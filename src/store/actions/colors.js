export const GET_COLORS = "GET_COLORS";

export function receiveColors(colors) {
  return {
    type: GET_COLORS,
    colors,
  };
}

// export function deleteAccount(id) {
//   return {
//     type: DELETE_ACCOUNT,
//     id,
//   };
// }
