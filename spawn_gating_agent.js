///<reference path='D:/apps/frida-gum.d.ts'/>
console.log("------------Agent speaking from PID", Process.id);

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
};

Java.perform(function () {
  console.log("------------");

  var application = Java.use("com.jiliguala.niuwa.MyApplication");
  application.attachBaseContext.overload(
    "android.content.Context"
  ).implementation = function (context) {
    console.log("Hook MyApplication");

    //日志开关
    var a = Java.use("com.jiliguala.niuwa.common.util.b.a"); //com.jiliguala.niuwa.common.util.b.a.g
    ref.setStaticString(a, "d", "dev");

    //a/b test调试助手、StethoInterceptor开关
    //搜.enableDebugAssist(com.jiliguala.niuwa.common.util.b.a.g)
    //搜new StethoInterceptor()
    ref.setStaticBoolean(a, "g", true);

    //关闭 a/b test调试助手 ,太烦人
    var abtest = Java.use("com.adhoc.config.AdhocConfig$Builder"); //注意内部类的表示方式
    abtest.enableDebugAssist.implementation = function (z) {
      console.log("enableDebugAssist");
      // this.mDebug = true//只能用反射修改
      ref.setBoolean(this, "mDebug", false);
      return this;
    };

    //遍历heap中的对象
    Java.choose("com.jiliguala.niuwa.common.util.b.a", {
      onMatch: function (instance) {
        console.log("Found instance: " + instance);
        // console.log("[*] EditText Hint: " + Java.cast(instance.getHint(), Boolean));
      },
      onComplete: function () {
        console.log("[*] Finished heap search");
      },
    });

    //不要忘记调用原方法。一般放在最后，这样前面的hook才能更早生效。
    this.attachBaseContext(context);
  };
});
