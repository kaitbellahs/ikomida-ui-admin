import { StatusBarInfo, Style } from '@ikomida/capacitor-plugin-status-bar'
import { writable } from 'svelte/store'

export interface StatusBarType extends StatusBarInfo {
  topMargin?: number
  visible: boolean
  height: number
  bottomPadding: number
}

function createStatusBar() {
  const { subscribe, set } = writable<StatusBarType>({
    style: Style.Default,
    visible: true,
    height: 0,
    bottomPadding: 0,
    topMargin: 0
  })

  return {
    subscribe,
    setStatusBar: (info: StatusBarType) => set(info)
  }
}

export const StatusBar = createStatusBar()