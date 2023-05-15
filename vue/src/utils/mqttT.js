export function pub(client, topic, qos, msg) {
    client.publish(topic, msg, qos, err => {
      if (!err) {
        console.log("发布成功！");
      } else {
        console.log("发布失败！", err);
      }
    })
  }
   
   
  /**
   * 【通用】订阅话题
   *
   * @param client
   * @param topic
   * @param qos
   */
  export function sub(client, topic, qos) {
    client.subscribe(topic, qos, err => {
      if (!err) {
        console.log("订阅成功！");
      } else {
        console.log("订阅失败！", err);
      }
    });

    client.on("message", function (topic, message) {
      //console.log(topic);
      //console.log(message)
      //message是16进制的buffer字节流，需要转化一下
      let dataFromDev = {};
      dataFromDev = JSON.parse(message);
      //console.log(dataFromDev);
      that.Temp = dataFromDev.Temp;
      that.Humi = dataFromDev.Humi;
      that.Smoke = dataFromDev.Smoke;
      that.Light = dataFromDev.Light;
      that.Wind = dataFromDev.Wind;
      that.Beep = dataFromDev.Beep;
    });
}


   