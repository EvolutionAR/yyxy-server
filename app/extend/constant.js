const DATA_TYPES = {
  default: 'static',
  types: [
    'static',
    'csv_file',
    'api',
    'mysql',
    'excel',
    'dmc_normal_table',
    'dmc_flow_table',
    'oracle',
    'sql_server',
    'api_gateway',
    'elastic_search',
    'dmc',
    'json',
    'inherit',
    'postgresql',
    'websocket',
    'mongodb',
    'dashboard'
  ]
}

// 自定义返回错误码
const ERROR_CODES = {
  LOGIN_FAILURE: 11,
  PARAMETER_IS_REQUIRED: 12,
  COOKIE_DESIRE: 401,
  // 避开4xx和5xx，留给网络异常
  // DATABASE
  DATABASE_CONNECT_ERROR: 601,
  SQL_ERROR: 602,
  PARAMS_FORMAT_ERROR: 603,
  FILE_NOT_EXIST: 701,
  COMPONENT_NOT_EXIST: 702,
  DATASTORAGE_NOT_EXIST: 703,
  WORKSPACE_NOT_EXIST: 704,
  FIELD_NOT_EXIST: 705,
  FIELD_NAME_REPEAT: 750,
  FIELD_HAS_DEPENDENCE: 750,
  COMPONENT_HAS_NO_SUCH_DATASOURCE: 801
}

const ORACLE_TYPES = {
  NUMBER_TYPE: [
    'TINYINT',
    'SMALLINT',
    'MEDIUMINT',
    'INT',
    'NUMBER',
    'INTEGER',
    'LONG',
    'FLOAT',
    'DOUBLE',
    'DECIMAL',
    'REAL'
  ],
  STRING_TYPE: [
    'CHAR',
    'VARCHAR2',
    'NCHAR',
    'NVARCHAR2',
    'BLOB',
    'CLOB',
    'NCLOB',
    'MEDIUMTEX',
    'LONGBLOB',
    'LONGTEXT'
  ],
  DATE_TYPE: ['DATE', 'TIME', 'YEAR', 'DATETIME', 'TIMESTAMP']
}

const MYSQL_TYPES = {
  NUMBER_TYPE: [
    'TINYINT',
    'SMALLINT',
    'MEDIUMINT',
    'INT',
    'INTEGER',
    'BIGINT',
    'FLOAT',
    'DOUBLE',
    'DECIMAL'
  ],
  STRING_TYPE: [
    'CHAR',
    'VARCHAR',
    'TINYBLOB',
    'TINYTEXT',
    'BLOB',
    'TEXT',
    'MEDIUMBLO',
    'MEDIUMTEX',
    'LONGBLOB',
    'LONGTEXT'
  ],
  DATE_TYPE: ['DATE', 'TIME', 'YEAR', 'DATETIME', 'TIMESTAMP']
}

const PG_TYPES = {
  NUMBER_TYPE: [
    'TINYINT',
    'SMALLINT',
    'MEDIUMINT',
    'INT',
    'INTEGER',
    'BIGINT',
    'DOUBLE PRECISION',
    'FLOAT',
    'DOUBLE',
    'DECIMAL'
  ],

  STRING_TYPE: [
    'CHAR',
    'VARCHAR',
    'TINYBLOB',
    'TINYTEXT',
    'BLOB',
    'TEXT',
    'MEDIUMBLO',
    'MEDIUMTEX',
    'LONGBLOB',
    'LONGTEXT',
    'VARCHAR(n)',
    'CHARACTER VARYING(n)',
    'CHARACTER VARYING'
  ],
  DATE_TYPE: ['DATE', 'TIME', 'YEAR', 'DATETIME', 'TIMESTAMP']
}

const EXPORT_COMTYPE = {
  COMTYPE: [
    'interaction-container-dynamicpanel',
    // 'interaction-container-referpanel',   // 导出的时候不导出引用面板
    'interaction-container-loop-pitch',
    'interaction-container-roll-pitch',
    'interaction-container-carousepanel',
    'interaction-container-list-pitch',
    'interaction-container-newdynamicpanel'
  ],
  // 复制时需要复制大屏的组件
  COPYCOMTYPE: [
    'interaction-container-dynamicpanel',
    'interaction-container-loop-pitch',
    'interaction-container-roll-pitch',
    'interaction-container-carousepanel',
    'interaction-container-list-pitch',
    'interaction-container-newdynamicpanel'
  ]
}
const DASHBOARD_CODES = {
  C200: 'data-set-table', // 普通表格
  C230: 'regular-pie-normal', //普通饼图
  C220: 'regular-line-normal', //普通折线图
  C210: 'regular-bar-normal', //普通柱状图
  C320: 'regular-bar-falls', //瀑布图
  C240: 'regular-bar-normalHor', //水平柱状图
  C350: 'regular-line-area', //基本面积图
  C280: 'regular-scatter-normal', // 基本散点图
  C290: 'regular-other-radar', // 基本雷达图
  C390: 'regular-pie-rose', //玫瑰图
  C211: 'regular-bar-stack', // 堆叠柱状图
  C241: 'regular-bar-stackHor', // 堆叠水平柱状图
  C351: 'regular-line-stackArea', // 堆叠面试图
  C330: 'regular-other-funnel' // 漏洞图
}
const INTEGER_TYPE = [
  'byte',
  'tinyint',
  'short',
  'smallint',
  'int',
  'integer',
  'long',
  'bigint'
]

const FLOAT_TYPE = ['float', 'real', 'double', 'decimal', 'dec', 'numeric']

module.exports = {
  DATA_TYPES,
  ERROR_CODES,
  ORACLE_TYPES,
  MYSQL_TYPES,
  PG_TYPES,
  EXPORT_COMTYPE,
  DASHBOARD_CODES,
  INTEGER_TYPE,
  FLOAT_TYPE
}
