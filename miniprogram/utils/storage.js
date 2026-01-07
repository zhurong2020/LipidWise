/**
 * Storage Utility for LipidWise
 * Manages local persistence of assessment records.
 */

const STORAGE_KEY = 'lipidwise_history_v1';

const saveResult = (record) => {
    try {
        const history = getHistory();
        // Add timestamp
        record.timestamp = new Date().getTime();
        record.dateStr = new Date().toLocaleDateString('zh-CN');

        // Add to beginning
        history.unshift(record);

        // Limit to last 20 records to save space
        if (history.length > 20) {
            history.length = 20;
        }

        wx.setStorageSync(STORAGE_KEY, history);
        return true;
    } catch (e) {
        console.error('Save failed', e);
        return false;
    }
};

const getHistory = () => {
    try {
        return wx.getStorageSync(STORAGE_KEY) || [];
    } catch (e) {
        return [];
    }
};

const clearHistory = () => {
    try {
        wx.removeStorageSync(STORAGE_KEY);
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    saveResult,
    getHistory,
    clearHistory
};
