// pages/assessment/input.js
const { calculateRisk } = require('../../utils/riskCalculator');
// const { saveResult } = require('../../utils/storage'); // Deprecated -> Migrated to DataService
const DataService = require('../../utils/dataService');

Page({
    data: {
        formData: {
            age: '',
            gender: 'male',
            smoking: false,
            diabetes: false,
            hypertension: false,
            hasAscvd: false,
            sbp: '',
            tc: '',
            ldl: '',
            hdl: ''
        },
        genders: [
            { name: '男', value: 'male' },
            { name: '女', value: 'female' }
        ]
    },

    onInputChange(e) {
        const { field } = e.currentTarget.dataset;
        let value = e.detail.value;

        // Convert to number for numeric fields if needed, 
        // but input value is string usually. We verify on submit.
        this.setData({
            [`formData.${field}`]: value
        });
    },

    onSwitchChange(e) {
        const { field } = e.currentTarget.dataset;
        this.setData({
            [`formData.${field}`]: e.detail.value
        });
    },

    onGenderChange(e) {
        this.setData({
            'formData.gender': e.detail.value
        });
    },

    submitForm() {
        const data = this.data.formData;

        // 1. Validation
        if (!data.age || !data.sbp || !data.tc || !data.ldl || !data.hdl) {
            wx.showToast({
                title: '请填写完整信息',
                icon: 'none'
            });
            return;
        }

        // Convert types
        const processedData = {
            age: parseInt(data.age),
            gender: data.gender,
            smoking: data.smoking,
            diabetes: data.diabetes,
            hypertension: data.hypertension,
            hasAscvd: data.hasAscvd,
            sbp: parseInt(data.sbp),
            tc: parseFloat(data.tc),
            ldl: parseFloat(data.ldl),
            hdl: parseFloat(data.hdl)
        };

        // Range checks (Simple)
        if (processedData.age < 18 || processedData.age > 100) {
            wx.showToast({ title: '年龄需在18-100岁之间', icon: 'none' }); return;
        }

        // 2. Calculate Risk
        const result = calculateRisk(processedData);

        // 3. Save to Data Service (Abstracted Layer)
        const record = {
            input: processedData,
            result: result
        };

        DataService.saveAssessment(record).then(() => {
            console.log('Saved via DataService');
        });

        // 4. Navigate to Result
        wx.navigateTo({
            url: `/pages/assessment/result?result=${encodeURIComponent(JSON.stringify(record))}`,
        });
    }
})
