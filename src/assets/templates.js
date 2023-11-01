const componentButtonList = [
  { name: 'Fan 1', icon: 'bi-fan', model: 'fan1' },
  { name: 'Light 1', icon: 'bi-lightbulb-fill', model: 'light1' },
  { name: 'Charger 1', icon: 'bi-lightning-charge-fill', model: 'charger1' },
  { name: 'Outlet 1', icon: 'bi-plug-fill', model: 'outlet1' }
]

const componentButtonState = {
  fan1: false,
  light1: false,
  charger1: false,
  outlet1: false
}

const isESP32Connected = true;
export { componentButtonList, componentButtonState, isESP32Connected }

/**
 * PowerShell
 * > Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
 * 
 * Use the command to enable 'firebase login'
 */