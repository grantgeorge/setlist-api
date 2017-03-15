'use strict'

export function routeConfig($urlRouterProvider, $locationProvider) {
  'ngInject'

  $urlRouterProvider.otherwise('/')

  $locationProvider.html5Mode(true)

  // console.log(cloudinaryProvider)
  //
  // cloudinaryProvider
  //   .set('cloud_name', 'dymwnavh5')
  //   .set('upload_preset', 'rzgtvvrn')
}
