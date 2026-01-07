/**
 * Intervention Simulator
 * Calculates projected risk if user improves specific factors.
 */

const { calculateRisk, RISK_LEVELS } = require('./riskCalculator');

function simulateInterventions(currentData) {
    const simulations = [];

    // 1. Quit Smoking (if applicable)
    if (currentData.smoking) {
        const betterData = { ...currentData, smoking: false };
        const newRisk = calculateRisk(betterData);
        if (newRisk.level.label !== calculateRisk(currentData).level.label) { // Only show if level changes
            simulations.push({
                type: 'smoking',
                label: '戒烟',
                desc: '停止吸烟',
                oldLevel: calculateRisk(currentData).level,
                newLevel: newRisk.level
            });
        }
    }

    // 2. Control Hypertension
    if (currentData.hypertension || currentData.sbp >= 140) {
        const betterData = { ...currentData, sbp: 120, hypertension: false }; // Ideal scenario
        const newRisk = calculateRisk(betterData);
        // Often improving BP alone doesn't shift "Risk Category" broadly defined by guidelines 
        // unless it removes the "Hypertension" flag or reduces count.
        // Let's check.
        if (newRisk.level.color !== calculateRisk(currentData).level.color) {
            simulations.push({
                type: 'bp',
                label: '控制血压',
                desc: '将血压降至正常范围 (<130/80)',
                oldLevel: calculateRisk(currentData).level,
                newLevel: newRisk.level
            });
        }
    }

    // 3. Lower Lipids (Simulate Statin effect)
    // Guideline typically aims for < 1.8 or < 2.6.
    // Let's simulate a drop to < 2.6 (Primary prevention typical target)
    if (currentData.ldl > 2.6) {
        const betterData = { ...currentData, ldl: 2.5, tc: 4.5 }; // Ideal
        const newRisk = calculateRisk(betterData);
        if (newRisk.level.color !== calculateRisk(currentData).level.color) {
            simulations.push({
                type: 'lipid',
                label: '降低血脂',
                desc: '将 LDL-C 降至 2.6 mmol/L 以下',
                oldLevel: calculateRisk(currentData).level,
                newLevel: newRisk.level
            });
        }
    }

    return simulations;
}

module.exports = {
    simulateInterventions
};
