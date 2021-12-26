
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import Map from '@arcgis/core/Map'
import Basemap from '@arcgis/core/Basemap'
import TileLayer from '@arcgis/core/layers/TileLayer'
import BasemapToggle from '@arcgis/core/widgets/BasemapToggle'
import Zoom from '@arcgis/core/widgets/Zoom'
import ScaleBar from '@arcgis/core/widgets/ScaleBar'
const initMapView = ({ url, container, scaleBar, zoomBar, basemapToggleBar }: {
  url: string
  container?: HTMLDivElement
  scaleBar?: HTMLElement
  zoomBar?: HTMLElement
  basemapToggleBar?: HTMLElement
}) => {
  basemapToggleBar && (basemapToggleBar.innerHTML = '')
  scaleBar && (scaleBar.innerHTML = '')
  zoomBar && (zoomBar.innerHTML = '')

  const map = new Map({
    basemap: new Basemap({
      baseLayers: [new TileLayer({
        url,
        title: 'Basemap'
      })],
      title: 'basemap',
      id: 'basemap'
    })
  })

  const mapViewIns = new MapView({
    container,
    map: map,
    zoom: 10,
    center: [
      104.072745,
      30.663774
    ]
  })
  if (basemapToggleBar) {
    // 实例化底图切换控件
    const toggleIns = new BasemapToggle({
      view: mapViewIns,
      nextBasemap: 'hybrid',
      container: basemapToggleBar
    })
    mapViewIns.ui.add(toggleIns)
  }
  if (scaleBar) {
    // 实例化比例尺
    const scaleIns = new ScaleBar({
      view: mapViewIns,
      unit: 'metric',
      container: scaleBar
    })
    mapViewIns.ui.add(scaleIns)
  }
  if (zoomBar) {
    // 实例化缩放控件
    const zoomIns = new Zoom({
      view: mapViewIns,
      container: zoomBar
    })
    mapViewIns.ui.add(zoomIns)
  }
  mapViewIns.ui.components = []
  return mapViewIns
}
const initSceneView = ({ url, container, basemapToggleBar }: {
  url: string
  container?: HTMLDivElement
  basemapToggleBar?: HTMLElement
}) => {
  const map = new Map({
    basemap: new Basemap({
      baseLayers: [new TileLayer({
        url,
        title: 'Basemap'
      })],
      title: 'basemap',
      id: 'basemap'
    })
  })

  const sceneViewIns = new SceneView({
    container,
    map
  })
  if (basemapToggleBar) {
    // 实例化底图切换控件
    const toggleIns = new BasemapToggle({
      view: sceneViewIns,
      nextBasemap: 'hybrid',
      container: basemapToggleBar
    })
    sceneViewIns.ui.add(toggleIns)
  }
  setTimeout(() => {
    sceneViewIns.goTo({
      zoom: 10,
      center: [
        104.072745,
        30.663774
      ]
    })
  }, 500)

  sceneViewIns.ui.components = []
  return sceneViewIns
}
export const initMap = ({ url, container, mode, scaleBar, zoomBar, basemapToggleBar }: {
  url: string
  container?: HTMLDivElement
  mode?: '2D' | '3D'
  scaleBar?: HTMLElement
  zoomBar?: HTMLElement
  basemapToggleBar?: HTMLElement
}): MapView | SceneView => {
  const map = mode === '3D'
    ? initSceneView({
      url,
      container,
      basemapToggleBar
    })
    : initMapView({
      url,
      container,
      scaleBar,
      zoomBar,
      basemapToggleBar
    })
  return map
}
