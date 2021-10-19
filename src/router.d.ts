import 'vue-router'

declare module 'vue-router' {
    // eslint-disable-next-line no-unused-vars
    interface RouteMeta {
        title?: String,
        // 要求登录?
        requiresAuth?: boolean,
        icon?: String,
        iconLight?: string
    }
}
