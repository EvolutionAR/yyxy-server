/*
 * @Description: 大屏工具函数
 * @Date: 2022-11-18 17:26:46
 * @Author: chenxingyu
 * @LastEditors: chenxingyu
 */
const _ = require('lodash')
const { encryptPath } = require('../extend/crypto')

/**
 * 大屏数据转换
 * @param {Object} screen
 * @returns
 */
exports.screenDataTransfer = screen => {
  let screenData = _.pick(screen, [
    'screenType',
    'type',
    'name',
    'createdAt',
    'updatedAt',
    'id',
    'templateId',
    'isScreentpl',
    'projectId',
    'isDynamicScreen',
    'coeditInfo',
    'coeditId'
  ])
  let { config: screenConfig = {} } = screen
  const start =
    screenConfig['thumbnail'] && screenConfig['thumbnail'].indexOf('/public/')
  const thumbnail =
    screenConfig['thumbnail'] &&
    screenConfig['thumbnail'].substring(start + 7).split('?')[0]
  const encryptThumbnail = thumbnail && encryptPath(thumbnail)
  // let screenshare = await ctx.service.screenshare.findOne({ screenId: screen.id });
  //const domain = screenConfig['thumbnail']&& screenConfig['thumbnail'].substring(0,start)
  _.extend(screenData, {
    thumbnail: screenConfig['thumbnail'],
    encryptThumbnail: encryptThumbnail && encryptThumbnail,
    isPublic: false,
    shareUrl: '',
    width: screenConfig['width'],
    heiht: screenConfig['height'],
    isConnect: screen.isConnect ? screen.isConnect : false // 添加是否开启多端控制
  })
  return screenData
}
