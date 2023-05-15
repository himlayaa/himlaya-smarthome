const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  username: state => state.user.username,
  password: state => state.user.password,
  mqtt_state: state => state.mqttL.mqtt_state
}
export default getters
