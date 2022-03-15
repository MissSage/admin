interface ChangzhanData {
  name: string
  address: string
  location: [number, number] | [string, string]
  scada: string
}

interface ChangzhanDialog {
  visible: boolean
  title: string
  close: () => void
  url: string
}
