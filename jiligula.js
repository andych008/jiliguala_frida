///<reference path='D:/apps/frida-gum.d.ts'/>
//the toolbox
const tb = {
  // tb.showStacks()
  showStacks: function () {
    Java.perform(function () {
      var t = Java.use("android.util.Log").getStackTraceString(
        Java.use("java.lang.Exception").$new()
      );
      if (arguments.length > 0) {
        const idx = t.indexOf(arguments[0]);
        if (idx > 0) {
          t = t.substr(0, idx) + "......";
        }
      }
      console.log(t);
    });
  },

  each: function (arr) {
    for (var i in arr) {
      console.log("item : " + JSON.stringify(arr[i]));
    }
  },

  // tb.traceActivity("yourpackage.RoadMapDetailActivity")
  // tb.traceActivity()
  traceActivity: function () {
    if (arguments.length === 1) {
      var act = arguments[0];
    } else {
      var act = "android.app.Activity";
    }

    var actShort = act.substr(act.lastIndexOf(".") + 1);
    var Activity = Java.use(act);
    Activity.onCreate.overload("android.os.Bundle").implementation = function (
      bundle
    ) {
      console.log(actShort + "#onCreate---");
      this.onCreate(bundle);
      if (actShort.indexOf("Activity") == 0) {
        tb.showStacks("android.app.Activity.performCreate");
      }
      console.log(actShort + "#onCreate---end");
    };
  },

  //tb.dlog("your_msg")
  //tb.dlog("your_msg","your_pre")
  dlog: function (msg, pre) {
    var Log = Java.use("android.util.Log");
    if (arguments.length === 1) {
      Log.i("andy", "andy--- " + msg);
    } else if (arguments.length === 2) {
      Log.i("andy", pre + "--- " + msg);
    }
  },
}

//reflection wrapper
const ref = {
  //ref.setStaticString(A, "flag", "dev")
  setStaticString: function (aClass, field, val) {
    var f = aClass.class.getDeclaredField(field);
    f.setAccessible(true);
    f.set("java.lang.Object", val);
  },

  //ref.setStaticBoolean(A, "flag", true)
  setStaticBoolean: function (aClass, field, val) {
    var f = aClass.class.getDeclaredField(field);
    f.setAccessible(true);
    f.setBoolean("java.lang.Boolean", val); //必须是字符串"java.lang.Boolean"或"java.lang.Object"不能是Java.use()的返回类型
  },

  //ref.setString(this, "flag", "dev")//还没测试
  setString: function (obj, field, val) {
    var f = obj.getClass().getDeclaredField(field);
    f.setAccessible(true);
    f.set(obj, val);
  },

  //ref.setBoolean(this, "flag", true)
  setBoolean: function (obj, field, val) {
    var f = obj.getClass().getDeclaredField(field);
    f.setAccessible(true);
    f.setBoolean(obj, val);
  },
}


Java.perform(function () {
  console.log("------------");

  // var detailActivity = Java.use(
  //   "com.jiliguala.niuwa.module.superroadmap.subcourse.RoadMapDetailActivity"
  // );

  // detailActivity.onCreate.overload(
  //   "android.os.Bundle"
  // ).implementation = function (bundle) {
  //   console.log("RoadMapDetailActivity#onCreate");

  //   this.onCreate(bundle);

  //   var a = Java.use("com.jiliguala.niuwa.common.util.b.a");
  //   tb.dlog(a.g);
  //   tb.dlog("hello","mypre");

  //   console.log("RoadMapDetailActivity#onCreate234");
  // };

  tb.traceActivity("com.jiliguala.niuwa.module.superroadmap.subcourse.RoadMapDetailActivity")
  // tb.traceActivity()

  // var HttpLoggingInterceptor = Java.use("okhttp3.logging.HttpLoggingInterceptor");
  // for (var item in HttpLoggingInterceptor) {
  //   console.log("item: "+item)
  // }

  var aHttpInterceptor = Java.use("okhttp3.w");
  aHttpInterceptor.intercept.overload("okhttp3.w$a").implementation = function (
    wa
  ) {
    console.log("Hook intercept");
  };

  var PingPPPayResult = Java.use(
    "com.jiliguala.niuwa.logic.network.json.PingPPPayResult"
  );
  PingPPPayResult.isPaid.implementation = function () {
    console.log("isPaid");
    return true;
  };
  PingPPPayResult.isNotPaid.implementation = function () {
    console.log("isNotPaid = ");
    // tb.showStacks()
    // return this.isNotPaid()
    return false;
  };

  // onReceivedPayResult(PingPPPayResult$Data, String, String, String, String, CouponListTemplate$Data, int)

  var webActivity = Java.use(
    "com.jiliguala.niuwa.module.webview.InternalWebActivity"
  );

  // webActivity.onReceivedPayResult()
  // onReceivedPayResult(): argument types do not match any of:
  // .overload('com.jiliguala.niuwa.logic.network.json.PingPPPayResult$Data', 'java.lang.String', 'java.lang.String', 'java.lang.String', 'java.lang.String', 'com.jiliguala.niuwa.logic.network.json.CouponListTemplate$Data', 'int')

  webActivity.onReceivedPayResult.overload(
    "com.jiliguala.niuwa.logic.network.json.PingPPPayResult$Data",
    "java.lang.String",
    "java.lang.String",
    "java.lang.String",
    "java.lang.String",
    "com.jiliguala.niuwa.logic.network.json.CouponListTemplate$Data",
    "int"
  ).implementation = function (data, str, str2, str3, str4, data2, i) {
    console.log("webActivity#onReceivedPayResult---");
    // public String button;
    // public String content;
    // public String image;
    // public String status;
    // public String url;
    // public boolean xx;

    // data.status=com.jiliguala.niuwa.common.a.s.T//"paid"
    ref.setString(data, "status", "paid"); //还没测试

    tb.dlog(data, "onReceivedPayResult");
    tb.each(arguments);

    console.log("data: " + data);
    console.log("data2: " + JSON.stringify(data2));

    this.onReceivedPayResult(data, str, str2, str3, str4, data2, i);

    console.log("webActivity#onReceivedPayResult---end");
  };

  //com.jiliguala.niuwa.logic.network.json.PingPPPayResult

  var PurchasedGiftActivity = Java.use(
    "com.jiliguala.niuwa.module.NewRoadMap.PurchasedGiftActivity"
  );

  PurchasedGiftActivity.onCreate.overload(
    "android.os.Bundle"
  ).implementation = function (bundle) {
    console.log("PurchasedGiftActivity#onCreate---");
    tb.dlog(bundle, "PurchasedGiftActivity");
    this.onCreate(bundle);

    console.log("PurchasedGiftActivity#onCreate---end");
  };
});
