/**
 * Data Service Abstraction
 * Purpose: Decouple the UI from the underlying storage mechanism.
 * Current Implementation: Local Storage (wx.getStorageSync)
 * Future Implementation: Hybrid (Local + Cloud Sync)
 */

const STORAGE_KEY = 'lipidwise_history_v1';
const USER_ID_KEY = 'lipidwise_uid';

// Generate a random local ID for now, to be mapped to OpenID later
const getOrInitUserId = () => {
    let uid = wx.getStorageSync(USER_ID_KEY);
    if (!uid) {
        uid = 'loc_' + Date.now() + Math.random().toString(36).substr(2, 9);
        wx.setStorageSync(USER_ID_KEY, uid);
    }
    return uid;
};

const DataService = {
    /**
     * Save Assessment Record
     * @param {Object} record 
     * @returns {Promise<boolean>}
     */
    saveAssessment: async (record) => {
        // 1. Prepare data with Metadata for future sync
        const enrichedRecord = {
            ...record,
            _id: 'rec_' + Date.now(), // Local unique ID
            _uid: getOrInitUserId(),  // Owner
            createdAt: new Date().getTime(),
            synced: false // Flag for future cloud sync
        };

        // 2. Local Save (Current)
        try {
            const history = wx.getStorageSync(STORAGE_KEY) || [];
            history.unshift(enrichedRecord);
            if (history.length > 50) history.length = 50; // Keep slightly more local history
            wx.setStorageSync(STORAGE_KEY, history);

            // 3. Cloud Sync Hook (Future)
            // if (CloudService.isConnected) { CloudService.upload(enrichedRecord); }

            return true;
        } catch (e) {
            console.error('Save failed', e);
            throw e;
        }
    },

    /**
     * Get Assessment History
     * @returns {Promise<Array>}
     */
    getHistory: async () => {
        // Future: Check if needs sync/pull from cloud
        return wx.getStorageSync(STORAGE_KEY) || [];
    },

    /**
     * Check Sync Status (Future Feature)
     */
    checkSyncStatus: async () => {
        return { synced: false, pending: 0 }; // Mock
    }
};

module.exports = DataService;
