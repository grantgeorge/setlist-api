import angular from 'angular'
import uiRouter from 'angular-ui-router'
import routing from './main.routes'

export class MainController {
  awesomeThings = []
  newThing = ''

  /*@ngInject*/
  constructor($http, $scope, socket) {
    this.$http = $http
    this.socket = socket
    // this.cloudinary = cloudinary

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing')
    })
  }

  $onInit() {
    // this.$http.get('/api/things')
    //   .then(response => {
    //     this.awesomeThings = response.data
    //     this.socket.syncUpdates('thing', this.awesomeThings)
    //   })
  }

  // uploadFiles(files) {
  //   console.log('upload files!')
  //   this.files = files;
  //   if (!this.files) return;
  //   angular.forEach(files, function(file){
  //     if (file && !file.$error) {
  //       file.upload = $upload.upload({
  //         url: "https://api.cloudinary.com/v1_1/" + cloudinary.config().cloud_name + "/upload",
  //         data: {
  //           upload_preset: cloudinary.config().upload_preset,
  //           tags: 'myphotoalbum',
  //           context: 'photo=' + this.title,
  //           file: file
  //         }
  //       }).progress(function (e) {
  //         file.progress = Math.round((e.loaded * 100.0) / e.total);
  //         file.status = "Uploading... " + file.progress + "%";
  //       }).success(function (data, status, headers, config) {
  //         $rootScope.photos = $rootScope.photos || [];
  //         data.context = { custom: { photo: this.title } };
  //         file.result = data;
  //         $rootScope.photos.push(data);
  //       }).error(function (data, status, headers, config) {
  //         file.result = data;
  //       });
  //     }
  //   });
  // };
  //
  // dragOverClass($event) {
  //   let items = $event.dataTransfer.items;
  //   let hasFile = false;
  //   if (items != null) {
  //     for (let i = 0 ; i < items.length; i++) {
  //       if (items[i].kind == 'file') {
  //         hasFile = true;
  //         break;
  //       }
  //     }
  //   } else {
  //     hasFile = true
  //   }
  //   return hasFile ? 'dragover' : 'dragover-err';
  // }
}

export default angular.module('setlistApiApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name
