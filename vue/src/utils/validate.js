/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) { 
  //const valid_map = ['himlaya', 'editor','shox']//合法的用户名，目前只有三个
  //return valid_map.indexOf(str.trim()) >= 0
  return str.trim().length; //可自由添加用户名
}
