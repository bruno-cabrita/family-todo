export type AlertType = 'default' | 'success' | 'danger' | 'warning' | 'info'

export type Alert = {
  isVisible: boolean
  type: AlertType
  message: string
}
