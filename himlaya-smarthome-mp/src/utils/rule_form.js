// 表单校验
/**
 * 规则
 * rules: {
 *  name: [
 *    {
        required: true,
        message: '请输入姓名'
      }
    ],
    mobile: [
      {
        required: true,
        message: '请输入手机'
      },
      {
        pattern: /^1[3-9]\d{9}$/,
        message: '手机号格式错误'
      }
    ]
 * }
 * rules是一个对象  key对应的表单字段， key是一个数组类型，一个输入框可判断多个条件  required判断是否为空，pattern正则判断
 * 注意： rules对象不能放在 页面的data对象中，否则会获取不到正则 请在Page({})外面定义常量
 */
    export default function formRules(rules, form, callback) {
        for (let key in rules) {
          const value = form[key]
          const rs = rules[key]
          for (let i = 0; i < rs.length; i++) {
            if (rs[i].required && value.length === 0) {
              wx.showToast({
                title: rs[i].message,
                icon: 'none'
              })
              callback(false)
              return
            } else if (rs[i].pattern && !(rs[i].pattern.test(value))) {
              wx.showToast({
                title: rs[i].message,
                icon: 'none'
              })
              callback(false)
              return
            }
          }
        }
        callback(true)
      }