///<reference path='D:/apps/frida-gum.d.ts'/>


function showStacks() {
  Java.perform(function () {
      console.log(Java.use("android.util.Log").getStackTraceString(Java.use("java.lang.Exception").$new()));
  });
}

function myEach(arr){
  for (var i in arr) {
      console.log("item : "+JSON.stringify(arr[i]))
  }
}


function traceActivity() {
  if (arguments.length === 1) {
    doTraceActivity(arguments[0])
  } else {
    traceActivity("android.app.Activity")
  }
}

function doTraceActivity(act) {
  var actShort = act.substr(act.lastIndexOf('.')+1)
  var Activity = Java.use(act);
  Activity.onCreate.overload('android.os.Bundle').implementation = function(bundle){
      console.log(actShort+"#onCreate---")
      this.onCreate(bundle);
      if(actShort.indexOf("Activity")==0) {
        showStacks()
      }
      console.log(actShort+"#onCreate---end")
  }
}

function dlog(d) {
  var Log = Java.use("android.util.Log");
  if (arguments.length === 1) {
    Log.i("andyT", "andy--- "+arguments[0]);
  } else if (arguments.length === 2) {
    Log.i("andyT", arguments[1]+"--- "+arguments[0]);
  }
  
}
//refSetString(this, "flag", "dev")//还没测试
function refSetString(obj, field, val) {
  var f = obj.getClass().getDeclaredField(field);
  f.setAccessible(true);
  f.set(obj, val);
}


Java.perform(function(){
  
  console.log("------------")



  var detailActivity = Java.use("com.jiliguala.niuwa.module.superroadmap.subcourse.RoadMapDetailActivity");

  detailActivity.onCreate.overload('android.os.Bundle').implementation = function(bundle){
      console.log("RoadMapDetailActivity#onCreate")

      this.onCreate(bundle);

      
    
      var a = Java.use("com.jiliguala.niuwa.common.util.b.a");
      dlog(a.g)

    

      console.log("RoadMapDetailActivity#onCreate234")
  }


  // traceActivity()

  

  // var HttpLoggingInterceptor = Java.use("okhttp3.logging.HttpLoggingInterceptor");
  // for (var item in HttpLoggingInterceptor) {
  //   console.log("item: "+item)
  // }


  var aHttpInterceptor = Java.use("okhttp3.w");
  aHttpInterceptor.intercept.overload('okhttp3.w$a').implementation = function(wa){
      console.log("Hook intercept")
  }

  var PingPPPayResult = Java.use("com.jiliguala.niuwa.logic.network.json.PingPPPayResult");
  PingPPPayResult.isPaid.implementation = function(){
      console.log("isPaid")
      return true
  }
  PingPPPayResult.isNotPaid.implementation = function(){
      console.log("isNotPaid = ")
      // showStacks()
      // return this.isNotPaid()
      return false
  }

  

// onReceivedPayResult(PingPPPayResult$Data, String, String, String, String, CouponListTemplate$Data, int)

var webActivity = Java.use("com.jiliguala.niuwa.module.webview.InternalWebActivity");

// webActivity.onReceivedPayResult()
// onReceivedPayResult(): argument types do not match any of:
// .overload('com.jiliguala.niuwa.logic.network.json.PingPPPayResult$Data', 'java.lang.String', 'java.lang.String', 'java.lang.String', 'java.lang.String', 'com.jiliguala.niuwa.logic.network.json.CouponListTemplate$Data', 'int')




webActivity.onReceivedPayResult.overload('com.jiliguala.niuwa.logic.network.json.PingPPPayResult$Data', 'java.lang.String', 'java.lang.String', 'java.lang.String', 'java.lang.String', 'com.jiliguala.niuwa.logic.network.json.CouponListTemplate$Data', 'int')
  .implementation = function(data,  str,  str2,  str3,  str4,  data2, i){
    console.log("webActivity#onReceivedPayResult---")
    // public String button;
    // public String content;
    // public String image;
    // public String status;
    // public String url;
    // public boolean xx;

    // data.status=com.jiliguala.niuwa.common.a.s.T//"paid"
    refSetString(data, "status", "paid")//还没测试

    dlog(data, "onReceivedPayResult")
    myEach(arguments)

    console.log("data: "+data)
    console.log("data2: "+JSON.stringify(data2))


    this.onReceivedPayResult(data,  str,  str2,  str3,  str4,  data2, i)


    console.log("webActivity#onReceivedPayResult---end")
}


  //com.jiliguala.niuwa.logic.network.json.PingPPPayResult

  var PurchasedGiftActivity = Java.use("com.jiliguala.niuwa.module.NewRoadMap.PurchasedGiftActivity");
  
  PurchasedGiftActivity.onCreate.overload('android.os.Bundle').implementation = function(bundle){
    console.log("PurchasedGiftActivity#onCreate---")
    dlog(bundle, "PurchasedGiftActivity")
    this.onCreate(bundle);

    console.log("PurchasedGiftActivity#onCreate---end")
}

})


