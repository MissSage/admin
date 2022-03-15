interface AOUCloumn {
    type: string
    label: string
    key: string
    rules?: any[]
    disabled?: boolean
    options?: SelectOption[]
    aInfo?: boolean
    search?: boolean
    unit?: string
    multiple?: boolean
    rows?: number | string
    message?: string
    messageStyle?: {
        [propName: string]: string
    }
    allowCreate?: boolean = false
    replaceKey?: string
    multipleLimit?: number
    defaultFirst?: boolean
    handleChange?: (val: any) => void
    // 文件上传路径
    fileActionUrl?: string
    // 图片上传路径
    imgActionUrl?: string,
    value?: tree[],
    props?: any
}

interface AOUConfig {
    visible: boolean
    title: string
    labelWidth?: string
    setSubmitParams?: (params: any) => any
    close: () => void
    open?: () => void
    disableSubmit?: boolean
    submit?: (params: any) => AxiosPromise<any>
    baseUrl?: string // 用于其它域的接口请求
    requestHeaders?: { [propName: string]: string }
    addUrl?: string
    editUrl?: string
    externalParams?: {
        [propName: string]: boolean | number | number[] | string | string[] | Date[] | SubParams
    }
    defaultValue?: {
        [propName: string]: boolean | number | number[] | string | string[] | Date[] | SubParams
    }
    width?: string
    columns: AOUCloumn[]
}
