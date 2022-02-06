export const filters = {

  percent (value?: number|string, options?: Intl.NumberFormatOptions) {
    let theValue = null
    if (typeof value === 'number') { theValue = value }
    if (typeof value === 'string' && !isNaN(parseFloat(value))) { theValue = parseFloat(value) }

    return theValue
      ? theValue.toLocaleString('en-GB', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2, ...options })
      : null
  },

  currency (value?: number|string, currency: string = "", format: string = "long") {
    let theValue: number
    if (typeof value === 'number') {
      theValue = value
    } else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
      theValue = parseFloat(value)
    } else {
      theValue = 0
    }

    if (format === "long") return `${theValue.toLocaleString()} ${currency}`

    const thresh = 1000

    if (Math.abs(theValue) < thresh) return `${theValue} ${currency}`

    const units = ['k', 'M']

    let u = -1
    do {
      theValue /= thresh
      ++u
    } while (Math.abs(theValue) >= thresh && u < units.length - 1)
    return `${theValue.toFixed(1)}${units[u]} ${currency}`
  },

  capitalize (string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
