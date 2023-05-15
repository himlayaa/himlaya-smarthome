/*******************************************************************************
 * mqtt工具类
 *
 * 说明：该工具类，当前已集成如下方法：
 *    1、通用pub
 *    2、通用sub
 *
 * 若要查阅相关工具类，建议先折叠方法内部代码
 *
 * @author Francis
 * @since 2022-10-09 17:14
 * @version v1.0
 *******************************************************************************/
/**
 * 【通用】发布话题
 *
 * @param client
 * @param topic
 * @param qos
 * @param msg
 */


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
}

export default{
    pub,
    sub
}