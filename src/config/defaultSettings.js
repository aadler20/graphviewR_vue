/**
 * Default settings:
 * primaryColor - default primary color. Clear localStorage if update not works.
 * navTheme - sidebar theme ['dark', 'light'] two themes
 * colorWeak - for weak color users
 * layout - layout ['sidemenu', 'topmenu']
 * fixedHeader - if Header fixed: boolean
 * fixSiderbar - if left sidebar fixed： boolean
 * contentWidth - content layout： fluid | fixed
 *
 * storageOptions: {} - Vue-ls (localStorage/sessionStorage)
 *
 */

export default {
  navTheme: 'dark', // theme for nav menu
  primaryColor: '#1890ff', // '#52C41A', '#FA541C', '#1890ff', '#F5222D' // primary color of ant design
  layout: 'topmenu', // nav menu position: `sidemenu` or `topmenu`
  contentWidth: 'Fluid', // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
  fixedHeader: false, // sticky header
  fixSiderbar: false, // sticky siderbar
  colorWeak: false,
  menu: {
    locale: true
  },
  title: 'graphviewR',
  pwa: false,
  iconfontUrl: '',
  production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true'
}
