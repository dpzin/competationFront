import defaultSettings from '@/settings'

const title = defaultSettings.title || '不羁赛事系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
