/**@deprecated */

const espId = 1;
const componentButtonList = [ //sa loob ng ESP tong line na to
  { name: 'Fan', icon: 'bi-fan', model: `Fan${espId}` },
  { name: 'Light', icon: 'bi-lightbulb-fill', model: `Light${espId}` },
  { name: 'Charger', icon: 'bi-lightning-charge-fill', model: `Charger${espId}` },
  { name: 'Outlet', icon: 'bi-plug-fill', model: `Outlet${espId}` }
]

const componentButtonState = {
  isFanOn1: false,
  isLightOn1: false,
  isChargerOn1: false,
  isOutletOn1: false
}

const isESP32Connected = true
export { componentButtonList, componentButtonState, isESP32Connected }

/**
 * PowerShell
 * > Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
 *
 * Use the command to enable 'firebase login'
 */
