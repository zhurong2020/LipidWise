// app.js
App({
  onLaunch() {
    // Local-first: No cloud init needed
    // Logs or local init if necessary
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null
  }
})
