// pages/index/index.js
Page({
    data: {
        title: 'LipidWise',
        subtitle: '科学评估，守护心血管健康'
    },

    onLoad() {

    },

    startAssessment() {
        wx.navigateTo({
            url: '/pages/assessment/input',
        })
    },

    viewHistory() {
        // For now, simpler to reuse result page or build a list.
        // But let's check input page logic, maybe we can put history entry there?
        // Or just navigate to a history page if we had one.
        // For MVP: Guide user to assessment.
        wx.navigateTo({
            url: '/pages/assessment/input',
        })
    }
})
