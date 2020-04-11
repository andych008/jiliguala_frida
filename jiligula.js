///<reference path='D:/apps/frida-gum.d.ts'/>

Java.perform(function(){
  
  console.log("------------")



  var detailActivity = Java.use("com.jiliguala.niuwa.module.superroadmap.subcourse.RoadMapDetailActivity");

  detailActivity.onCreate.overload('android.os.Bundle').implementation = function(bundle){
      console.log("RoadMapDetailActivity#onCreate")

      this.onCreate(bundle);

      
    
      var a = Java.use("com.jiliguala.niuwa.common.util.b.a");

      var Log = Java.use("android.util.Log");
      Log.i("andyT", "andy---"+a.g);

      console.log("RoadMapDetailActivity#onCreate234")
  }




  // var HttpLoggingInterceptor = Java.use("okhttp3.logging.HttpLoggingInterceptor");
  // for (var item in HttpLoggingInterceptor) {
  //   console.log("item: "+item)
  // }


  var aHttpInterceptor = Java.use("okhttp3.w");
  aHttpInterceptor.intercept.overload('okhttp3.w$a').implementation = function(wa){
      console.log("Hook intercept")
  }





})