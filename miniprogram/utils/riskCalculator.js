/**
 * ASCVD Risk Calculator
 * Based on: Chinese Guideline for Lipid Management (2023)
 * 
 * Logic Overview:
 * 1. Direct High Risk Classification (LDL-C >= 4.9, TC >= 7.2, or Diabetes + Age >= 40)
 * 2. Risk Factor Counting for remaining individuals.
 * 
 * Note: This is an approximation using the Guideline's Risk Stratification Flowchart
 * principles, as the full China-PAR regression coefficients are not publicly open-sourced 
 * in a verifiable format for this implementation.
 */

const RISK_LEVELS = {
    LOW: { label: '低危', color: '#00b26a' },
    MODERATE: { label: '中危', color: '#ff9800' },
    HIGH: { label: '高危', color: '#f44336' },
    VERY_HIGH: { label: '极高危', color: '#b71c1c' }
};

/**
 * Calculate ASCVD Risk
 * @param {Object} data
 * @param {number} data.age
 * @param {string} data.gender 'male' | 'female'
 * @param {boolean} data.smoking
 * @param {boolean} data.diabetes
 * @param {boolean} data.hypertension (SBP >= 130 or DBP >= 80 or on treatment)
 * @param {number} data.sbp Systolic Blood Pressure
 * @param {number} data.tc Total Cholesterol (mmol/L)
 * @param {number} data.ldl Low-Density Lipoprotein (mmol/L)
 * @param {number} data.hdl High-Density Lipoprotein (mmol/L)
 * @param {boolean} data.hasAscvd History of ASCVD
 */
function calculateRisk(data) {
    const { age, diabetes, ldl, tc, hypertension, sbp, smoking, hasAscvd, hdl, gender } = data;

    // 1. Secondary Prevention: History of ASCVD
    if (hasAscvd) {
        return {
            level: RISK_LEVELS.VERY_HIGH,
            reason: '确诊动脉粥样硬化性心血管疾病 (ASCVD)'
        };
    }

    // 2. Primary Prevention: Direct High Risk Criteria
    // LDL-C >= 4.9 mmol/L (190 mg/dL) or TC >= 7.2 mmol/L (290 mg/dL)
    if (ldl >= 4.9 || tc >= 7.2) {
        return {
            level: RISK_LEVELS.HIGH,
            reason: '严重的高胆固醇血症 (LDL-C ≥ 4.9mmol/L 或 TC ≥ 7.2mmol/L)'
        };
    }

    // Diabetes + Age >= 40
    if (diabetes && age >= 40) {
        return {
            level: RISK_LEVELS.HIGH,
            reason: '糖尿病且年龄 ≥ 40岁'
        };
    }

    // 3. Risk Factor Counting Stratification
    // Count additional risk factors
    let riskFactors = 0;

    // Risk Factor 1: Age (Male >= 45, Female >= 55)
    if ((gender === 'male' && age >= 45) || (gender === 'female' && age >= 55)) {
        riskFactors++;
    }

    // Risk Factor 2: Smoking
    if (smoking) riskFactors++;

    // Risk Factor 3: Low HDL (< 1.0 mmol/L)
    if (hdl < 1.0) riskFactors++;

    // (Note: BMI/Obesity is often a factor but not in our minimal input set yet, assumes focused on blood lipids/pressure)

    // Hypertension Stratification
    // If SBP >= 160 or DBP >= 100 (Grade 2 Hypertension usually pushes risk higher)
    // For this calculator, we use the simplified logic often found in screening tools:

    if (hypertension || sbp >= 130) {
        // Hypertension + (LDL-C criteria or Risk factors)
        if (ldl >= 3.4 || tc >= 5.2) {
            // High LDL/TC with Hypertension is essentially High Risk in many strata
            return {
                level: RISK_LEVELS.HIGH,
                reason: '高血压合并高胆固醇 levels'
            };
        }

        if (riskFactors >= 3) {
            return {
                level: RISK_LEVELS.HIGH,
                reason: '高血压合并3个或以上危险因素'
            };
        }

        if (riskFactors >= 1) {
            return {
                level: RISK_LEVELS.MODERATE,
                reason: '高血压合并1-2个危险因素'
            };
        }

        // Hypertension alone (or with low lipids)
        return {
            level: RISK_LEVELS.LOW, // Or Moderate depending on exact SBP, keeping conservative
            reason: '单纯高血压，伴随危险因素较少'
        };
    }

    // Non-Hypertensive Stratification
    if (riskFactors >= 3) {
        // Even without HBP, multiple factors + borderline lipids can be moderate/high.
        // 2023 Guidelines adhere strictly to the charts.
        // Keep it strictly moderate if LDL not extreme.
        return {
            level: RISK_LEVELS.MODERATE,
            reason: '无高血压，但存在3个或以上危险因素'
        };
    }

    return {
        level: RISK_LEVELS.LOW,
        reason: '未达到中高危标准'
    };
}

/**
 * Get Health Recommendations based on Risk Level
 */
function getRecommendations(riskLevelKey, ldl) {
    let target = '';
    let advice = [];

    // Convert key/label back if needed or use straight simple logic
    const isVeryHigh = riskLevelKey === 'VERY_HIGH';
    const isHigh = riskLevelKey === 'HIGH';
    const isModerate = riskLevelKey === 'MODERATE';

    if (ldl >= 0) { // Check if LDL is valid number
        // Targets based on 2023 Guidelines
        if (riskLevelKey.label === '极高危') {
            target = 'LDL-C < 1.4 mmol/L 且较基线降低幅度 > 50%';
        } else if (riskLevelKey.label === '高危') {
            target = 'LDL-C < 1.8 mmol/L 且较基线降低幅度 > 50%';
        } else if (riskLevelKey.label === '中危') {
            target = 'LDL-C < 2.6 mmol/L';
        } else {
            target = 'LDL-C < 3.4 mmol/L'; // Low risk
        }
    }

    advice.push('保持健康饮食：低盐低脂，多吃蔬菜水果和全谷物。');
    advice.push('规律运动：每周至少150分钟中等强度有氧运动。');
    advice.push('戒烟限酒：彻底戒烟，限制酒精摄入。');

    if (isHigh || isVeryHigh) {
        advice.push('**药物治疗**：请咨询医生启动或强化降脂治疗（如他汀类药物）。');
        advice.push('**定期监测**：建议每3-6个月复查血脂于肝功能。');
    }

    return { target, advice };
}

module.exports = {
    calculateRisk,
    getRecommendations,
    RISK_LEVELS
};
