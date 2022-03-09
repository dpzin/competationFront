import defaultSettings from '@/settings'

const title = defaultSettings.title || '超级不羁赛事系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
