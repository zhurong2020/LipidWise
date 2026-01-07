// pages/assessment/result.js
const { getRecommendations } = require('../../utils/riskCalculator');
const { simulateInterventions } = require('../../utils/simulator');

Page({
    data: {
        record: null,
        advice: null,
        simulations: []
    },

    onLoad(options) {
        if (options.result) {
            try {
                const record = JSON.parse(decodeURIComponent(options.result));
                const { result, input } = record;
                const advice = getRecommendations(result.level, input.ldl);
                const simulations = simulateInterventions(input);

                this.setData({
                    record,
                    advice,
                    simulations
                });
            } catch (e) {
                console.error('Failed to parse result', e);
            }
        }
    },

    goHome() {
        wx.reLaunch({
            url: '/pages/index/index',
        });
    },

    onShareAppMessage() {
        const { result } = this.data.record || {};
        const title = result ? `我的ASCVD风险评估：${result.level.label}` : 'LipidWise 风险评估';

        return {
            title: title,
            path: '/pages/index/index'
        }
    }
})
