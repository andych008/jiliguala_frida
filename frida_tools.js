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
