import { useSizeProp } from '@element-plus/hooks'
import { buildProps, iconPropType } from '@element-plus/utils'
import { Loading } from '@element-plus/icons-vue'
import type { ExtractPropTypes } from 'vue'
import type button from './button.vue'

// as const 是 TS 的语法，它告诉 TS 它所断言的值以及该值的所有层级的子属性都是不可篡改的，
// 故对每一级子属性都会做最严格的类型推断。
export const buttonTypes = [
  'default',
  'primary',
  'success',
  'warning',
  'info',
  'danger',
  /**
   * @deprecated
   * Text type will be deprecated in the next major version (3.0.0)
   */
  'text',
  '',
] as const
export const buttonNativeTypes = ['button', 'submit', 'reset'] as const

export const buttonProps = buildProps({
  size: useSizeProp,
  disabled: Boolean,
  type: {
    type: String,
    values: buttonTypes,
    default: '',
  },
  icon: {
    type: iconPropType,
  },
  nativeType: {
    type: String,
    values: buttonNativeTypes,
    default: 'button',
  },
  loading: Boolean,
  loadingIcon: {
    type: iconPropType,
    default: () => Loading,
  },
  plain: Boolean,
  text: Boolean,
  link: Boolean,
  bg: Boolean,
  autofocus: Boolean,
  round: Boolean,
  circle: Boolean,
  color: String,
  dark: Boolean,
  autoInsertSpace: {
    type: Boolean,
    default: undefined,
  },
} as const)

export const buttonEmits = {
  click: (evt: MouseEvent) => evt instanceof MouseEvent,
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
export type ButtonEmits = typeof buttonEmits

export type ButtonType = ButtonProps['type']
export type ButtonNativeType = ButtonProps['nativeType']

export type ButtonInstance = InstanceType<typeof button>

export interface ButtonConfigContext {
  autoInsertSpace?: boolean
}
