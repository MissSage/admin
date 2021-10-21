import 'vue-router'

declare module 'vue-router' {
    // eslint-disable-next-line no-unused-vars
    interface RouteMeta {
        title?: String, // 标题
        requiresAuth?: boolean, // 授权控制
        icon?: String, // 图标
        iconLight?: string, // 高亮图标，其实也可以通过颜色来控制，因为使用的是fontclass
        hidden?:boolean // 控制目录显隐
    }
}
