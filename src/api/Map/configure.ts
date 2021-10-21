import { IGisResource, Iinitextent } from '../types/Map'

// 获得当前根目录
const root = location.href.replace(/\/+$/, '')

const AppX = {
  // 当前 url 中的根目录
  //  比如 localhost:3000/WebAppFrame
  root: root,
  // 应用配置
  //  此配置为应用中 [只读] 的属性项
  //  和下面 runtimeConfig 不同的是,runtimeConfig中的内容是运行过程中逐步构建起来的
  appConfig: {
    theme: {
      name: 'FoldableTheme',
      styles: [],
      customStyles: []
    },
    title: '城市供水GIS系统',
    subtitle: 'A configurable web application',
    version: '1.0.6', // 主版本号.分子版本号.小版本号.日期版本号_阶段标识
    debug: false, // 标记当前程序状态，当时bug版本时从本地加载配置
    comment: {
      geometryService: ''
    },
    mainContainer: '#mainContainer',
    initextent: {} as Iinitextent, // 地图初始范围
    apiroot: 'http://192.168.2.140/webapi/api',
    xjapiroot: 'http://192.168.2.140:8004/xjapi/api',
    yxapiroot: 'http://192.168.2.140:8004/misapi/', // 营销系统IP地址
    usertoken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJVc2VySUQiOiI0MTk4NjcyMEMxMEYiLCJVU0VSTkFNRSI6IndqIiwiUkVBTE5BTUUiOiJCU-W8gOWPkea1i-ivleeUqOaItzEiLCJXS0lEIjo0NDkwLCJSQU5HRSI6IjAwMDIiLCJSQU5HRUZJRUxEIjoiTUFOQUdFREVQVF9DT0RFIiwiQ09OTkVDVFNUUiI6IkRBVEFCQVNFPUNRUlE7TkVUTkFNRT0xOTIuMTY4LjEuMTA0L0NRUlE7U0VSVkVSPTE5Mi4xNjguMS4xMDQ7VVNFUklEPWdhc2RhdGFfY3FycTtQQVNTV09SRD1nYXNkYXRhX2NxcnE7UE9SVD0xNTIxQDUxNTEvdGNwO1ZFUlNJT049c2RlLkRFRkFVTFQiLCJCb3JuVGltZSI6MCwiQXBwSUQiOiIzNkExQTIzN0VBNzcifQ.631wJMry28U_OZCijVPXvaG8PDOf8eU4bbSgs3eePeIu39CFa1X_AIkAqqcuvgUgyWbPB49OzUQBYndS98OHKA',
    xjxj: '58E9A0EF2ADE4809A742FD86220090EA',
    range: '',
    groupid: '',
    groupname: '',
    departmentid: '',
    departmentname: '',
    realname: '',
    userid: '',
    loadOnStartWidgets: [
      {
        subsys: 'gis',
        name: 'Loading',
        discription: '加载动画',
        url: 'widgets/Loading',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'EndLoading',
        discription: '结束加载动画',
        url: 'widgets/EndLoading',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'MenuBar',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'Header',
        discription: '系统头部',
        url: 'widgets/Header',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'EndLoading',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'BaseWidget',
        discription: '基础地图',
        url: 'widgets/BaseMap',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'Loading',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'Scalebar',
        discription: '比例尺',
        url: 'widgets/Scalebar',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseWidget',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'Coordinate',
        discription: '坐标',
        url: 'widgets/Coordinate',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseWidget',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'Navigation',
        discription: '导航',
        url: 'widgets/Navigation',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseWidget',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'Home',
        discription: 'Home',
        url: 'widgets/Home',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseWidget',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'OverViewMap',
        discription: '鹰眼',
        url: 'widgets/OverViewMap',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseWidget',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'Toast',
        discription: '提示',
        url: 'widgets/Toast',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseWidget',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'Popup',
        discription: '弹出框',
        url: 'widgets/Popup',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseWidget',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'LoadMask',
        discription: '加载遮罩',
        url: 'widgets/LoadMask',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseWidget',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'Search',
        discription: '搜索',
        url: 'widgets/Search',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseMap',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'SideMenu',
        discription: '侧边菜单',
        url: 'widgets/SideMenu',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseWidget',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'DataPanel',
        discription: '数据面板',
        url: 'widgets/DataPanel',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseMap',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'Refresh',
        discription: '地图刷新',
        url: 'widgets/Refresh',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseMap',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'shuxingbiaozhu',
        discription: '属性标注工具',
        url: 'widgets/AttributeAnnotationTool',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseMap',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'xianshituli',
        discription: '显示图例',
        url: 'widgets/LegendTyleDisplayTool',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseMap',
        optional: false
      },
      {
        subsys: 'gis',
        nameid: 'xianshituli',
        discription: '图例集合',
        url: 'widgets/LegendTyleDisplay',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseMap',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'tucengkongzhigongju',
        discription: '图层控制工具',
        url: 'widgets/LayerListTool',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseMap',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'MeasureToolHotkey',
        discription: '测量快捷工具',
        url: 'widgets/MeasureToolHotkey',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseMap',
        optional: false
      },
      {
        subsys: 'gis,xunjian',
        name: 'version',
        discription: '系统信息',
        url: 'widgets/Version',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseMap',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'fieldconfig',
        discription: '字段配置',
        url: 'widgets/FieldConfig',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseMap',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'LoadWait',
        discription: '加载进度',
        url: 'widgets/LoadWait',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseWidget',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'zoombar',
        discription: '拉框缩放',
        url: 'widgets/ZoomBar',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseMap',
        optional: false
      },
      {
        subsys: 'gis',
        name: 'autorunadaptor',
        discription: '模块自动运行适配器',
        url: 'widgets/AutoRunAdaptor',
        main: 'Widget',
        configPath: '',
        templatePath: '',
        depend: 'BaseMap',
        optional: false
      }
    ],
    menuBarWidgets: [
      {
        id: 'tongyonggongju',
        label: '通用工具',
        icon: '/images/tongyonggongju.png',
        data: [
          {
            subsys: 'gis',
            id: 'tucengkongzhi',
            label: '图层控制',
            widget: 'widgets/LayerList',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'gongzuokongjian',
            label: '工作空间',
            widget: 'widgets/WorkSpace',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'liangcegongju',
            label: '量测工具',
            widget: 'widgets/MeasureTool',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'magnifier',
            label: '放大镜',
            widget: 'widgets/Magnifier',
            main: 'Widget',
            icon: '/images/choose.png',
            panel: 'Panel',
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'fenpingxianshi',
            label: '分屏显示',
            widget: 'widgets/DoubleScreen',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'shuxingbiaozhu',
            label: '属性标注',
            widget: 'widgets/AttributeAnnotation',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'zhuantituxianshi',
            label: '专题图显示',
            widget: 'widgets/ThematicMap',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'zhitudaying',
            label: '制图打印',
            widget: 'widgets/Printing',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'mobandaying',
            label: '模板打印',
            widget: 'widgets/TemplatePrint',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'yiwenbiaozhi',
            label: '疑问标识',
            widget: 'widgets/QuestionMark',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          }
        ]
      },
      {
        id: 'guanwangchaxun',
        label: '管网查询',
        icon: '/images/guanwangchaxun.png',
        data: [
          {
            subsys: 'gis',
            id: 'sqlchaxun',
            label: 'SQL查询',
            widget: 'widgets/SqlQuery',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'dianhaochaxun',
            label: '按点号查询',
            widget: 'widgets/DianhaoQuery',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'tufuhaochaxun',
            label: '按图幅号查询',
            widget: 'widgets/TufuhaoQuery',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'adresschaxun',
            label: '设备地址查询',
            widget: 'widgets/AdressQuery',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'caizhichaxun',
            label: '按材质查询',
            widget: 'widgets/MaterialQuery',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'guanjingchaxun',
            label: '按管径查询',
            widget: 'widgets/GuanjingQuery',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'jungongchaxun',
            label: '按竣工时间查询',
            widget: 'widgets/FinishDateQuery',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          }
        ]
      },
      {
        id: 'guanwangtongji',
        label: '管网统计',
        icon: '/images/guanwangtongji.png',
        data: [
          {
            subsys: 'gis',
            id: 'changdutongji',
            label: '长度统计',
            widget: 'widgets/LengthStatistics',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'shuliangtongji',
            label: '数量统计',
            widget: 'widgets/CountStatistics',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            panel: 'Panel',
            autorun: false
          }
        ]
      },
      {
        id: 'guanwangfenxi',
        label: '管网分析',
        icon: '/images/guanwangfenxi.png',
        data: [
          {
            subsys: 'gis',
            id: 'baoguanfenxi',
            label: '爆管分析',
            widget: 'widgets/BurstAnalysis',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'liantongxingfenxi',
            label: '连通性分析',
            widget: 'widgets/ConnectedAnalysis',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'huanchongqufenxi',
            label: '缓冲区分析',
            widget: 'widgets/BufferAnalysis',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'hengpoumianfenxi',
            label: '横剖面分析',
            widget: 'widgets/AcrossSectionAnalysis',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'zongpoumianfenxi',
            label: '纵剖面分析',
            widget: 'widgets/VerticalSectionAnalysis',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'tingyongqifenxi',
            label: '关阀分析',
            widget: 'widgets/ShutValveAnalysis',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            autorun: false
          },
          {
            subsys: 'gis',
            id: 'zuiduanlujingfenxi',
            label: '最短路径分析',
            widget: 'widgets/PathAnalysis',
            main: 'Widget',
            icon: '/images/choose.png',
            inPanel: true,
            autorun: false
          }
        ]
      }
    ],
    gisResource: {
      raster: {
        name: '影像',
        groupname: '影像服务',
        type: 'tiled',
        config: [
          {
            groupname: '影像服务',
            name: '影像服务',
            url: 'http://192.168.2.103:6080/arcgis/rest/services/deyang/PIPE_QY_DEYANG_DYNAMIC/MapServer'
          }
        ]
      },
      terrain: {
        name: '地形',
        groupname: '地形服务',
        type: 'tiled',
        config: [
          {
            groupname: '地形服务',
            name: '地形服务',
            // "url": "http://192.168.2.103:6080/arcgis/rest/services/deyang/DXT_QY_DEYANG/MapServer"
            url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
          }
        ]
      },
      poi: {
        name: '注记名',
        groupname: 'POI服务',
        type: 'tiled',
        config: [
          {
            groupname: 'POI服务',
            name: 'POI服务',
            url: 'http://192.168.2.103:6080/arcgis/rest/services/deyang/POI_QY_DEYANG/MapServer'
          }
        ]
      },
      grid: {
        name: '网格',
        groupname: '网格服务',
        type: 'dynamic',
        config: [
          {
            groupname: '网格服务',
            name: '网格服务',
            url: 'http://192.168.2.104:6080/arcgis/rest/services/nanbu/BEIJING_GRID/MapServer'
          }
        ]
      },
      privateterrain: {
        name: '专用地形',
        groupname: '专用地形服务',
        type: 'tiled',
        config: [
          {
            groupname: '专用地形服务',
            name: '专用地形服务',
            // "url": "http://192.168.2.103:6080/arcgis/rest/services/deyang/DXT_QY_DEYANG/MapServer"
            url: 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer'
          }
        ]
      },
      pipe: {
        name: '管线地图',
        groupname: '管线服务',
        type: 'tiled',
        config: [
          {
            groupname: '管线服务',
            name: '管线服务',
            url: 'http://192.168.2.103:6080/arcgis/rest/services/deyang/PIPE_QY_DEYANG/MapServer'
          }
        ]
      },
      zhuantitu: {
        name: '专题图服务',
        groupname: '专题图服务',
        type: 'tiled',
        config: [
          {
            groupname: '专题图服务',
            name: '专题图服务',
            url: 'http://192.168.2.103:6080/arcgis/rest/services/deyang/PIPE_QY_DEYANG_DYNAMIC/MapServer'
          }
        ]
      },
      scada: {
        name: 'SCADA监控',
        groupname: 'SCADA监控服务',
        type: 'dynamic',
        config: []
      },
      geometry: {
        name: '几何服务',
        groupname: '几何服务',
        type: '',
        config: [
          {
            groupname: '几何服务',
            name: '通用几何服务',
            url: 'http://192.168.2.103:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer'
          }
        ]
      },
      apiburstpipe: {
        name: '爆管分析服务',
        groupname: '爆管服务',
        type: '',
        config: [
          {
            groupname: '爆管服务',
            name: '爆管服务',
            // "url": "http://192.168.2.104:6080/arcgis/rest/services/cqgas/PathAnalyze1/GPServer/BurstPipeAnalyze"
            url: 'http://192.168.2.103:6080/arcgis/rest/services/nanbu/tftoolsnanbu/GPServer/BurstPipeAnalyzenanbu'
          }
        ]
      },
      apiconnectedpipe: {
        name: '连通性分析服务',
        groupname: '连通性服务',
        type: '',
        config: [
          {
            groupname: '连通性服务',
            name: '连通性服务',
            url: 'http://192.168.2.104:6080/arcgis/rest/services/cqgas/PathAnalyze1/GPServer/ConnectedAnalyze'
          }
        ]
      },
      apishutvalve: {
        name: '关阀分析服务',
        groupname: '关阀服务',
        type: '',
        config: [
          {
            groupname: '关阀服务',
            name: '关阀服务',
            // "url": "http://192.168.2.104:6080/arcgis/rest/services/cqgas/PathAnalyze1/GPServer/ConnectedAnalyze"
            url: 'http://192.168.2.103:6080/arcgis/rest/services/km/tftoolskm/GPServer/ShutOffValveAnalyzebinzhou'
          }
        ]
      },
      apiextentvalve: {
        name: '扩展关阀分析服务',
        groupname: '扩展关阀服务',
        type: '',
        config: [
          {
            groupname: '扩展关阀服务',
            name: '扩展关阀服务',
            // "url": "http://192.168.2.104:6080/arcgis/rest/services/cqgas/PathAnalyze1/GPServer/ConnectedAnalyze"
            url: 'http://192.168.2.103:6080/arcgis/rest/services/km/tftoolskm/GPServer/ShutOffValveExtendbinzhou'
          }
        ]
      },
      apipipepath: {
        name: '路径分析服务',
        groupname: '路径服务',
        type: '',
        config: [
          {
            groupname: '路径服务',
            name: '路径服务',
            url: 'http://192.168.2.104:6080/arcgis/rest/services/cqgas/PathAnalyze1/GPServer/PathAnalyze'
          }
        ]
      },
      apiscada: {
        name: 'SCADA数据接口',
        groupname: 'SCADA数据接口',
        type: '',
        config: []
      },
      vectorprint: {
        name: '矢量打印服务',
        groupname: '矢量打印服务',
        type: '',
        config: [
          {
            groupname: '矢量打印服务',
            name: '矢量打印服务',
            url: 'http://192.168.2.104:6080/arcgis/rest/services/GP_Print/GPServer/TFPrint'
          }
        ]
      },
      rasterprint: {
        name: '栅格打印服务',
        groupname: '栅格打印服务',
        type: '',
        config: [
          {
            groupname: '栅格打印服务',
            name: '栅格打印',
            url: 'http://192.168.2.104:6080/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task'
          }
        ]
      },
      printtemplatepath: {
        name: '打印模板路径',
        groupname: '打印模板路径',
        type: '',
        config: [
          {
            groupname: '打印模板路径',
            name: '重燃打印模板目录',
            url: 'C:/work_cqrq/jiangbei'
          }
        ]
      },
      xzqmap: {
        name: '行政区划',
        groupname: '行政区划服务',
        type: '',
        config: [
          {
            groupname: '行政区划服务',
            name: '重庆行政区划',
            url: 'http://192.168.1.101:6080/arcgis/rest/services/test/QUHUA_CQ_DYNAMIC/MapServer'
          }
        ]
      },
      fangdamap: {
        name: '放大镜管线服务',
        groupname: '放大镜管线服务',
        type: '',
        config: [
          {
            groupname: '放大镜管线服务',
            name: '放大镜管线服务',
            url: 'http://192.168.2.103:6080/arcgis/rest/services/deyang/PIPE_QY_DEYANG_FANGDA/MapServer'
          }
        ]
      },
      pipedata: {
        name: '管线业务服务',
        groupname: '管线业务服务',
        type: '',
        config: [
          {
            groupname: '管线业务服务',
            name: '管线业务服务',
            url: 'http://192.168.2.103:6080/arcgis/rest/services/deyang/PIPE_QY_DEYANG_DYNAMIC/MapServer'
          }
        ]
      },
      region_map: {
        name: '巡检片区服务',
        groupname: '巡检片区服务',
        type: '',
        config: [
          {
            groupname: '巡检片区服务',
            name: '巡检片区服务',
            url: 'http://192.98.151.20/cqgas/rest/services/CHONGRAN/XJAREA_QY_CHONGRAN/MapServer'
          }
        ]
      },
      fswmap: {
        name: '附属物服务',
        groupname: '附属物服务',
        type: 'dynamic',
        filter: true, // 是否进行管理单位的过滤
        config: [
          {
            groupname: '附属物服务',
            name: '重燃附属物',
            url: 'http://192.98.151.20/cqgas/rest/services/CHONGRAN/FSW_QY_CHONGRAN/MapServer'
          }
        ]
      },
      optionmap: {
        name: '可选附属服务',
        groupname: '可选附属服务',
        type: 'tiled',
        filter: false, // 是否进行管理单位的过滤
        config: [
          {
            groupname: '可选附属服务',
            name: '消防栓',
            url: 'http://192.98.151.20/cqgas/rest/services/CHONGRAN/FSW_QY_CHONGRAN/MapServer'
          }
        ]
      }
    } as IGisResource
  },

  // 运行时配置
  //  用于存放运行时建立的全局变量、全局对象等
  runtimeConfig: {
    map: null,
    toast: null,
    popup: null,
    photoWall: null,
    SideMenu: null,
    dataPanel: null,
    loadMask: null,
    fieldConfig: null,
    unit: null,
    loadWait: null
  },

  // dojo 配置
  //  用于存放 Dojo 相关的配置项
  dojoConfig: {
    packages: [
      {
        name: 'root',
        location: root
      },
      {
        name: 'core',
        location: root + '/core'
      },
      {
        name: 'widgets',
        location: root + '/widgets'
      }
    ]
  }
}
export default AppX
