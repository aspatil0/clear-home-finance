const MaintenanceConfig = require('../models/MaintenanceConfig');

exports.getConfig = async (req, res) => {
    try {
        const { societyId } = req.params;
        console.log(`[maintenanceController] getConfig for societyId=${societyId}`);
        let config = await MaintenanceConfig.findOne({ where: { societyId } });

        // Return default if not found
        if (!config) {
            console.log(`[maintenanceController] No config found for societyId=${societyId}, returning default`);
            return res.json({
                data: {
                    config: {
                        charges: [
                            { id: "1", label: "Base Maintenance", amount: "3000" },
                            { id: "2", label: "Sinking Fund", amount: "500" },
                            { id: "3", label: "Water Charges", amount: "400" },
                            { id: "4", label: "Parking", amount: "300" },
                            { id: "5", label: "Common Area Electricity", amount: "300" },
                        ],
                        dueDay: 15
                    }
                }
            });
        }

        // If found, return only charges and dueDay in the same shape
        const { charges, dueDay } = config;
        res.json({
            data: {
                config: {
                    charges,
                    dueDay
                }
            }
        });
    } catch (err) {
        console.error(`[maintenanceController] getConfig error:`, err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateConfig = async (req, res) => {
    try {
        const { societyId } = req.params;
        const { charges, dueDay } = req.body;
        console.log(`[maintenanceController] updateConfig for societyId=${societyId}, body=`, req.body);

        let [config, created] = await MaintenanceConfig.findOrCreate({
            where: { societyId },
            defaults: { charges, dueDay }
        });

        if (!created) {
            console.log(`[maintenanceController] Config found, updating...`);
            config.charges = charges;
            config.dueDay = dueDay;
            await config.save();
        } else {
            console.log(`[maintenanceController] New config created.`);
        }

        res.json(config);
    } catch (err) {
        console.error(`[maintenanceController] updateConfig error:`, err);
        res.status(500).json({ error: err.message });
    }
};
