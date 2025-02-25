/**
 * this helper helps manipulating DOM
 */

/**
 * when gitako is ready, make page's header narrower
 * or cancel it
 */
export function markGitakoReadyState(ready: boolean) {
  const readyClassName = 'gitako-ready'
  const classList = document.body.classList
  if (ready) classList.add(readyClassName)
  else classList.remove(readyClassName)
}

/**
 * if should show gitako, then move body right to make space for showing gitako
 * otherwise, hide the space
 */
export const bodySpacingClassName = 'with-gitako-spacing'
export function setBodyIndent(shouldShowGitako: boolean) {
  if (shouldShowGitako) {
    document.body.classList.add(bodySpacingClassName)
  } else {
    document.body.classList.remove(bodySpacingClassName)
  }
}

export function $<EE extends Element, E extends (element: EE) => any, O extends () => any>(
  selector: string,
  existCallback?: E,
  otherwise?: O,
): E extends never
  ? O extends never
    ? Element | null
    : ReturnType<O> | null
  : O extends never
  ? ReturnType<E> | null
  : ReturnType<O> | ReturnType<E> {
  const element = document.querySelector(selector)
  if (element) {
    return existCallback ? existCallback(element as EE) : element
  }
  return otherwise ? otherwise() : null
}

/**
 * add the logo element into DOM
 */
export function insertLogoMountPoint() {
  const logoID = 'gitako-logo-mount-point'
  const logoSelector = '#' + logoID
  return $(logoSelector, undefined, function createLogoMountPoint() {
    const logoMountElement = document.createElement('div')
    logoMountElement.setAttribute('id', logoID)
    document.body.appendChild(logoMountElement)
    return logoMountElement
  })
}

/**
 * content above the file navigation bar is same for all pages of the repo
 * use this function to scroll down a bit to hide them
 */
export function scrollToRepoContent() {
  const repositoryContentSelector = '.repository-content'
  // do NOT use behavior: smooth here as it will scroll horizontally
  $(repositoryContentSelector, repositoryContentElement =>
    repositoryContentElement.scrollIntoView(),
  )
}

/**
 * copy content of a DOM element to clipboard
 */
export function copyElementContent(element: Element, trimLeadingSpace?: boolean): boolean {
  window.getSelection()?.removeAllRanges()

  const range = document.createRange()
  if (trimLeadingSpace) {
    // Leading spaces can be produced by embedded DOM structures
    let realWrapper: Element | null = element
    while (realWrapper?.childElementCount === 1) realWrapper = realWrapper?.firstElementChild
    if (realWrapper?.childElementCount && realWrapper.childElementCount > 1) {
      const first = realWrapper.firstElementChild
      const last = realWrapper.lastElementChild
      if (first && last) {
        range.selectNode(first)
        range.setEndAfter(last)
      }
    }
  } else {
    range.selectNode(element)
  }

  window.getSelection()?.addRange(range)
  const isCopySuccessful = document.execCommand('copy')
  window.getSelection()?.removeAllRanges()
  return isCopySuccessful
}

/**
 * focus to side bar, user will be able to manipulate it with keyboard
 */
export function focusFileExplorer() {
  const sideBarContentSelector = '.gitako-side-bar .file-explorer'
  $(sideBarContentSelector, sideBarElement => {
    if (sideBarElement instanceof HTMLElement) sideBarElement.focus()
  })
}

export function focusSearchInput() {
  const searchInputSelector = '.search-input input'
  $(searchInputSelector, searchInputElement => {
    if (
      document.activeElement !== searchInputElement &&
      searchInputElement instanceof HTMLElement
    ) {
      searchInputElement.focus()
    }
  })
}

export function setResizingState(on: boolean) {
  const target = document.querySelector('.gitako-toggle-show-button-wrapper')
  if (!target) return
  if (on) target.classList.add('resizing')
  else target.classList.remove('resizing')
}
