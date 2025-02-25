import { useConfigs } from 'containers/ConfigsContext'
import * as React from 'react'
import { Config } from 'utils/configHelper'
import { Field } from './settings/Field'

export type SimpleField = {
  key: keyof Config
  label: string
  wikiLink?: string
  tooltip?: string
  description?: string
  overwrite?: {
    value: <T>(value: T) => boolean
    onChange: (checked: boolean) => any
  }
}

type Props = {
  field: SimpleField

  onChange?(): void
}

export function SimpleToggleField({ field, onChange }: Props) {
  const { overwrite } = field
  const configContext = useConfigs()
  const value = configContext.val[field.key]
  return (
    <Field
      id={field.key}
      title={
        <>
          {field.label}{' '}
          {field.wikiLink ? (
            <a href={field.wikiLink} title={field.tooltip} target={'_blank'}>
              (?)
            </a>
          ) : field.description ? (
            <p className={'note'} title={field.tooltip}>
              {field.description}
            </p>
          ) : (
            field.tooltip && (
              <span className={'help'} title={field.tooltip}>
                (?)
              </span>
            )
          )}
        </>
      }
      className={'field-checkbox'}
      checkbox
    >
      <input
        id={field.key}
        name={field.key}
        type={'checkbox'}
        onChange={async e => {
          const enabled = e.currentTarget.checked
          configContext.set({ [field.key]: overwrite ? overwrite.onChange(enabled) : enabled })
          if (onChange) onChange()
        }}
        checked={overwrite ? overwrite.value(value) : Boolean(value)}
      />
    </Field>
  )
}
