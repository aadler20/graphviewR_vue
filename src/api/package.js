import request from '@/utils/request'

const packageApi = {
  FirstLetters: '/package/getFirstLetters',
  FunctionGraph: '/package/getFunctionGraph',
  LocalPackages: '/package/getLocalPackages',
  PackageTable: '/package/getPackageTable',
  PackageSimple: '/package/getPackageSimple',
  PackageInfo: '/package/getPackageInfo',
  PackageGraph: '/package/getPackageGraph',
  PackageDemo: '/package/getPackageDemo',
  DemoCode: '/package/getDemoCode'
}

export function getPackageSimple (parameter) {
  return request({
    url: packageApi.PackageSimple,
    method: 'post',
    data: parameter
  })
}

export function getFirstLetters (parameter) {
  return request({
    url: packageApi.FirstLetters,
    method: 'post',
    data: parameter
  })
}

export function getLocalPackages (parameter) {
  return request({
    url: packageApi.LocalPackages,
    method: 'post',
    data: parameter
  })
}

export function getPackageTable (parameter) {
  return request({
    url: packageApi.PackageTable,
    method: 'post',
    data: parameter
  })
}

/**
 * get package demo info including item and title
 * @param parameter
 * @returns {*}
 */
export function getPackageDemo (parameter) {
  return request({
    url: packageApi.PackageDemo,
    method: 'post',
    data: parameter
  })
}

/**
 * get package demo code
 * @param parameter
 * @returns {*}
 */
export function getDemoCode (parameter) {
  return request({
    url: packageApi.DemoCode,
    method: 'post',
    data: parameter
  })
}

export function getPackageGraph (parameter) {
  return request({
    url: packageApi.PackageGraph,
    method: 'post',
    data: parameter
  })
}

export function getPackageInfo (parameter) {
  return request({
    url: packageApi.PackageInfo,
    method: 'get',
    params: parameter
  })
}

export function getFunctionGraph (parameter) {
  return request({
    url: packageApi.FunctionGraph,
    method: 'get',
    params: parameter
  })
}
