const base64 = require('base-64')
const aaa = [
  {
    姓名: '苏学瑞',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_suxuerui',
    密码: 'sxr29157722'
  },
  {
    姓名: '孙博韬',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_sunbotao',
    密码: 'sbt50675657'
  },
  {
    姓名: '张顺民',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_zhangshunmin',
    密码: 'zsm95300981'
  },
  {
    姓名: '宋彦朝',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_songyanzhao',
    密码: 'syz54781635'
  },
  {
    姓名: '刘旺',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_liuwang',
    密码: 'lw27941861'
  },
  {
    姓名: '李林林',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_lilinlin',
    密码: 'lll45648855'
  },
  {
    姓名: '程远扬',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_chengyuanyang',
    密码: 'cyy83416518'
  },
  {
    姓名: '白小莉',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_baixiaoli',
    密码: 'bxl71482894'
  },
  {
    姓名: '宋慧慧',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_songhuihui',
    密码: 'shh94894925'
  },
  {
    姓名: '梁凯钧',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_liangkaijun',
    密码: 'lkj92556941'
  },
  {
    姓名: '陈显浩',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_chenxianhao',
    密码: 'cxh71748493'
  },
  {
    姓名: '宋之乔',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_songzhiqiao',
    密码: 'szq91679591'
  },
  {
    姓名: '朱峰',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_zhufeng',
    密码: 'zf51498968'
  },
  {
    姓名: '温伊哲',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_wenyizhe',
    密码: 'wyz81971063'
  },
  {
    姓名: '杨松涛',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_yangsongtao',
    密码: 'yst26386350'
  },
  {
    姓名: '于佳玉',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_yujiayu',
    密码: 'yjy18247277'
  },
  {
    姓名: '邓祥',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_dengxiang',
    密码: 'dx16761904'
  },
  {
    姓名: '姚赛娅',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_yaosaiya',
    密码: 'ysy27006419'
  },
  {
    姓名: '段佳伟',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_duanjiawei',
    密码: 'djw52438011'
  },
  {
    姓名: '李玉林',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_liyulin',
    密码: 'lyl50725451'
  },
  {
    姓名: '张伦',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_zhanglun',
    密码: 'zl18367398'
  },
  {
    姓名: '帅克秦',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_shuaikeqin',
    密码: 'skq25770104'
  },
  {
    姓名: '刘毅',
    区域: '北方',
    是否参与考核: '是',
    用户名: 'bf_liuyi',
    密码: 'ly44856962'
  },
  {
    姓名: '郭明辉',
    区域: '山东',
    是否参与考核: '是',
    用户名: 'sd_guominghui',
    密码: 'gmh94822808'
  },
  {
    姓名: '郭连晓',
    区域: '山东',
    是否参与考核: '是',
    用户名: 'sd_guolianxiao',
    密码: 'glx18463448'
  },
  {
    姓名: '赵新',
    区域: '山东',
    是否参与考核: '是',
    用户名: 'sd_zhaoxin',
    密码: 'zx85906356'
  },
  {
    姓名: '赵岩',
    区域: '山东',
    是否参与考核: '是',
    用户名: 'sd_zhaoyan',
    密码: 'zy32458360'
  },
  {
    姓名: '梁川',
    区域: '山东',
    是否参与考核: '是',
    用户名: 'sd_liangchuan',
    密码: 'lc88628036'
  },
  {
    姓名: '邢辉',
    区域: '山东',
    是否参与考核: '是',
    用户名: 'sd_xinghui',
    密码: 'xh13452688'
  },
  {
    姓名: '盛尊辉',
    区域: '山东',
    是否参与考核: '是',
    用户名: 'sd_shengzunhui',
    密码: 'szh46173737'
  },
  {
    姓名: '宋繁坤',
    区域: '山东',
    是否参与考核: '是',
    用户名: 'sd_songfankun',
    密码: 'sfk71438269'
  },
  {
    姓名: '李林康',
    区域: '山东',
    是否参与考核: '是',
    用户名: 'sd_lilinkang',
    密码: 'llk82553925'
  },
  {
    姓名: '杨少晨',
    区域: '山东',
    是否参与考核: '是',
    用户名: 'sd_yangshaochen',
    密码: 'ysc68339534'
  },
  {
    姓名: '陶德森',
    区域: '湖北',
    是否参与考核: '是',
    用户名: 'hb_taodesen',
    密码: 'tds25383651'
  },
  {
    姓名: '张进',
    区域: '湖北',
    是否参与考核: '是',
    用户名: 'hb_zhangjin',
    密码: 'zj46810656'
  },
  {
    姓名: '徐梦玲',
    区域: '湖北',
    是否参与考核: '是',
    用户名: 'hb_xumengling',
    密码: 'xml13300525'
  },
  {
    姓名: '陈昌',
    区域: '湖北',
    是否参与考核: '是',
    用户名: 'hb_chenchang',
    密码: 'cc62313031'
  },
  {
    姓名: '黄念慈',
    区域: '湖北',
    是否参与考核: '是',
    用户名: 'hb_huangnianci',
    密码: 'hnc27724119'
  },
  {
    姓名: '张寒',
    区域: '湖北',
    是否参与考核: '是',
    用户名: 'hb_zhanghan',
    密码: 'zh73724147'
  },
  {
    姓名: '曹超',
    区域: '湖北',
    是否参与考核: '是',
    用户名: 'hb_caochao',
    密码: 'cc43774632'
  },
  {
    姓名: '徐巍',
    区域: '湖北',
    是否参与考核: '是',
    用户名: 'hb_xuwei',
    密码: 'xw89909381'
  },
  {
    姓名: '马晨',
    区域: '湖北',
    是否参与考核: '是',
    用户名: 'hb_machen',
    密码: 'mc80645193'
  },
  {
    姓名: '昌志龙',
    区域: '湖北',
    是否参与考核: '是',
    用户名: 'hb_changzhilong',
    密码: 'czl60409121'
  },
  {
    姓名: '肖悦',
    区域: '湖北',
    是否参与考核: '是',
    用户名: 'hb_xiaoyue',
    密码: 'xy41942482'
  },
  {
    姓名: '黄卓',
    区域: '湖北',
    是否参与考核: '是',
    用户名: 'hb_huangzhuo',
    密码: 'hz91262749'
  },
  {
    姓名: '单张宇',
    区域: '湖北',
    是否参与考核: '是',
    用户名: 'hb_danzhangyu',
    密码: 'dzy60813539'
  },
  {
    姓名: '刘红凯',
    区域: '湖北',
    是否参与考核: '是',
    用户名: 'hb_liuhongkai',
    密码: 'lhk13192745'
  },
  {
    姓名: '谢振威',
    区域: '湖北',
    是否参与考核: '是',
    用户名: 'hb_xiezhenwei',
    密码: 'xzw21012994'
  },
  {
    姓名: '胡兴飞',
    区域: '江苏',
    是否参与考核: '是',
    用户名: 'js_huxingfei',
    密码: 'hxf52483770'
  },
  {
    姓名: '闫兵',
    区域: '江苏',
    是否参与考核: '是',
    用户名: 'js_yanbing',
    密码: 'yb56687612'
  },
  {
    姓名: '杨亮',
    区域: '江苏',
    是否参与考核: '是',
    用户名: 'js_yangliang',
    密码: 'yl52353373'
  },
  {
    姓名: '吴宏峰',
    区域: '江苏',
    是否参与考核: '是',
    用户名: 'js_wuhongfeng',
    密码: 'whf66079040'
  },
  {
    姓名: '杜卿',
    区域: '江苏',
    是否参与考核: '是',
    用户名: 'js_duqing',
    密码: 'dq44641883'
  },
  {
    姓名: '李俊',
    区域: '江苏',
    是否参与考核: '是',
    用户名: 'js_lijun',
    密码: 'lj89393270'
  },
  {
    姓名: '王安乐',
    区域: '江苏',
    是否参与考核: '是',
    用户名: 'js_wanganle',
    密码: 'wal97700525'
  },
  {
    姓名: '邱海波',
    区域: '新疆',
    是否参与考核: '是',
    用户名: 'xj_qiuhaibo',
    密码: 'qhb61917615'
  },
  {
    姓名: '刘路杨',
    区域: '新疆',
    是否参与考核: '是',
    用户名: 'xj_liuluyang',
    密码: 'lly57306591'
  },
  {
    姓名: '王玉春',
    区域: '新疆',
    是否参与考核: '是',
    用户名: 'xj_wangyuchun',
    密码: 'wyc30930609'
  },
  {
    姓名: '楚金',
    区域: '新疆',
    是否参与考核: '是',
    用户名: 'xj_chujin',
    密码: 'cj86014129'
  },
  {
    姓名: '卫俊南',
    区域: '新疆',
    是否参与考核: '是',
    用户名: 'xj_weijunnan',
    密码: 'wjn71584155'
  },
  {
    姓名: '李昊晗',
    区域: '陕甘',
    是否参与考核: '是',
    用户名: 'sg_lihaohan',
    密码: 'lhh42011029'
  },
  {
    姓名: '黄杰',
    区域: '陕甘',
    是否参与考核: '是',
    用户名: 'sg_huangjie',
    密码: 'hj83531087'
  },
  {
    姓名: '方任峰',
    区域: '陕甘',
    是否参与考核: '是',
    用户名: 'sg_fangrenfeng',
    密码: 'frf71417405'
  },
  {
    姓名: '李康磊',
    区域: '陕甘',
    是否参与考核: '是',
    用户名: 'sg_likanglei',
    密码: 'lkl63270150'
  },
  {
    姓名: '李思鑫',
    区域: '陕甘',
    是否参与考核: '是',
    用户名: 'sg_lisixin',
    密码: 'lsx62543807'
  },
  {
    姓名: '易思伟',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_yisiwei',
    密码: 'ysw29164878'
  },
  {
    姓名: '王祥宇',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_wangxiangyu',
    密码: 'wxy61225827'
  },
  {
    姓名: '陈灿',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_chencan',
    密码: 'cc85292476'
  },
  {
    姓名: '林广东',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_linguangdong',
    密码: 'lgd16120493'
  },
  {
    姓名: '赵杰',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_zhaojie',
    密码: 'zj84200706'
  },
  {
    姓名: '李俊男',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_lijunnan',
    密码: 'ljn66482626'
  },
  {
    姓名: '陈子妍',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_chenziyan',
    密码: 'czy27758468'
  },
  {
    姓名: '林月忠',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_linyuezhong',
    密码: 'lyz73960719'
  },
  {
    姓名: '吴锡涛',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_wuxitao',
    密码: 'wxt77531084'
  },
  {
    姓名: '罗洋',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_luoyang',
    密码: 'ly62614929'
  },
  {
    姓名: '胡思敏',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_husimin',
    密码: 'hsm34774760'
  },
  {
    姓名: '邓志阳',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_dengzhiyang',
    密码: 'dzy85844373'
  },
  {
    姓名: '张嘉欣',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_zhangjiaxin',
    密码: 'zjx30353199'
  },
  {
    姓名: '庄巨腾',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_zhuangjuteng',
    密码: 'zjt70066603'
  },
  {
    姓名: '陈春燕',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_chenchunyan',
    密码: 'ccy22597677'
  },
  {
    姓名: '陈健东',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_chenjiandong',
    密码: 'cjd73343490'
  },
  {
    姓名: '张凯亮',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_zhangkailiang',
    密码: 'zkl58612743'
  },
  {
    姓名: '刘展洋',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_liuzhanyang',
    密码: 'lzy25002057'
  },
  {
    姓名: '邱哲宏',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_qiuzhehong',
    密码: 'qzh39857041'
  },
  {
    姓名: '葵南辉',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_kuinanhui',
    密码: 'knh33264678'
  },
  {
    姓名: '邹渊',
    区域: '华南',
    是否参与考核: '是',
    用户名: 'hn_zouyuan',
    密码: 'zy83194380'
  },
  {
    姓名: '石教帅',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_shijiaoshuai',
    密码: 'sjs64446386'
  },
  {
    姓名: '伍天坪',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_wutianping',
    密码: 'wtp15108978'
  },
  {
    姓名: '黎浩江',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_lihaojiang',
    密码: 'lhj41470302'
  },
  {
    姓名: '刘文婧',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_liuwenjing',
    密码: 'lwj23801064'
  },
  {
    姓名: '王腾龙',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_wangtenglong',
    密码: 'wtl68958396'
  },
  {
    姓名: '陈琳雪',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_chenlinxue',
    密码: 'clx84698859'
  },
  {
    姓名: '唐晓航',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_tangxiaohang',
    密码: 'txh90507797'
  },
  {
    姓名: '刘肖',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_liuxiao',
    密码: 'lx70872911'
  },
  {
    姓名: '温海峰',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_wenhaifeng',
    密码: 'whf29655168'
  },
  {
    姓名: '王浩亮',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_wanghaoliang',
    密码: 'whl36707879'
  },
  {
    姓名: '彭誉',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_pengyu',
    密码: 'py60332563'
  },
  {
    姓名: '罗智涛',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_luozhitao',
    密码: 'lzt12338261'
  },
  {
    姓名: '白文慧',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_baiwenhui',
    密码: 'bwh37962080'
  },
  {
    姓名: '赵金科',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_zhaojinke',
    密码: 'zjk19502426'
  },
  {
    姓名: '刘牵鹤',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_liuqianhe',
    密码: 'lqh19039594'
  },
  {
    姓名: '周雪涛',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_zhouxuetao',
    密码: 'zxt71492223'
  },
  {
    姓名: '李欣',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_lixin',
    密码: 'lx98675088'
  },
  {
    姓名: '王邵杰',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_wangshaojie',
    密码: 'wsj80346162'
  },
  {
    姓名: '刘岗强',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_liugangqiang',
    密码: 'lgq46745215'
  },
  {
    姓名: '王泽',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_wangze',
    密码: 'wz83057294'
  },
  {
    姓名: '陈轩',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_chenxuan',
    密码: 'cx38200906'
  },
  {
    姓名: '王鹏飞',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_wangpengfei',
    密码: 'wpf26968916'
  },
  {
    姓名: '贺天昊',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_hetianhao',
    密码: 'hth41264731'
  },
  {
    姓名: '罗少凯',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_luoshaokai',
    密码: 'lsk37703444'
  },
  {
    姓名: '李进超',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_lijinchao',
    密码: 'ljc19530532'
  },
  {
    姓名: '陈玉奇',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_chenyuqi',
    密码: 'cyq69131754'
  },
  {
    姓名: '王大龙',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_wangdalong',
    密码: 'wdl64333949'
  },
  {
    姓名: '陈子萱',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_chenzixuan',
    密码: 'czx74138714'
  },
  {
    姓名: '曾杰',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_zengjie',
    密码: 'zj38420530'
  },
  {
    姓名: '张傲伟',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_zhangaowei',
    密码: 'zaw36371958'
  },
  {
    姓名: '袁华苹',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_yuanhuaping',
    密码: 'yhp83882914'
  },
  {
    姓名: '董槟瑞',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_dongbinrui',
    密码: 'dbr25606848'
  },
  {
    姓名: '叶梓',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_yezi',
    密码: 'yz97887256'
  },
  {
    姓名: '刘冬',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_liudong',
    密码: 'ld39557315'
  },
  {
    姓名: '陈春亮',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_chenchunliang',
    密码: 'ccl61062470'
  },
  {
    姓名: '彭益',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_pengyi',
    密码: 'py41453220'
  },
  {
    姓名: '曾智校',
    区域: '华东',
    是否参与考核: '是',
    用户名: 'hd_zengzhixiao',
    密码: 'zzx26419409'
  },
  {
    姓名: '罗威',
    区域: '江西',
    是否参与考核: '是',
    用户名: 'jx_luowei',
    密码: 'lw80111052'
  },
  {
    姓名: '何文强',
    区域: '江西',
    是否参与考核: '是',
    用户名: 'jx_hewenqiang',
    密码: 'hwq52458977'
  },
  {
    姓名: '涂欣玲',
    区域: '江西',
    是否参与考核: '是',
    用户名: 'jx_tuxinling',
    密码: 'txl32016263'
  },
  {
    姓名: '李玲',
    区域: '江西',
    是否参与考核: '是',
    用户名: 'jx_liling',
    密码: 'll44317685'
  },
  {
    姓名: '祝星辰',
    区域: '江西',
    是否参与考核: '是',
    用户名: 'jx_zhuxingchen',
    密码: 'zxc36222327'
  },
  {
    姓名: '程鹏宇',
    区域: '江西',
    是否参与考核: '是',
    用户名: 'jx_chengpengyu',
    密码: 'cpy11908874'
  },
  {
    姓名: '何俊良',
    区域: '江西',
    是否参与考核: '是',
    用户名: 'jx_hejunliang',
    密码: 'hjl40645074'
  },
  {
    姓名: '章敏聪',
    区域: '江西',
    是否参与考核: '是',
    用户名: 'jx_zhangmincong',
    密码: 'zmc59729773'
  },
  {
    姓名: '邹国雄',
    区域: '江西',
    是否参与考核: '是',
    用户名: 'jx_zouguoxiong',
    密码: 'zgx14294590'
  },
  {
    姓名: '焦佳阳',
    区域: '江西',
    是否参与考核: '是',
    用户名: 'jx_jiaojiayang',
    密码: 'jjy58686696'
  },
  {
    姓名: '罗恒丰',
    区域: '江西',
    是否参与考核: '是',
    用户名: 'jx_luohengfeng',
    密码: 'lhf45206577'
  },
  {
    姓名: '周瑜',
    区域: '江西',
    是否参与考核: '是',
    用户名: 'jx_zhouyu',
    密码: 'zy88530393'
  },
  {
    姓名: '程添星',
    区域: '江西',
    是否参与考核: '是',
    用户名: 'jx_chengtianxing',
    密码: 'ctx41892257'
  },
  {
    姓名: '李云辉',
    区域: '江西',
    是否参与考核: '是',
    用户名: 'jx_liyunhui',
    密码: 'lyh76286506'
  },
  {
    姓名: '刘源',
    区域: '江西',
    是否参与考核: '是',
    用户名: 'jx_liuyuan',
    密码: 'ly49574948'
  }
]

let b = {}
let l = {}
let n = {}
aaa.map(item => {
  b[item.用户名] = `base64.encode(base64.encode(${item.密码}))`
  l[item.用户名] = 'local'
  n[item.用户名] = item.姓名
})
console.log(n)