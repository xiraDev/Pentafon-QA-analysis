// ----------------------------------------------------------------------

const PRIMARY_NAME = ['A', 'N', 'H', 'L', 'Q', '9', '8'];
const INFO_NAME = ['F', 'G', 'T', 'I', 'J', '1', '2', '3'];
const SUCCESS_NAME = ['K', 'D', 'Y', 'B', 'O', '4', '5'];
const WARNING_NAME = ['P', 'E', 'R', 'S', 'C', 'U', '6', '7'];
const ERROR_NAME = ['V', 'W', 'X', 'M', 'Z'];

/**
 * If name is truthy, return the first character of name, capitalized. Otherwise, return undefined.
 * @param name - The name of the person.
 * @returns The first character of the name string, capitalized.
 */
function getFirstCharacter(name) {
  return name && name.charAt(0).toUpperCase();
}

/**
 * It returns a color based on the first character of the name
 * @param name - The name of the user.
 * @returns the color of the avatar based on the first letter of the name.
 */
function getAvatarColor(name) {
  if (PRIMARY_NAME.includes(getFirstCharacter(name))) return 'primary';
  if (INFO_NAME.includes(getFirstCharacter(name))) return 'info';
  if (SUCCESS_NAME.includes(getFirstCharacter(name))) return 'success';
  if (WARNING_NAME.includes(getFirstCharacter(name))) return 'warning';
  if (ERROR_NAME.includes(getFirstCharacter(name))) return 'warning';
  return 'default';
}

/**
 * The function `getCover` returns the path to an image based on the first character of a given name.
 * @param name - The `name` parameter is a string that represents a name.
 * @returns the path to an image file based on the first character of the input name. If the first
 * character is found in one of the arrays PRIMARY_NAME, INFO_NAME, SUCCESS_NAME, WARNING_NAME, or
 * ERROR_NAME, the function will return the corresponding image path. If the first character is not
 * found in any of the arrays, the function will return the string 'default'.
 */
function getCover(name) {
  if (PRIMARY_NAME.includes(getFirstCharacter(name))) return '/assets/covers/cover_1.jpg';
  if (INFO_NAME.includes(getFirstCharacter(name))) return '/assets/covers/cover_2.jpg';
  if (SUCCESS_NAME.includes(getFirstCharacter(name))) return '/assets/covers/cover_3.jpg';
  if (WARNING_NAME.includes(getFirstCharacter(name))) return '/assets/covers/cover_4.jpg';
  if (ERROR_NAME.includes(getFirstCharacter(name))) return '/assets/covers/cover_5.jpg';
  return 'default';
}

/**
 * It takes a name and returns an object with the first character of the name and a color
 * @param name - The name of the user.
 * @returns An object with two properties: name and color.
 */
export default function createAvatar(name) {
  return {
    name: getFirstCharacter(name),
    color: getAvatarColor(name),
    cover: getCover(name),
  };
}
