/*
 * @Description: 协同变就工具函数
 * @Date: 2022-11-25 17:12:22
 * @Author: chenxingyu
 * @LastEditors: chenxingyu
 */
/**
 * 通过socketId获取协同编辑房间信息
 * @param {*} rooms
 * @param {*} socketId
 * @returns
 */
const getCoeditRoomInfoBySocketId = (rooms, socketId) => {
  let current
  for (const key in rooms) {
    const elements = rooms[key]
    if (!elements || !elements.length) {
      continue
    }
    const element = elements[0]
    if (element.socketId === socketId) {
      current = element
      break
    }
  }
  return current
}

/**
 * 通过screenId获取协同编辑用户
 * @param {*} rooms
 * @param {*} screenId
 * @returns
 */
const getCoeditUsersByScreenId = (rooms, screenId) => {
  const coeditUsers = []

  for (const key in rooms) {
    const elements = rooms[key]
    if (!elements || !elements.length) {
      continue
    }
    const element = elements[0]
    if (element.screenId === screenId) {
      coeditUsers.push(element)
    }
  }
  return coeditUsers
}

module.exports = {
  getCoeditRoomInfoBySocketId,
  getCoeditUsersByScreenId
}
