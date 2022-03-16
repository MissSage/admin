export function dwnai (num: any) {
  if (typeof num === 'undefined' || num === null) {
    return '-'
  } else if (isNaN(num)) {
    return '-'
  } else if (num === 'Infinity' || !isFinite(num)) {
    return '-'
  } else {
    return parseFloat(num).toFixed(2) === '-0.00' ? '0.00' : parseFloat(num).toFixed(2)
  }
}

export function ndwnai (num: any) {
  if (typeof num === 'undefined' || num === null) {
    return 0
  } else if (isNaN(num)) {
    return 0
  } else if (num === 'Infinity' || !isFinite(num)) {
    return 0
  } else {
    return parseFloat(num).toFixed(2) === '-0.00' ? '0.00' : parseFloat(num).toFixed(2)
  }
}

// 用在曲线 保留null
export function dwnaiRetainNull (num: any) {
  if (typeof num === 'undefined' || num === null) {
    return null
  } else if (isNaN(num)) {
    return null
  } else if (num === 'Infinity' || !isFinite(num)) {
    return null
  } else {
    return parseFloat(num).toFixed(2) === '-0.00' ? '0.00' : parseFloat(num).toFixed(2)
  }
}

export function decimalPlaces4 (num: any) {
  if (typeof num === 'undefined' || num === null) {
    return '-'
  } else if (isNaN(num)) {
    return '-'
  } else if (num === 'Infinity' || !isFinite(num)) {
    return '-'
  } else {
    return parseFloat(num).toFixed(4) === '-0.0000' ? '0.0000' : parseFloat(num).toFixed(4)
  }
}

export function ndecimalPlaces4 (num: any) {
  if (typeof num === 'undefined' || num === null) {
    return 0
  } else if (isNaN(num)) {
    return 0
  } else if (num === 'Infinity' || !isFinite(num)) {
    return 0
  } else {
    return parseFloat(num).toFixed(4) === '-0.0000' ? '0.0000' : parseFloat(num).toFixed(4)
  }
}
