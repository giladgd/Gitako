import { Config, Pjax } from 'pjax-api'
import * as React from 'react'
import { useEvent } from 'react-use'

const config: Config = {
  areas: [
    // github
    '.repository-content',
    // gitee
    '#git-project-content',
  ],
  update: {
    css: false,
  },
  fetch: {
    cache(path) {
      return path
    },
  },
  link: 'a:not(a)', // this helps fixing the go-back-in-history issue
  form: 'form:not(form)', // prevent blocking form submissions
  fallback(target, reason) {
    // prevent unexpected reload
  },
}

export function usePJAX() {
  // make history travel work
  React.useEffect(() => {
    new Pjax({
      ...config,
      filter() {
        return false
      },
    })
  }, [])

  // bindings for legacy support
  useRedirectedEvents(window, 'pjax:fetch', 'pjax:start', document)
  useRedirectedEvents(document, 'pjax:ready', 'pjax:end')
}

export const loadWithPJAX = (url: string) => {
  Pjax.assign(url, config)
}

export function useOnPJAXDone(callback: () => void) {
  useEvent('pjax:end', callback, document)
}

export function useRedirectedEvents(
  originalTarget: Window | Document | Element,
  originalEvent: string,
  redirectedEvent: string,
  redirectToTarget = originalTarget,
) {
  useEvent(
    originalEvent,
    () => {
      redirectToTarget.dispatchEvent(new Event(redirectedEvent))
    },
    originalTarget,
  )
}
